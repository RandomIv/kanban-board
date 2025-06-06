export interface RegisterUserRequest {
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}
export type LoginUserResponse = {
  message: string;
  accessToken: string;
  userId: string;
};

export type RegisterUserResponse = {
  message: string;
  accessToken: string;
  userId: string;
};
export interface AuthErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}
