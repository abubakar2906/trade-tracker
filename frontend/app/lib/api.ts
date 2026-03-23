const API_URL = process.env.NEXT_PUBLIC_API_URL

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getTokenFromCookie()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Something went wrong')
  }

  return res.json()
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