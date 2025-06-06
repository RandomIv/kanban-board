import AuthForm from '../../components/AuthForm/AuthForm';

export default function RegisterPage() {
  const handleRegister = (email: string, password: string) => {
    console.log('Register with:', email, password);
  };

  return (
    <AuthForm
      title="Register"
      buttonText="Register"
      onSubmit={handleRegister}
    />
  );
}
