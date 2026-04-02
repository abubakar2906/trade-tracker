const API_URL = process.env.NEXT_PUBLIC_API_URL

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getTokenFromCookie()
  const baseUrl = API_URL ? API_URL.trim() : ''

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Something went wrong')
    } else {
      const textError = await res.text()
      throw new Error(`Server Error: ${res.statusText || res.status}. Response: ${textError.slice(0, 50)}...`)
    }
  }

  const contentType = res.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return res.json()
  }
  return res.text()
}

export function saveToken(token: string) {
  // Store only in a cookie (not localStorage) to reduce XSS attack surface.
  // SameSite=Strict prevents CSRF. Secure ensures HTTPS-only in production.
  const isSecure = location.protocol === 'https:'
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict${isSecure ? '; Secure' : ''}`
}

export function clearToken() {
  document.cookie = 'token=; path=/; max-age=0; SameSite=Strict'
}

// --- Broker API methods ---

export async function getBrokerAccounts() {
  return apiFetch('/api/broker')
}

export async function connectBrokerAccount(data: any) {
  return apiFetch('/api/broker/connect', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function syncBrokerAccount(id: string) {
  return apiFetch(`/api/broker/${id}/sync`, {
    method: 'POST',
  })
}

export async function deleteBrokerAccount(id: string) {
  return apiFetch(`/api/broker/${id}`, {
    method: 'DELETE',
  })
}

export async function uploadCsvTrades(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const token = getTokenFromCookie()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  
  const res = await fetch(`${baseUrl}/api/import/csv`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
  
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to upload CSV')
  return data
}

export async function getNews() {
  return apiFetch('/api/news')
}