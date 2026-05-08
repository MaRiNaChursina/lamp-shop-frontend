export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export async function parseJsonResponse(response) {
  if (response.status === 204) return null
  const text = await response.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }
  if (!response.ok) {
    const err = body && typeof body === 'object' ? body.error : null
    const message = err?.message || response.statusText || 'Ошибка запроса'
    throw new ApiError(message, response.status, err?.code, err?.details)
  }
  return body
}

export function orderServiceHeaders(sessionId) {
  const h = { 'X-Session-Id': sessionId }
  return h
}

export function jsonHeaders(sessionId) {
  return {
    'Content-Type': 'application/json',
    'X-Session-Id': sessionId,
  }
}
