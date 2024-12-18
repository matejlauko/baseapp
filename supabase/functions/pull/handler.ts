import { and, eq, gt, max } from 'drizzle-orm'
import { Context } from 'hono'
import { PatchOperation } from 'replicache'
import { createItemSchema, Items, SyncClients } from '../_database/schema.ts'
import { ITEMS_PREFIX } from '../_database/shared.ts'
import { AuthContextVariables } from '../_shared/auth.ts'
import { db } from '../_shared/db.ts'
import { PullResponse, SyncPullReqData } from '../_shared/sync-types.ts'

export type PullSyncContextVariables = { clientGroupID: string }

export type PullSyncContext = Context<{
  Variables: AuthContextVariables & PullSyncContextVariables
}>

async function getLastGlobalRevision(
  tx: Parameters<Parameters<(typeof db)['transaction']>[0]>[0]
): Promise<bigint> {
  const lastRevRow = await tx.select({ rev: max(SyncClients.revision) }).from(SyncClients)
  return lastRevRow[0]?.rev ?? 0n
}

export async function pullSyncHandler(
  c: PullSyncContext,
  data: SyncPullReqData
): Promise<PullResponse> {
  const { clientGroupID, cookie } = data
  c.set('clientGroupID', clientGroupID)

  const fromRevision = BigInt(cookie ?? 0)

  return await db.transaction(async (tx) => {
    const currentRev = await getLastGlobalRevision(tx)

    if (fromRevision > currentRev) {
      throw new Error(
        `fromRevision ${fromRevision} is from the future - aborting. This can happen in development if the server restarts. In that case, clear application data in browser and refresh.`
      )
    }

    const changedClients = await tx
      .select({
        id: SyncClients.id,
        lastMutationId: SyncClients.lastMutationId,
      })
      .from(SyncClients)
      .where(
        and(
          eq(SyncClients.clientGroupId, clientGroupID),
          gt(SyncClients.revision, fromRevision)
          // eq(Items.userId, userId), // -- TODO: implement RLS
        )
      )

    const lastMutationIDChanges = Object.fromEntries(
      changedClients.map((c) => [c.id, c.lastMutationId])
    )

    const changedItems = await tx
      .select()
      .from(Items)
      .where(
        and(
          // eq(Items.userId, userId), // -- TODO: implement RLS
          gt(Items.revision, fromRevision)
        )
      )

    const itemsPatch: PatchOperation[] = []

    for (const item of changedItems) {
      const { id, revision } = item

      if (item.deleted) {
        if (revision > fromRevision) {
          itemsPatch.push({
            op: 'del',
            key: `${ITEMS_PREFIX}/${id}`,
          })
        }
      } else {
        try {
          const value = createItemSchema.parse(item)
          itemsPatch.push({
            op: 'put',
            key: `${ITEMS_PREFIX}/${id}`,
            value,
          })
        } catch (e) {
          console.error('Error parsing item', item, e)
        }
      }
    }

    const response: PullResponse = {
      lastMutationIDChanges,
      cookie: Number(currentRev),
      patch: itemsPatch,
    }

    return response
  })
}
