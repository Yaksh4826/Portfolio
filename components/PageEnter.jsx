"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Subtle route enter — respects prefers-reduced-motion. */
export default function PageEnter({ children }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return children;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
