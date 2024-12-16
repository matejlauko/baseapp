export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | {
      success: false
      error?: string
      data: T // Easier typing for successful response data
    }

const apiHost = import.meta.env.VITE_API_URL
const apiFnBasePath = import.meta.env.VITE_API_FN_BASE_PATH

export const API_URL = `${apiHost}${apiFnBasePath}`

export async function request<T = unknown>(
  path: string,
  {
    method = 'GET',
    data,
    authToken,
    includeCredentials = false,
  }: {
    method?: Request['method']
    data?: object
    authToken?: string
    includeCredentials?: boolean
  } = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  const opts: RequestInit = {
    headers,
    method,
    // TODO: custom auth toke in cookie so it's passed automatically
    credentials: includeCredentials ? 'include' : 'same-origin',
  }

  if (data) {
    opts.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${API_URL}${path}`, opts)

    if (response.ok) {
      // status 200-299
      return await response.json()
    }

    const errorBody = await response.text()
    let errorMessage = response.statusText || 'Unknown error occurred'

    try {
      const errorJson = JSON.parse(errorBody)
      if (errorJson.error) {
        errorMessage = errorJson.error
      }
    } catch {
      if (errorBody) {
        errorMessage = errorBody
      }
    }

    const customError = new Error(`HTTP Error ${response.status}: ${errorMessage}`)
    Object.assign(customError, {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      method: opts.method,
      requestBody: opts.body,
      responseBody: errorBody,
    })

    throw customError
  } catch (error) {
    console.error('Fetch Error', error)

    throw error
  }
}
