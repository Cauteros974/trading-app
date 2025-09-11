import React from "react";
import { motion } from "framer-motion";

const Portfolio = ({ Portfolio}) => {
    return(
        <motion.div
        className="portfolio-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
    );
};