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
        />
    )
};

export default Auth;