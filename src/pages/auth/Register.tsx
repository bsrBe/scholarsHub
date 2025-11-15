import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { User, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        if (result.requiresConfirmation) {
          setSuccessMessage(result.message || 'Please verify your email. Confirmation link sent.');
          setSuccess(true);
        } else {
          // Auto-login was successful, redirect
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      } else {
        setFormError(result.error || 'Registration failed');
      }
    } catch (error) {
      setFormError(error.message || 'An error occurred during registration');
    }
  };

  if (success) {
    return (
      <div className="w-full">
        <Card className="w-full py-8 px-8 mb-8 shadow-lg border border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
            <CardDescription className="text-center text-green-600">
              {successMessage || `We've sent a confirmation link to ${formData.email}. Please check your inbox and verify your email to continue.`}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild variant="link">
              <Link to="/login">Back to login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="w-full py-8 px-8 mb-8 shadow-lg border border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                state={{ from: location.state?.from }}
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
