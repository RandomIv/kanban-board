'use client';
import AuthForm from '../../components/AuthForm/AuthForm';
import { loginUser } from '@/lib/api/auth';

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    localStorage.setItem('token', data.accessToken);
    console.log('User login successfully:', data);
    window.location.href = '/';
  };

  return <AuthForm title="Login" buttonText="Login" onSubmit={handleLogin} />;
}
