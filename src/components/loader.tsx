import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { AnimatePresence, motion } from "framer-motion";

interface LoaderProps {
  mostrarLoader: boolean;
}

export function Loader({ mostrarLoader }: LoaderProps) {
  return (
    <AnimatePresence>
      {mostrarLoader && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <ClimbingBoxLoader size={20} color="#e9e9e9" loading />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
