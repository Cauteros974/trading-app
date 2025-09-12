import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignIn
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert(isSignIn ? 'Successful login!' : 'Check your email for confirmation');
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{isSignIn ? 'SignIn' : 'SignUp'}</h2>
      <form onSubmit={handleAuth} className="auth-form">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignIn ? 'SignIn' : 'SignUp'}
        </button>
      </form>
      <button onClick={() => setIsSignIn(!isSignIn)} className="toggle-auth">
        {isSignIn ? 'Need an account? SignUp' : 'Already have an account? SignIn'}
      </button>
    </motion.div>
  );
};

export default Auth;