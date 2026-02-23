import { finalMessage } from "data/homeData";
import { motion } from "framer-motion";

export function FinalMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="flex flex-col items-center justify-center text-center px-8"
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="text-7xl mb-8"
      >
        ♥
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4"
      >
        {finalMessage.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl md:text-2xl text-purple-500 dark:text-purple-400"
      >
        {finalMessage.subtitle}
      </motion.p>
    </motion.div>
  );
}
