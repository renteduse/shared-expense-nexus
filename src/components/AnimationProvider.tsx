
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimationProviderProps {
  children: React.ReactNode;
}

interface PageTransitionProps {
  children: React.ReactNode;
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const PopIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-64px)]"
    >
      {children}
    </motion.div>
  );
};

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
}) => {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
};

export const MotionList = motion.ul;
export const MotionListItem = motion.li;
export const MotionDiv = motion.div;

export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
