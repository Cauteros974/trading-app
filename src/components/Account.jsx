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
};

export default Account;