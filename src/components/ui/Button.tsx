"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
}

export default function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  const base =
    "group inline-flex items-center gap-3 rounded-full px-7 py-4 label font-medium transition-colors duration-300";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-violet"
      : "bg-transparent text-black border border-border hover:border-black";

  return (
    <motion.button
      data-cursor="interactive"
      whileTap={{ scale: 0.96 }}
      className={clsx(base, styles, className)}
      {...props}
    >
      <span>{children}</span>
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
    </motion.button>
  );
}
