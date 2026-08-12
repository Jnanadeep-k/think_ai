import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../features/auth/authSlice';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Branding from '../../components/auth/Branding';
import FeedbackHeader from '../../components/auth/FeedbackHeader';
import ErrorAlert from '../../components/auth/ErrorAlert';
import CodeTerminal from '../../components/auth/CodeTerminal';
import { getRegisterErrorMessage } from '../../utils/authErrors';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      registerUser({ name, email, password })
    );
    if (registerUser.fulfilled.match(result)) {
      navigate('/learner');
    }
  };

  return (
    <div className="h-screen w-full grid md:grid-cols-2 bg-[#0B0F19] text-white relative overflow-hidden">
      <div className="ambient-glow animate-float top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/20" />
      <div className="ambient-glow animate-float-delayed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/20" />
      <div className="absolute inset-0 bg-grid-masked pointer-events-none" />

      <div className="hidden md:flex h-full flex-col justify-center items-center p-8 relative z-10">
        <CodeTerminal />
      </div>

      <div className="flex h-full flex-col items-center justify-center p-6 relative z-10">
        <div className="glass-panel w-full max-w-md p-8 lg:p-10 rounded-2xl relative mb-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <Branding size="medium" />

          <ErrorAlert message={getRegisterErrorMessage(error)} />

          <FeedbackHeader
            title="Set up your credentials to start your journey.."
            align="left"
          />

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-4">
            <InputField
              label="Full Name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
              required
            />
            <InputField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="username"
              required
            />
            <InputField
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              label={loading ? 'Begin Sequence...' : 'Begin Registration'}
            />
          </form>
        </div>

        <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Log in
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            <Link to="/" className="text-[#C77DFF] font-semibold hover:text-[#A435F0] transition-colors">
              ← Back to Home Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}