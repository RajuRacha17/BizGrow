export function getAuthHeaders() {
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const userObj = savedUser ? JSON.parse(savedUser) : null;
  const userId = userObj?._id || userObj?.email || 'anonymous';
  return {
    'x-user-id': userId,
  };
}

export async function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}
