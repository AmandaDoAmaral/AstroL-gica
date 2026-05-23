import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, BookOpen, Rocket } from "lucide-react";
import { LEVELS } from "@/lib/levelData";

export default function Menu() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              left: `${(i * 17.3) % 100}%`,
              top: `${(i * 23.7) % 100}%`,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl sm:text-8xl mb-4"
          >
            🚀
          </motion.div>
          <h1 className="font-orbitron font-black text-3xl sm:text-5xl text-foreground tracking-wider mb-2">
            ASTRO<span className="text-primary">LÓGICA</span>
          </h1>
          <p className="font-orbitron text-sm sm:text-base text-primary/70 tracking-[0.3em]">
            RESGATE ESPACIAL
          </p>
          <p className="font-space text-xs text-muted-foreground mt-3 max-w-md mx-auto">
            Guie o rover por planetas desconhecidos usando comandos de programação.
            Desvie de crateras e colete cristais de energia!
          </p>
        </motion.div>

        {/* Level selection */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md space-y-3"
        >
          {LEVELS.map((level, i) => (
            <Link key={level.id} to={`/game/${level.id}`}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/60 border border-border/50 hover:border-primary/30 transition-all group cursor-pointer mb-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-orbitron font-bold text-primary text-sm">
                  {level.id}
                </div>
                <div className="flex-1">
                  <h3 className="font-orbitron font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    Nível {level.id}
                  </h3>
                  <p className="font-space text-[10px] text-muted-foreground">
                    {level.subtitle} • {level.crystals.length} cristai(s) •{" "}
                    {level.gridSize.rows}x{level.gridSize.cols}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(level.id, 5) }).map((_, s) => (
                    <Star
                      key={s}
                      className="w-3 h-3 text-accent fill-accent/30"
                    />
                  ))}
                </div>
                <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Educational info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center gap-2 text-[10px] font-space text-muted-foreground/60"
        >
          <BookOpen className="w-3 h-3" />
          Aprenda lógica de programação de forma divertida
        </motion.div>
      </div>
    </div>
  );
}