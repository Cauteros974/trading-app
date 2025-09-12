import React, { use, useState } from "react";
import { supabase } from "../../supabaseClient";
import { motion } from "framer-motion";

const Auth = () => {
    const[ loading, setLoading ] = useState(null);
    const[ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isSignin, setIsSignIn] = useState(true);

    const handleAuth = async(e) =>{
        e.preventDefault();
        setLoading(true);

        const { error } = isSignin
        ? await supabase.auth.signInWithPassword({ email, password})
        : await supabase.auth.signUp({ email, password})

        if (error) {
            alert(error.message);
        } else{
            alert(isSignin ? 'Successful login!' : 'Check your email for confirmation');
        }

        setLoading(false);
    };

    return(
        <motion.div 
        className="auth-container"
        initial= {{ opacity: 0, scale: 0.9}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        >
            <h2>{isSignin ? 'SignIn' : 'SingUp'}</h2>
            <form onSubmit={handleAuth} className="auth-free">
                <input 
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Your password"
                    value={password}
                    required
                    onChange={(e) => serPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : isSignin ? 'SignIn' : 'SignUp'}
                </button>
            </form>

            <button onClick={() => setIsSignIn(!isSignIn)} className="toggle-auth"> 
                {isSignIn ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>

        </motion.div>
    );
};

export default Auth;