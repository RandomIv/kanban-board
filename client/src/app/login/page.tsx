'use client';
import AuthForm from '../../components/AuthForm/AuthForm';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const handleLogin = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    login(data.accessToken);
    window.location.href = '/';
  };

  return <AuthForm title="Login" buttonText="Login" onSubmit={handleLogin} />;
}
