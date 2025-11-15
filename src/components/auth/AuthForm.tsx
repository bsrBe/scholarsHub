import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
}

export function AuthForm({ type, onSubmit, isLoading = false }: AuthFormProps) {
  const isSignIn = type === 'signin';
  const title = isSignIn ? 'Welcome back' : 'Create an account';
  const buttonText = isSignIn ? 'Sign In' : 'Sign Up';
  const linkText = isSignIn ? "Don't have an account?" : 'Already have an account?';
  const linkHref = isSignIn ? '/signup' : '/signin';
  const linkAction = isSignIn ? 'Sign up' : 'Sign in';

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {isSignIn ? 'Enter your credentials to access your account' : 'Enter your details to create an account'}
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="h-12"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isSignIn && (
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              minLength={8}
              className="h-12"
            />
            {!isSignIn && (
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters long
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
          {isLoading ? 'Processing...' : buttonText}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {linkText}{' '}
          <Link to={linkHref} className="font-medium text-primary hover:underline">
            {linkAction}
          </Link>
        </div>
      </form>
    </div>
  );
}
