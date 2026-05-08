const STORAGE_KEY = 'lampshop_session_id'

export function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (id && id.length > 0) return id
    id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}`
  }
}
