import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const DIR_ROTATIONS = { 0: 0, 1: 90, 2: 180, 3: 270 };

export default function GameGrid({
  level,
  roverPos,
  roverDir,
  collectedCrystals,
  explosionPos,
  gameState,
}) {
  const { gridSize, grid, crystals } = level;

  const isCrystalCollected = (row, col) =>
    collectedCrystals.some((c) => c.row === row && c.col === col);

  const isCrystal = (row, col) =>
    crystals.some((c) => c.row === row && c.col === col);

  return (
    <div className="relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div
        className="grid gap-0.5 p-2 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: gridSize.rows }).map((_, row) =>
          Array.from({ length: gridSize.cols }).map((_, col) => {
            const cellType = grid[row][col];
            const isRover = roverPos.row === row && roverPos.col === col;
            const hasCrystal = isCrystal(row, col) && !isCrystalCollected(row, col);
            const isExplosion =
              explosionPos && explosionPos.row === row && explosionPos.col === col;

            return (
              <div
                key={`${row}-${col}`}
                className="relative aspect-square rounded-sm flex items-center justify-center text-lg sm:text-xl transition-colors"
                style={{
                  background:
                    cellType === 1
                      ? "radial-gradient(circle, hsl(20 30% 18%) 0%, hsl(20 20% 12%) 100%)"
                      : "linear-gradient(135deg, hsl(30 25% 20%) 0%, hsl(25 20% 16%) 100%)",
                  border: "1px solid hsl(30 15% 25% / 0.3)",
                }}
              >
                {/* Grid coordinates (subtle) */}
                <span className="absolute top-0 left-0.5 text-[6px] text-muted-foreground/30 font-space">
                  {row},{col}
                </span>

                {/* Crater */}
                {cellType === 1 && (
                  <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-amber-900/80 to-amber-950 border-2 border-amber-800/50 shadow-inner flex items-center justify-center">
                    <div className="w-1/2 h-1/2 rounded-full bg-amber-950/80" />
                  </div>
                )}

                {/* Crystal */}
                {hasCrystal && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl sm:text-3xl drop-shadow-[0_0_8px_hsl(185,100%,60%)]"
                  >
                    💎
                  </motion.div>
                )}

                {/* Rover */}
                <AnimatePresence>
                  {isRover && gameState !== "lost" && (
                    <motion.div
                      layout
                      className="absolute inset-0 flex items-center justify-center z-10"
                      initial={false}
                      animate={{
                        rotate: DIR_ROTATIONS[roverDir],
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <span className="text-2xl sm:text-3xl drop-shadow-[0_0_6px_hsl(185,100%,60%)]">
                        🤖
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Explosion */}
                <AnimatePresence>
                  {isExplosion && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <span className="text-3xl sm:text-4xl">💥</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collected crystal effect */}
                {isCrystal(row, col) && isCrystalCollected(row, col) && (
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0, opacity: 0 }}
                    className="text-xl"
                  >
                    ✨
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}