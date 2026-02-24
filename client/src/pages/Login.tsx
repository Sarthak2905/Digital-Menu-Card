import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(regForm.name, regForm.email, regForm.password);
      toast.success('Account created! Welcome to Digital Café 🎉');
      navigate('/');
    } catch {
      toast.error('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-logo">☕ Digital Café</div>
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="your@email.com" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" className="form-input" required />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} placeholder="Your name" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="your@email.com" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="••••••••" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" value={regForm.confirm} onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })} placeholder="••••••••" className="form-input" required />
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="auth-hint">
            {tab === 'login' ? (
              <>Don't have an account? <button className="link-btn" onClick={() => setTab('register')}>Register</button></>
            ) : (
              <>Already have an account? <button className="link-btn" onClick={() => setTab('login')}>Login</button></>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
