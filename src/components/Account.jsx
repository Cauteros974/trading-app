import React from "react";
import { supabase } from "../../supabaseClient";
import { motion } from "framer-motion";

const Account = ({ session }) => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          alert(error.message);
        }
    };

    return(
        <motion.div
            className="account-container"
            initial={{ opacity: 0, scale: 0,9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Personal Account</h2>
            <p> Welcome, **{session.user.email}**!</p>
            <button onClick={handleLogout} className="logout-button">
                Exit
            </button>
        </motion.div>
    );
};

export default Account;