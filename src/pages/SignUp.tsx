import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUp() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // TODO: Implement sign up logic
    console.log('Signing up with:', { name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-card">
        <AuthForm type="signup" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
