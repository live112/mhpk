import { AnimatePresence, motion } from "framer-motion";
import { QuestionScreen } from "./QuestionScreen";
import { SurrenderScreen } from "./SurrenderScreen";

interface Props {
  noCount: number;
  surrendered: boolean;
  onYes: () => void;
  onNo: () => void;
}

export function HeartScreen({ noCount, surrendered, onYes, onNo }: Props) {
  return (
    <motion.div
      key="heart-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      <AnimatePresence mode="wait">
        {surrendered ? (
          <SurrenderScreen />
        ) : (
          <QuestionScreen noCount={noCount} onYes={onYes} onNo={onNo} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
