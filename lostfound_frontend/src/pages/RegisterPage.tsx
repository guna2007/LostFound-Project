import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toastSuccess, toastError } from '@/lib/ui/toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { register } from '@/lib/api';
import { useAuth } from '@/lib/hooks';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isLoggedIn, loginWithResponse } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/dashboard');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (password !== confirm) {
      toastError('Passwords do not match');
      return;
    }
    
    if (!accept) {
      toastError('Please accept the Terms & Conditions');
      return;
    }
    
    setLoading(true);
    
    try {
  const result = await register(email, password, name);
  toastSuccess(result.message);
      
      // Auto-login if user data is returned
      if (result.user) {
        loginWithResponse(result.user);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      toastError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur" />
      <div className="relative rounded-2xl border bg-white/70 p-6 shadow-lg backdrop-blur">
        <h1 className="mb-1 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-2xl font-extrabold text-transparent">Create account</h1>
        <p className="mb-4 text-gray-600">Join the community</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Input type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            I accept the Terms & Conditions
          </label>
          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-700 hover:underline">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

