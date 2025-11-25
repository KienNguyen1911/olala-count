import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NeoButton from '../components/ui/NeoButton';
import NeoInput from '../components/ui/NeoInput';
import { useLocation } from 'react-router-dom';

interface AuthPageProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neo-primary rounded-full border-4 border-black mix-blend-multiply opacity-50 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neo-secondary rounded-full border-4 border-black mix-blend-multiply opacity-50 blur-3xl" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="
          relative z-10
          w-full max-w-md 
          bg-white 
          border-4 border-black 
          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
          p-8 
          rounded-xl
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-2 tracking-tighter italic">NEO<br/>COUNT</h1>
          <p className="font-bold text-gray-500 bg-neo-warning inline-block px-2 border border-black transform -rotate-2">
            OWN YOUR TIME
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NeoInput 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <NeoInput 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <NeoButton fullWidth type="submit" variant="primary" className="mt-4">
            ENTER DASHBOARD
          </NeoButton>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-black flex flex-col gap-3">
          <NeoButton fullWidth variant="outline" type="button" onClick={() => onLogin('google@test.com')}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </NeoButton>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;