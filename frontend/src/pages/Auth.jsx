import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, {
        username,
        password
      });

      setToken(response.data.token);
      toast.success(`Welcome to VisaroAI, ${response.data.username}!`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #1a0f0a 100%)' }}>
      <Toaster position="top-center" />
      
      {/* Background decoration with glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-brand-accent opacity-10 rounded-full blur-3xl glow-animation" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-accent opacity-10 rounded-full blur-3xl glow-animation" style={{ animationDelay: '1s' }} />
      </div>

      <div className="glass-strong p-8 sm:p-12 w-full max-w-md relative z-10 fade-in">
        {/* Logo with glow */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 brand-glow" style={{ fontFamily: 'Space Grotesk' }}>
            <span className="brand-accent">VisaroAI</span>
          </h1>
          <p className="text-base text-gray-400">AI-Powered Immigration Petition System</p>
          <p className="text-xs text-gray-500 mt-2">Specialized for EB-2 NIW Excellence</p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              data-testid="auth-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              data-testid="auth-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            data-testid="auth-submit-button"
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner" />
                Processing...
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="mt-6 text-center">
          <button
            data-testid="auth-toggle-button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-brand-accent transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Purpose-built for EB-1A, EB-2 NIW, and O-1 visa petitions<br />
            Trained on USCIS precedent decisions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
