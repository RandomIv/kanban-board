import { apiUrl } from '@/utils/api';
import {
  AuthErrorResponse,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from '@/types/Auth';

export const registerUser = async (
  email: string,
  password: string,
): Promise<RegisterUserResponse> => {
  const res = await fetch(apiUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData: AuthErrorResponse = await res.json();
    throw new Error(errorData.message || `Error: ${res.status}`);
  }

  return res.json() as Promise<RegisterUserResponse>;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginUserResponse> => {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData: AuthErrorResponse = await res.json();
    throw new Error(errorData.message || `Error: ${res.status}`);
  }

  return res.json() as Promise<LoginUserResponse>;
};

// Alternative version with request objects
export const registerUserWithObject = async (
  userData: RegisterUserRequest,
): Promise<RegisterUserResponse> => {
  const res = await fetch(apiUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData: AuthErrorResponse = await res.json();
    throw new Error(errorData.message || `Error: ${res.status}`);
  }

  return res.json() as Promise<RegisterUserResponse>;
};

export const loginUserWithObject = async (
  credentials: LoginUserRequest,
): Promise<LoginUserResponse> => {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData: AuthErrorResponse = await res.json();
    throw new Error(errorData.message || `Error: ${res.status}`);
  }

  return res.json() as Promise<LoginUserResponse>;
};
