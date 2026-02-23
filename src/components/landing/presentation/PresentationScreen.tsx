import { AnimatePresence, motion } from "framer-motion";
import { BackgroundElements } from "@components/landing/backgroundElements";
import { FinalMessage } from "./FinalMessage";
import { LandingNavbar } from "@components/landing/landingNavbar";
import { ReasonCard } from "./ReasonCard";
import { reasons } from "data/homeData";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

export function PresentationScreen() {
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < reasons.length - 1) {
      setDirection(1);
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((prev) => prev - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    preventScrollOnSwipe: true,
  });

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 200 : -200 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -200 : 200 }),
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <LandingNavbar />
      <BackgroundElements />

      <div
        {...swipeHandlers}
        className="flex-1 flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait" custom={direction}>
          {finished ? (
            <FinalMessage key="final" />
          ) : (
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              className="w-full max-w-2xl"
            >
              <ReasonCard
                text={reasons[current]}
                index={current}
                total={reasons.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
