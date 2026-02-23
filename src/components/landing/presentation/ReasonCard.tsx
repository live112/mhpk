import { motion } from "framer-motion";

interface Props {
  text: string;
  index: number;
  total: number;
}

export function ReasonCard({ text, index, total }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center text-center px-8 select-none"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-5xl mb-8 block"
      >
        ♥
      </motion.span>

      <p className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white leading-relaxed mb-10">
        {text}
      </p>

      <div className="flex gap-2 mt-4">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === index ? 1.3 : 1 }}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i === index
                ? "bg-pink-500"
                : i < index
                  ? "bg-pink-300 dark:bg-pink-700"
                  : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-slate-400 dark:text-slate-500 mt-6">
        desliza con tus deditos →
      </p>
    </motion.div>
  );
}
