import { Context } from 'hono'
import { StatusCode } from 'hono/utils/http-status'
import { ZodType } from 'zod'

export interface FailApiResponse {
  success: false
  error?: string
  issues?: unknown
}

export interface SuccessApiResponse<T = unknown> {
  success: true
  data: T
}

export type ApiResponse<T = unknown> = SuccessApiResponse<T> | (FailApiResponse & { data: object }) // Easier typing for successful response data

export function jsonRes<T extends object>(
  c: Context,
  data: T,
  { schema }: { schema?: ZodType<T> } = {}
) {
  let payload = data

  if (schema) {
    try {
      payload = schema.parse(data) as T
    } catch (error) {
      console.error('Res data', error)

      return failRes(c, 'Bad res data - Zod data validation failed', 400, 'Bad response')
    }
  }

  return c.json<SuccessApiResponse<T>>({ success: true, data: payload })
}

export function failRes(
  c: Context,
  error: string,
  status: StatusCode = 500,
  statusText: string = 'Internal Server Error',
  { issues }: { issues?: unknown } = {}
) {
  return c.json<FailApiResponse>({ success: false, error, issues }, status, {
    statusText,
  })
}
