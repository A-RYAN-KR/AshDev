const API_BASE_URL = '/api';

export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Logout failed');
}

export async function refreshToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Token refresh failed');
  return response.json();
}

export async function fetchDailyRevenue() {
  const response = await fetch(`${API_BASE_URL}/revenue/daily`);
  if (!response.ok) throw new Error('Failed to fetch revenue data');
  return response.json();
}

export async function fetchTableStatus() {
  const response = await fetch(`${API_BASE_URL}/tables/status`);
  if (!response.ok) throw new Error('Failed to fetch table status');
  return response.json();
}

export async function fetchMenu() {
  const response = await fetch(`${API_BASE_URL}/menu`);
  if (!response.ok) throw new Error('Failed to fetch menu');
  return response.json();
}

export async function createMenuItem(data: Omit<MenuItem, 'id'>) {
  const response = await fetch(`${API_BASE_URL}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create menu item');
  return response.json();
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update menu item');
  return response.json();
}

export async function deleteMenuItem(id: string) {
  const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete menu item');
}