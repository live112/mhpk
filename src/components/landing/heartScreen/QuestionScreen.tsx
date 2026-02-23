import { INSIST_SUBTEXTS, NO_RESPONSES } from "data/homeData";
import { motion } from "framer-motion";

interface Props {
  noCount: number;
  onYes: () => void;
  onNo: () => void;
}

export function QuestionScreen({ noCount, onYes, onNo }: Props) {
  return (
    <motion.div
      key={`question-${noCount}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: noCount > 0 ? [-3, 3, -3] : 0,
        }}
        transition={{
          scale: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
          rotate: { repeat: Infinity, duration: 0.5 },
        }}
        className="text-9xl md:text-[10rem] mb-4 select-none"
        style={{ filter: "drop-shadow(0 0 30px rgba(236,72,153,0.5))" }}
      >
        ♥
      </motion.div>

      <motion.h1
        key={`title-${noCount}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-2"
      >
        {noCount === 0 ? "¿me amas?" : NO_RESPONSES[noCount - 1]}
      </motion.h1>

      {noCount > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 dark:text-slate-400 mb-6 text-lg"
        >
          {INSIST_SUBTEXTS[noCount - 1]}
        </motion.p>
      )}

      <div className="flex gap-4 justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onYes}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xl shadow-lg shadow-pink-300/40 dark:shadow-pink-900/40"
        >
          Sí
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNo}
          animate={{ scale: Math.max(0.7 - noCount * 0.1, 0.5) }}
          transition={{ type: "spring" }}
          className="px-8 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-lg"
        >
          No
        </motion.button>
      </div>
    </motion.div>
  );
}
