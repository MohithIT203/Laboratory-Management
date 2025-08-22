// FadeWrapper.jsx
import React from "react";
import { motion } from "framer-motion";

const FadeWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}   // Start transparent
      animate={{ opacity: 1 }}   // Fade to visible
      exit={{ opacity: 0 }}      // Fade out when leaving
      transition={{ duration: 0.1 }} // Speed of fade
    >
      {children}
    </motion.div>
  );
};

export default FadeWrapper;
