'use client';
import AuthForm from '../../components/AuthForm/AuthForm';
import { registerUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const register = useAuthStore((state) => state.login);
  const handleRegister = async (email: string, password: string) => {
    const data = await registerUser(email, password);
    register(data.accessToken);
    window.location.href = '/';
  };

  return (
    <AuthForm
      title="Register"
      buttonText="Register"
      onSubmit={handleRegister}
    />
  );
}
