import { apiUrl } from '@/utils/api';

export const registerUser = async (email: string, password: string) => {
  const res = await fetch(apiUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Error: ${res.status}`);
  }

  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Error: ${res.status}`);
  }

  return res.json();
};
