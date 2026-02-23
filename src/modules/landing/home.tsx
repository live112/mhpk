import { AnimatePresence } from "framer-motion";
import { animationStyles } from "@styles/animationStyles";
import { BackgroundElements } from "@components/landing/backgroundElements";
import { HeartScreen } from "@components/landing/heartScreen/HeartScreen";
import { PresentationScreen } from "@components/landing/presentation/PresentationScreen";
import { useState } from "react";

export function Home() {
  const [noCount, setNoCount] = useState(0);
  const [showPresentation, setShowPresentation] = useState(false);
  const [surrendered, setSurrendered] = useState(false);

  const handleYes = () => setShowPresentation(true);

  const handleNo = () => {
    const next = noCount + 1;
    if (next >= 3) {
      setSurrendered(true);
      setTimeout(() => setShowPresentation(true), 2800);
    } else {
      setNoCount(next);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <BackgroundElements />
        <AnimatePresence mode="wait">
          {!showPresentation ? (
            <HeartScreen
              noCount={noCount}
              surrendered={surrendered}
              onYes={handleYes}
              onNo={handleNo}
            />
          ) : (
            <PresentationScreen />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
