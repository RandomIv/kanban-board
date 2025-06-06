'use client';
import AuthForm from '../../components/AuthForm/AuthForm';
import { registerUser } from '@/lib/api/auth';

export default function RegisterPage() {
  const handleRegister = async (email: string, password: string) => {
    const data = await registerUser(email, password);
    localStorage.setItem('token', data.accessToken);
    console.log('User registered successfully:', data);
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
