import { useState } from "react";
import { motion } from "framer-motion";
import { animationStyles } from "@styles/animationStyles";
import { BackgroundElements } from "@components/landing/backgroundElements";
import { GameSnake } from "./GameSnake";

interface GameIntroProps {
  onStart?: () => void;
}

const instructions = [
  {
    icon: "",
    title: "Controlame",
    text: "Desliza en cualquier direccion o usa los botones en pantalla para moverme por ahí y juntar las cositas.",
  },
  {
    icon: "",
    title: "Recoge tus cosas favoritas, mi amor",
    text: "Apareceran objetos especiales que te dan puntos extra o habilidades.",
  },
  {
    icon: "",
    title: "Esquiva los obstaculos",
    text: "El mapa tiene obstáculos, ten cuidado con ellos preciosa.",
  },
  {
    icon: "",
    title: "No me choques",
    text: "Evita las paredes, los obstaculos y que no me pegue a mi mismo.",
  },
  {
    icon: "",
    title: "Se pone mas dificil",
    text: "Cuantas mas cositas tengas, ire con mas prisa y mas obstaculos apareceran.",
  },
];

export function GameIntro({ onStart }: GameIntroProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <GameSnake
        sprites={{
          headUrl: "images/head.png",
          itemUrl: [
            "images/corrector.png",
            "images/malteada.png",
            "images/papitas.png",
            "images/gerberas.png",
            "images/chocolate.png",
            "images/lana.png",
            "images/aguachile.png",
          ],
          gameOverUrl: "images/triste.png",
          gameOverHappyUrl: "images/feli.png",
        }}
        onBack={() => setPlaying(false)}
      />
    );
  }

  const handleStart = () => {
    if (onStart) onStart();
    else setPlaying(true);
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <BackgroundElements />

        <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto w-full px-5 pt-10 pb-28">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-2 animate-float inline-block">♥</div>
            <h1 className="text-4xl font-melody text-indigo-700 dark:text-indigo-300 leading-tight">
              Cosas para mi amorcito
            </h1>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="bg-white/55 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/50 dark:border-white/10"
          >
            <h2 className="text-2xl font-melody text-pink-500 dark:text-pink-400 mb-2 flex items-center gap-1">
              ¿Que pasa?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-melody leading-relaxed italic">
              Mi beba esta muy triste y tengo que juntar sus cositas favoritas
              para verla feliii
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="bg-white/55 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/50 dark:border-white/10"
          >
            <h2 className="text-2xl font-melody text-indigo-600 dark:text-indigo-300 mb-4 flex items-center gap-1">
              ¿Que tienes que hacer?
            </h2>

            <div className="space-y-4">
              {instructions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-2xl leading-none flex-shrink-0 mt-0.5">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-slate-800 dark:text-slate-100 font-melody font-semibold leading-tight">
                      {item.title}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-melody leading-snug mt-0.5">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="fixed bottom-0 left-0 right-0 z-20 px-5 pb-8 pt-4 bg-gradient-to-t from-indigo-50 dark:from-indigo-950 to-transparent max-w-md mx-auto"
        >
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 active:from-indigo-600 active:to-purple-600 text-white text-xl font-melody shadow-lg shadow-indigo-200 dark:shadow-indigo-900 active:scale-95 transition-transform select-none"
          >
            Jugar
          </button>
        </motion.div>
      </div>
    </>
  );
}
