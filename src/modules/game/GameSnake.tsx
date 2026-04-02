import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SpriteConfig {
  headUrl?: string;
  bodyUrl?: string;
  itemUrl?: string | string[];
  obstacleUrl?: string;
  gameOverUrl?: string;
  gameOverHappyUrl?: string;
}

interface Props {
  onBack: () => void;
  sprites?: SpriteConfig;
}

type Dir = "up" | "down" | "left" | "right";
type Pt = { x: number; y: number };
type Item = Pt & { id: number; spriteIdx: number };

interface GS {
  snake: Pt[];
  dir: Dir;
  nextDir: Dir;
  obstacles: Pt[];
  items: Item[];
  cols: number;
  rows: number;
  tickCount: number;
  idCounter: number;
  dead: boolean;
}

const CELL = 56; // px per grid cell
const OBSTACLE_N = 4; // obstacles at game start
const BASE_SPEED = 200; // ms per tick
const MIN_SPEED = 100; // fastest possible
const SPEED_DELTA = 4; // ms gained per item collected
const ITEM_EVERY = 20; // ticks between new item spawns
const MAX_ITEMS = 3; // max items on screen at once
const PTS = 12; // points per item

const STAGES = [
  { min: 0, emoji: "😢", label: "My triste" },
  { min: 40, emoji: "😟", label: "Tistee" },
  { min: 80, emoji: "😐", label: "Neutral" },
  { min: 120, emoji: "🙂", label: "Alegre" },
  { min: 140, emoji: "😊", label: "Feliii" },
  { min: 160, emoji: "🥰", label: "Muy feliiii ♥" },
] as const;

function getStage(score: number): (typeof STAGES)[number] {
  let stage: (typeof STAGES)[number] = STAGES[0];
  for (const s of STAGES) if (score >= s.min) stage = s;
  return stage;
}

const rand = (n: number) => Math.floor(Math.random() * n);

function freePt(cols: number, rows: number, taken: Pt[]): Pt | null {
  for (let i = 0; i < 300; i++) {
    const p = { x: rand(cols), y: rand(rows) };
    if (!taken.some((t) => t.x === p.x && t.y === p.y)) return p;
  }
  return null;
}

function isOpposite(a: Dir, b: Dir) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

function makeInitState(
  cols: number,
  rows: number,
  itemSpriteCount: number,
): GS {
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const snake: Pt[] = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
  const obstacles: Pt[] = [];
  for (let i = 0; i < OBSTACLE_N; i++) {
    const p = freePt(cols, rows, [...snake, ...obstacles]);
    if (p) obstacles.push(p);
  }
  const firstItem = freePt(cols, rows, [...snake, ...obstacles]);
  return {
    snake,
    dir: "right",
    nextDir: "right",
    obstacles,
    items: firstItem
      ? [{ ...firstItem, id: 0, spriteIdx: rand(Math.max(1, itemSpriteCount)) }]
      : [],
    cols,
    rows,
    tickCount: 0,
    idCounter: 1,
    dead: false,
  };
}

const ITEM_FALLBACKS = ["#f59e0b", "#10b981", "#ec4899", "#3b82f6", "#8b5cf6"];

type ImgMap = {
  headUrl: HTMLImageElement | null;
  bodyUrl: HTMLImageElement | null;
  itemUrl: HTMLImageElement[];
  obstacleUrl: HTMLImageElement | null;
};

function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  img: HTMLImageElement | null | undefined,
  color: string,
) {
  const px = x * CELL;
  const py = y * CELL;
  if (img?.complete && img.naturalWidth > 0) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = CELL / Math.min(nw, nh);
    const dw = nw * scale;
    const dh = nh * scale;
    const cx = px + CELL / 2;
    const cy = py + CELL / 2;
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  } else {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, 4);
    ctx.fill();
  }
}

function drawArrow(ctx: CanvasRenderingContext2D, head: Pt, dir: Dir) {
  const cx = head.x * CELL + CELL / 2;
  const cy = head.y * CELL + CELL / 2;
  const tip = CELL * 0.3;
  const base = CELL * 0.2;

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 3;
  ctx.beginPath();

  switch (dir) {
    case "right":
      ctx.moveTo(cx + tip, cy);
      ctx.lineTo(cx, cy - base);
      ctx.lineTo(cx, cy + base);
      break;
    case "left":
      ctx.moveTo(cx - tip, cy);
      ctx.lineTo(cx, cy - base);
      ctx.lineTo(cx, cy + base);
      break;
    case "up":
      ctx.moveTo(cx, cy - tip);
      ctx.lineTo(cx - base, cy);
      ctx.lineTo(cx + base, cy);
      break;
    case "down":
      ctx.moveTo(cx, cy + tip);
      ctx.lineTo(cx - base, cy);
      ctx.lineTo(cx + base, cy);
      break;
  }

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFrame(ctx: CanvasRenderingContext2D, gs: GS, imgs: ImgMap) {
  const { snake, dir, obstacles, items, cols, rows } = gs;
  const W = cols * CELL;
  const H = rows * CELL;

  // Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, H);
    ctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * CELL);
    ctx.lineTo(W, j * CELL);
    ctx.stroke();
  }

  // Obstacles
  for (const o of obstacles) {
    drawTile(ctx, o.x, o.y, imgs.obstacleUrl, "#dc2626");
  }

  // Items — each uses its own sprite variant + matching fallback color
  ctx.shadowBlur = 10;
  for (const it of items) {
    const si = it.spriteIdx % Math.max(1, imgs.itemUrl.length);
    const color = ITEM_FALLBACKS[it.spriteIdx % ITEM_FALLBACKS.length];
    ctx.shadowColor = color;
    drawTile(ctx, it.x, it.y, imgs.itemUrl[si] ?? null, color);
  }
  ctx.shadowBlur = 0;

  // Snake body
  for (let i = 1; i < snake.length; i++) {
    drawTile(ctx, snake[i].x, snake[i].y, imgs.bodyUrl, "#6366f1");
  }

  // Snake head
  const hcx = snake[0].x * CELL + CELL / 2;
  const hcy = snake[0].y * CELL + CELL / 2;
  const HEAD_SIZE = CELL + 10;

  ctx.shadowColor = "#c4b5fd";
  ctx.shadowBlur = 14;
  if (imgs.headUrl?.complete && imgs.headUrl.naturalWidth > 0) {
    const nw = imgs.headUrl.naturalWidth;
    const nh = imgs.headUrl.naturalHeight;
    const scale = HEAD_SIZE / Math.min(nw, nh);
    const dw = nw * scale;
    const dh = nh * scale;
    ctx.drawImage(imgs.headUrl, hcx - dw / 2, hcy - dh / 2, dw, dh);
  } else {
    const half = HEAD_SIZE / 2;
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.roundRect(hcx - half, hcy - half, HEAD_SIZE, HEAD_SIZE, 8);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // Direction arrow
  drawArrow(ctx, snake[0], dir);
}

export function GameSnake({ onBack, sprites }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const gsRef = useRef<GS | null>(null);
  const imgs = useRef<ImgMap>({
    headUrl: null,
    bodyUrl: null,
    itemUrl: [],
    obstacleUrl: null,
  });
  const touchRef = useRef<Pt | null>(null);

  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(BASE_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const unlockedRef = useRef(false);

  // Trigger celebration
  useEffect(() => {
    if (score >= 160 && !unlockedRef.current) {
      unlockedRef.current = true;
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2200);
    }
  }, [score]);

  useEffect(() => {
    if (!sprites) return;

    for (const key of ["headUrl", "bodyUrl", "obstacleUrl"] as const) {
      const url = sprites[key];
      if (!url) continue;
      const img = new Image();
      img.src = url;
      imgs.current[key] = img;
    }

    const raw = sprites.itemUrl;
    if (raw) {
      const urls = Array.isArray(raw) ? raw : [raw];
      imgs.current.itemUrl = urls.map((u) => {
        const img = new Image();
        img.src = u;
        return img;
      });
    }
  }, [sprites]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const gs = gsRef.current;
    if (!canvas || !gs) return;
    const ctx = canvas.getContext("2d");
    if (ctx) drawFrame(ctx, gs, imgs.current);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const id = setInterval(() => {
      const gs = gsRef.current;
      if (!gs || gs.dead) return;

      gs.tickCount++;
      gs.dir = gs.nextDir;

      const head = gs.snake[0];
      const next: Pt = {
        x: head.x + (gs.dir === "right" ? 1 : gs.dir === "left" ? -1 : 0),
        y: head.y + (gs.dir === "down" ? 1 : gs.dir === "up" ? -1 : 0),
      };

      // Wrap around walls
      next.x = (next.x + gs.cols) % gs.cols;
      next.y = (next.y + gs.rows) % gs.rows;
      // Self collision
      if (gs.snake.some((s) => s.x === next.x && s.y === next.y)) {
        gs.dead = true;
        setGameOver(true);
        return;
      }
      // Obstacle collision
      if (gs.obstacles.some((o) => o.x === next.x && o.y === next.y)) {
        gs.dead = true;
        setGameOver(true);
        return;
      }

      // Item collection
      const idx = gs.items.findIndex(
        (it) => it.x === next.x && it.y === next.y,
      );
      const ate = idx !== -1;

      gs.snake = [next, ...gs.snake];
      if (ate) {
        gs.items.splice(idx, 1);
        setScore((s) => s + PTS);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DELTA));
      } else {
        gs.snake.pop();
      }

      // Periodic item spawn
      if (gs.tickCount % ITEM_EVERY === 0 && gs.items.length < MAX_ITEMS) {
        const taken = [...gs.snake, ...gs.obstacles, ...gs.items];
        const p = freePt(gs.cols, gs.rows, taken);
        if (p)
          gs.items.push({
            ...p,
            id: gs.idCounter++,
            spriteIdx: rand(Math.max(1, imgs.current.itemUrl.length)),
          });
      }

      renderCanvas();
    }, speed);

    return () => clearInterval(id);
  }, [started, gameOver, speed, renderCanvas]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cw = Math.floor(canvas.clientWidth / CELL) * CELL;
    const ch = Math.floor(canvas.clientHeight / CELL) * CELL;
    if (cw === 0 || ch === 0) return;

    canvas.width = cw;
    canvas.height = ch;

    const gs = makeInitState(cw / CELL, ch / CELL, imgs.current.itemUrl.length);
    gsRef.current = gs;

    setScore(0);
    setSpeed(BASE_SPEED);
    setGameOver(false);
    setStarted(true);
    unlockedRef.current = false;

    // Draw first frame immediately (before the interval fires)
    const ctx = canvas.getContext("2d");
    if (ctx) drawFrame(ctx, gs, imgs.current);
  }, []);

  // Auto-start on mount
  useEffect(() => { startGame(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Block all native browser touch gestures (scroll, zoom, pull-to-refresh)
  // on the game area. React's synthetic handlers still fire normally.
  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    // Only block touchmove — preventing touchstart also cancels synthetic
    // click events, making buttons untappable on mobile.
    el.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      el.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useEffect(() => {
    const MAP: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const onKey = (e: KeyboardEvent) => {
      const d = MAP[e.key];
      if (!d) return;
      e.preventDefault();
      const gs = gsRef.current;
      if (gs && !gs.dead && !isOpposite(gs.dir, d)) gs.nextDir = d;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    const dir: Dir =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up";
    const gs = gsRef.current;
    if (gs && !gs.dead && !isOpposite(gs.dir, dir)) gs.nextDir = dir;
  };

  //   const pushDir = (d: Dir) => {
  //     const gs = gsRef.current;
  //     if (gs && !gs.dead && !isOpposite(gs.dir, d)) gs.nextDir = d;
  //   };

  return (
    <div className="flex flex-col h-screen bg-slate-900 max-w-md mx-auto select-none overflow-hidden overscroll-none">
      {/* ── Score bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 shrink-0">
        <button
          onClick={onBack}
          className="text-slate-400 active:text-white text-2xl font-melody transition-colors"
        >
          ← Salir
        </button>
        <span className="text-white font-melody text-4xl tracking-wide">
          ❤️ {score}
        </span>
        <EmotionBadge score={score} />
      </div>
      {/* ── Canvas ── */}
      <div
        ref={swipeRef}
        className="flex-1 relative overflow-hidden touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />


        {/* Celebration */}
        <AnimatePresence>
          {celebrating && (
            <motion.div
              key="celebrate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.4, 1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, times: [0, 0.3, 0.5, 1] }}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src="images/feli.png"
                  className="w-48 h-48 object-contain mx-auto mb-3 drop-shadow-lg"
                />
                <span className="text-pink-300 font-melody text-xl drop-shadow">
                  Mi princesa esta feliiiiii ♥
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/85 gap-6"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, delay: 0.1 }}
                className="text-center"
              >
                {(() => {
                  const imgUrl =
                    score >= 160
                      ? (sprites?.gameOverHappyUrl ?? sprites?.gameOverUrl)
                      : sprites?.gameOverUrl;
                  return imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="game over"
                      className="w-48 h-48 object-contain mx-auto mb-3 drop-shadow-lg"
                    />
                  ) : (
                    <p className="text-5xl mb-3">
                      {score >= 160 ? "🥰" : "💀"}
                    </p>
                  );
                })()}
                <h2 className="text-3xl font-melody text-white mb-1">
                  Uuups...
                  {score >= 160 && <> pero mi beba esta feliii!</>}
                </h2>
                <p className="text-indigo-300 font-melody text-2xl">
                  ❤️ {score} pts
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col gap-3 w-44"
              >
                <button
                  onClick={startGame}
                  className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-melody text-lg active:scale-95 transition-transform"
                >
                  Reintentar
                </button>
                <button
                  onClick={onBack}
                  className="py-3 rounded-xl bg-slate-700 text-slate-200 font-melody text-lg active:scale-95 transition-transform"
                >
                  Salir
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* <div className="shrink-0 bg-slate-800 py-4 px-4">
        <div className="grid grid-cols-3 gap-2 w-36 mx-auto">
          <div />
          <DPadBtn label="▲" onPress={() => pushDir("up")} />
          <div />
          <DPadBtn label="◀" onPress={() => pushDir("left")} />
          <div />
          <DPadBtn label="▶" onPress={() => pushDir("right")} />
          <div />
          <DPadBtn label="▼" onPress={() => pushDir("down")} />
          <div />
        </div>
      </div> */}
    </div>
  );
}

function EmotionBadge({ score }: { score: number }) {
  const stage = getStage(score);
  const isMax = score >= 200;

  return (
    <div className="flex  items-center ">
      <img
        src={"images/kuromi.png"}
        alt="game over"
        className="w-16 h-16 object-contain mx-auto mb-3 drop-shadow-lg"
      />

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={stage.emoji}
            initial={{ scale: 0.2, opacity: 0, y: 6 }}
            animate={{
              scale: isMax ? [1, 1.35, 1] : 1,
              opacity: 1,
              y: 0,
              rotate: isMax ? [0, -12, 12, 0] : 0,
            }}
            exit={{ scale: 0.2, opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="text-2xl leading-none select-none"
          >
            {stage.emoji}
          </motion.span>
        </AnimatePresence>
        <span className="text-[18px] font-melody text-slate-400 mt-0.5 text-center leading-tight whitespace-nowrap">
          {stage.label}
        </span>
      </div>
    </div>
  );
}

// function DPadBtn({ label, onPress }: { label: string; onPress: () => void }) {
//   return (
//     <button
//       onPointerDown={(e) => {
//         e.preventDefault();
//         onPress();
//       }}
//       className="h-12 rounded-xl bg-slate-700 active:bg-indigo-600 text-white text-xl
//                  flex items-center justify-center transition-colors touch-none"
//     >
//       {label}
//     </button>
//   );
// }
