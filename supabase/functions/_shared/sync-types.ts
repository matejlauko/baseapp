import type { ClientID, PatchOperation, ReadonlyJSONValue } from 'replicache'
import { z } from 'zod'
import { CreateItem, UpdateItem } from '../_database/schema.ts'

const PULL_VERSION = 1
const PUSH_VERSION = 1
const SCHEMA_VERSION = '1.0.0'

export type Revision = bigint

export type MutationType = {
  clientID: string
  id: number
  name: string
  args: ReadonlyJSONValue
  timestamp: number
}

export type PullResponse = {
  cookie: number // Must be a number because Replicache does numerical comparison
  lastMutationIDChanges: Record<ClientID, number>
  patch: PatchOperation[]
}

const mutationSchema = z.object({
  clientID: z.string(),
  id: z.number(),
  name: z.string(),
  args: z.union([z.record(z.any()), z.string(), z.array(z.any())]),
  timestamp: z.number(),
})

export const syncPushReqDataSchema = z.object({
  clientGroupID: z.string(),
  mutations: z.array(mutationSchema),
  profileID: z.string(),
  pushVersion: z.literal(PUSH_VERSION),
  schemaVersion: z.literal(SCHEMA_VERSION),
})

export type SyncPushReqData = z.infer<typeof syncPushReqDataSchema>

export const syncPullReqDataSchema = z.object({
  clientGroupID: z.string(),
  // cookie: z.string().nullable(),
  cookie: z.number().nullable(), // Must be a number because Replicache does numerical comparison
  profileID: z.string(),
  pullVersion: z.literal(PULL_VERSION),
  schemaVersion: z.literal(SCHEMA_VERSION),
})
export type SyncPullReqData = z.infer<typeof syncPullReqDataSchema>

type M<N extends string, D> = Omit<MutationType, 'name' | 'args'> & {
  name: N
  args: D
}

export type Mutation =
  | M<'setItem', CreateItem>
  | M<'updateItem', UpdateItem>
  | M<'deleteItem', string>

// TODO: specific error responses, maybe?

/**
 * In certain scenarios the server can signal that it does not know about the
 * client. For example, the server might have lost all of its state (this might
 * happen during the development of the server).
 */
export type ClientStateNotFoundResponse = {
  error: 'ClientStateNotFound'
}

/**
 * The server endpoint may respond with a `VersionNotSupported` error if it does
 * not know how to handle the {@link pullVersion}, {@link pushVersion} or the
 * {@link schemaVersion}.
 */
export type VersionNotSupportedResponse = {
  error: 'VersionNotSupported'
  versionType?: 'pull' | 'push' | 'schema' | undefined
}
