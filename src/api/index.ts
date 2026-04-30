// Allow folder to be committed to git and export API calls.

import type { UserRole } from '../types';

export const API_URL = import.meta.env.VITE_API_URL as string;

export async function setUserRole(role: UserRole, token: string) {
  const res = await fetch(`${API_URL}/api/users/me/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    throw new Error('Failed to set role');
  }
}