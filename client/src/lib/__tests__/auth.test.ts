import { loginUser, registerUser } from '../api/auth';
import { LoginUserResponse, RegisterUserResponse } from '@/types/Auth';

global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});

describe('authApi', () => {
  it('should register a user successfully', async () => {
    const mockResponse: RegisterUserResponse = {
      message: 'Registered',
      accessToken: 'fake-token',
      userId: 'user-123',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await registerUser('test@example.com', 'password');

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should login a user successfully', async () => {
    const mockResponse: LoginUserResponse = {
      message: 'Logged in',
      accessToken: 'login-token',
      userId: 'user-456',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await loginUser('test@example.com', 'password');

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw error on failed login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    await expect(loginUser('fail@example.com', 'wrong')).rejects.toThrow(
      'Invalid credentials', // <== цей текст має збігатись з тим, що повертає mock
    );
  });
});
