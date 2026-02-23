export const BackgroundElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-px bg-gradient-to-r from-transparent via-blue-400/30 dark:via-blue-500/20 to-transparent rotate-45 animate-pulse"></div>
    <div
      className="absolute top-1/3 right-1/4 w-80 h-px bg-gradient-to-r from-transparent via-purple-400/30 dark:via-purple-500/20 to-transparent -rotate-45 animate-pulse"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute bottom-1/3 left-1/3 w-72 h-px bg-gradient-to-r from-transparent via-cyan-400/30 dark:via-cyan-500/20 to-transparent rotate-12 animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>

    <div className="absolute top-20 left-20 text-6xl text-pink-400/20 dark:text-pink-500/15 animate-float select-none">
      ♥
    </div>
    <div
      className="absolute top-40 right-32 text-5xl text-purple-400/20 dark:text-purple-500/15 animate-float select-none"
      style={{ animationDelay: "2s" }}
    >
      ♥
    </div>
    <div
      className="absolute bottom-32 left-1/4 text-8xl text-cyan-400/15 dark:text-cyan-500/10 animate-float select-none"
      style={{ animationDelay: "4s" }}
    >
      ♥
    </div>
    <div
      className="absolute bottom-40 right-32 text-6xl text-indigo-400/20 dark:text-indigo-500/15 animate-float select-none"
      style={{ animationDelay: "6s" }}
    >
      ♥
    </div>
  </div>
);
