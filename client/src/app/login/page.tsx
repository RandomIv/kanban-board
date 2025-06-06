import AuthForm from '../../components/AuthForm/AuthForm';

export default function LoginPage() {
  const handleLogin = (email: string, password: string) => {
    console.log('Login with:', email, password);
  };

  return <AuthForm title="Login" buttonText="Login" onSubmit={handleLogin} />;
}
