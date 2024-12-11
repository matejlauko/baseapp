import { and, eq, max } from 'drizzle-orm'
import { Context } from 'hono'
import { Items, SyncClients, createItemSchema, updateItemSchema } from '../_database/schema.ts'
import { AuthContextVariables } from '../_shared/auth.ts'
import { db } from '../_shared/db.ts'
import { Mutation, SyncPushReqData } from '../_shared/sync-types.ts'

export type PushSyncContextVariables = { clientGroupID: string }

export type PushSyncContext = Context<{
  Variables: AuthContextVariables & PushSyncContextVariables
}>

type Tx = Parameters<Parameters<(typeof db)['transaction']>[0]>[0]

export function pushSyncHandler(c: PushSyncContext, data: SyncPushReqData) {
  const { clientGroupID, mutations } = data
  c.set('clientGroupID', clientGroupID)

  const t0 = Date.now()

  return db.transaction(async (tx) => {
    // Step 1: Get the latest global revision
    const lastRevRow = await tx.select({ rev: max(SyncClients.revision) }).from(SyncClients)
    const lastRev = lastRevRow[0]?.rev ?? 0n
    const nextRev = lastRev + 1n

    console.log(`Latest global revision: ${lastRev}, Next revision: ${nextRev}`)

    // Step 2: Group mutations by clientID
    const mutationsByClient = mutations.reduce(
      (acc, mutation) => {
        if (!acc[mutation.clientID]) {
          acc[mutation.clientID] = []
        }
        acc[mutation.clientID].push(mutation)
        return acc
      },
      {} as Record<string, typeof mutations>
    )

    // Step 3: Process mutations for each client
    for (const [clientID, clientMutations] of Object.entries(mutationsByClient)) {
      await processMutationsForClient(c, tx, clientID, clientMutations, nextRev)
    }

    console.log(`Processed push in ${Date.now() - t0}ms`)

    return { success: true }
  })
}

async function processMutationsForClient(
  c: PushSyncContext,
  tx: Tx,
  clientID: string,
  mutations: SyncPushReqData['mutations'],
  nextRev: bigint
) {
  const clientGroupID = c.get('clientGroupID')
  const userId = c.get('userId')

  // Get client, if exists
  const client = await tx.query.SyncClients.findFirst({
    where: eq(SyncClients.id, clientID),
  })

  const prevMutationID = client?.lastMutationId ?? 0
  let lastMutationID = prevMutationID

  for (const mutation of mutations) {
    // Check if mutation has already been processed
    if (mutation.id <= lastMutationID) {
      console.log(`Mutation ${mutation.id} has already been processed - skipping`)
      continue
    }

    // Check for future mutations
    if (mutation.id > lastMutationID + 1) {
      throw new Error(
        `Mutation ${mutation.id} is from the future - aborting. This can happen in development if the server restarts. In that case, clear application data in browser and refresh.`
      )
    }

    await processMutation(tx, mutation as Mutation, nextRev, userId)

    // Mutation has been processed -- increase lastMutationID
    lastMutationID = mutation.id
  }

  // If client has been updated.
  if (prevMutationID !== lastMutationID) {
    // Update client's lastMutationId and revision (create if not exists)
    await tx
      .insert(SyncClients)
      .values({
        id: clientID,
        clientGroupId: clientGroupID,
        lastMutationId: lastMutationID,
        revision: nextRev,
        userId: userId,
        lastSyncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: SyncClients.id,
        set: {
          lastMutationId: lastMutationID,
          revision: nextRev,
          lastSyncedAt: new Date(),
        },
      })
  }
}

async function processMutation(
  tx: Tx,
  mutation: Mutation,
  nextRev: bigint,
  userId: string
): Promise<void> {
  console.log('Processing mutation:', JSON.stringify(mutation))

  const m = mutation as Mutation

  // Process the mutation
  switch (m.name) {
    case 'setItem':
      await tx
        .insert(Items)
        .values({
          ...createItemSchema.parse(m.args),
          revision: nextRev,
          userId: userId,
        })
        .onConflictDoUpdate({
          target: Items.id,
          set: {
            ...createItemSchema.parse(m.args),
            revision: nextRev,
          },
        })
      break
    case 'updateItem': {
      await tx
        .update(Items)
        .set({
          ...updateItemSchema.parse(m.args),
          revision: nextRev,
        })
        .where(
          and(
            eq(Items.id, m.args.id as string)
            // eq(Items.userId, userId) -- TODO: implement RLS
          )
        )
      break
    }
    case 'deleteItem': {
      await tx
        .update(Items)
        .set({ deleted: true, revision: nextRev })
        .where(
          and(
            eq(Items.id, m.args)
            // eq(Items.userId, userId) -- TODO: implement RLS
          )
        )
      break
    }

    default:
      throw new Error(`Unknown mutation: ${mutation.name}`)
  }
}
