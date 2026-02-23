import { motion } from "framer-motion";

export function SurrenderScreen() {
  return (
    <motion.div
      key="surrender"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-8xl mb-6"
      >
        💔
      </motion.div>
      <p className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-200">
        aunque no me ames
      </p>
      <p className="text-xl md:text-2xl text-purple-500 mt-2">
        quiero que veas esto
      </p>
    </motion.div>
  );
}
