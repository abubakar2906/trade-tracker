const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

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
  localStorage.setItem('token', token)
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
}

export function clearToken() {
  localStorage.removeItem('token')
  document.cookie = 'token=; path=/; max-age=0'
}