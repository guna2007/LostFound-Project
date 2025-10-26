import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toastSuccess, toastError } from '@/lib/ui/toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/dashboard');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toastSuccess('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toastError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur" />
      <div className="relative rounded-2xl border bg-white/70 p-6 shadow-lg backdrop-blur">
        <h1 className="mb-1 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-2xl font-extrabold text-transparent">Welcome back</h1>
        <p className="mb-4 text-gray-600">Log in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <div className="flex items-center justify-between text-sm">
            <a className="text-blue-700 hover:underline" href="#">Forgot password?</a>
          </div>
          <Button type="submit" loading={loading} className="w-full">Login</Button>
          <div className="text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-blue-700 hover:underline">Register</Link>
          </div>
        </form>
        
        {/* Demo Credentials */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 text-sm font-semibold text-blue-900">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-blue-800">
            <p><strong>User:</strong> user@lostfound.com / user123</p>
            <p><strong>Admin:</strong> admin@lostfound.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

 
