import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, SkullIcon, ArrowRight, RotateCcw } from "lucide-react";

export default function GameOverModal({ gameState, onRetry, onNextLevel, hasNextLevel }) {
  if (gameState !== "won" && gameState !== "lost") return null;

  const isWin = gameState === "won";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`max-w-sm w-full rounded-2xl border p-8 text-center ${
          isWin
            ? "bg-card border-primary/40 shadow-[0_0_40px_hsl(185,100%,50%,0.15)]"
            : "bg-card border-destructive/40 shadow-[0_0_40px_hsl(0,75%,55%,0.15)]"
        }`}
      >
        <div className="mb-4">
          {isWin ? (
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-6xl"
            >
              🏆
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-6xl"
            >
              💥
            </motion.div>
          )}
        </div>

        <h2 className="font-orbitron font-bold text-xl mb-2">
          {isWin ? "Missão Completa!" : "Rover Destruído!"}
        </h2>
        <p className="text-sm font-space text-muted-foreground mb-6">
          {isWin
            ? "Todos os cristais foram coletados com sucesso!"
            : "O rover colidiu! Revise seu algoritmo e tente novamente."}
        </p>

        <div className="flex flex-col gap-2">
          {isWin && hasNextLevel && (
            <Button
              onClick={onNextLevel}
              className="w-full h-11 bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron font-bold gap-2"
            >
              Próximo Nível
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={onRetry}
            variant="outline"
            className="w-full h-10 font-space gap-2 border-border/50"
          >
            <RotateCcw className="w-4 h-4" />
            {isWin ? "Jogar Novamente" : "Tentar Novamente"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}