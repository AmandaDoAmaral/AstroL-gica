import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  RotateCw,
  RotateCcw,
  Repeat,
  Play,
  Trash2,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COMMAND_CONFIG = {
  forward: {
    label: "Avançar",
    icon: ArrowUp,
    color: "bg-emerald-600 hover:bg-emerald-500 border-emerald-400/30",
    textColor: "text-emerald-100",
  },
  right: {
    label: "Girar Direita",
    icon: RotateCw,
    color: "bg-sky-600 hover:bg-sky-500 border-sky-400/30",
    textColor: "text-sky-100",
  },
  left: {
    label: "Girar Esquerda",
    icon: RotateCcw,
    color: "bg-violet-600 hover:bg-violet-500 border-violet-400/30",
    textColor: "text-violet-100",
  },
  repeat: {
    label: "Repetir",
    icon: Repeat,
    color: "bg-amber-600 hover:bg-amber-500 border-amber-400/30",
    textColor: "text-amber-100",
  },
};

function CommandBlock({
  cmd,
  index,
  onRemove,
  isExecuting,
  executingIndex,
  isDisabled,
}) {
  const config = COMMAND_CONFIG[cmd.type];
  if (!config) return null;

  const Icon = config.icon;
  const isActive = isExecuting && executingIndex === index;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive ? "0 0 15px hsl(185 100% 50% / 0.4)" : "none",
      }}
      exit={{ opacity: 0, x: -30 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color} ${config.textColor} transition-all font-space text-xs sm:text-sm`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="font-medium flex-1">{config.label}</span>

      {cmd.type === "repeat" && (
        <Badge
          variant="outline"
          className="text-[10px] border-white/30 text-white"
        >
          {cmd.times || 2}x
        </Badge>
      )}

      {!isDisabled && (
        <button
          onClick={() => onRemove(index)}
          className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}

export default function CommandPanel({
  commands,
  setCommands,
  onExecute,
  onReset,
  gameState,
  executingIndex,
  maxCommands,
  availableCommands,
}) {
  const [repeatTimes, setRepeatTimes] = useState(2);
  const [repeatChildren, setRepeatChildren] = useState([]);
  const [isAddingRepeat, setIsAddingRepeat] = useState(false);

  const isDisabled = gameState === "executing";
  const isPlanning = gameState === "planning";

  const addCommand = (type) => {
    if (isDisabled) return;

    if (isAddingRepeat) {
      if (type === "repeat") return;
      setRepeatChildren((prev) => [...prev, { type }]);
      return;
    }

    if (type === "repeat") {
      setIsAddingRepeat(true);
      setRepeatChildren([]);
      return;
    }

    const flatCount = commands.reduce((acc, c) => {
      if (c.type === "repeat") return acc + 1 + (c.children?.length || 0);
      return acc + 1;
    }, 0);

    if (flatCount >= maxCommands) return;

    setCommands((prev) => [...prev, { type }]);
  };

  const confirmRepeat = () => {
    if (repeatChildren.length === 0) {
      setIsAddingRepeat(false);
      return;
    }

    setCommands((prev) => [
      ...prev,
      { type: "repeat", times: repeatTimes, children: repeatChildren },
    ]);

    setIsAddingRepeat(false);
    setRepeatChildren([]);
    setRepeatTimes(2);
  };

  const removeCommand = (index) => {
    if (isDisabled) return;
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (isDisabled) return;
    setCommands([]);
    setIsAddingRepeat(false);
    setRepeatChildren([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-muted/50 rounded-t-xl border border-border/50 px-4 py-3">
        <h2 className="text-sm font-orbitron font-bold text-primary tracking-wider uppercase">
          Programação do Rover
        </h2>
        <p className="text-[10px] font-space text-muted-foreground mt-0.5">
          Algoritmo • {commands.length} comando(s) • máx. {maxCommands}
        </p>
      </div>

      {/* Available commands */}
      <div className="p-3 border-x border-border/50 bg-card/50">
        <p className="text-[10px] font-space text-muted-foreground mb-2 uppercase tracking-wider">
          {isAddingRepeat ? "Adicionar ao loop:" : "Comandos disponíveis:"}
        </p>

        <div className="grid grid-cols-2 gap-1.5">
          {availableCommands.map((type) => {
            const config = COMMAND_CONFIG[type];
            const Icon = config.icon;
            const disabled = isDisabled || (isAddingRepeat && type === "repeat");

            return (
              <button
                key={type}
                onClick={() => addCommand(type)}
                disabled={disabled}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-space font-medium transition-all ${
                  disabled
                    ? "opacity-30 cursor-not-allowed bg-muted border-border"
                    : `${config.color} ${config.textColor} active:scale-95`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Repeat configuration */}
        {isAddingRepeat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-space text-amber-300 uppercase">
                Loop - Repetir
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRepeatTimes(Math.max(2, repeatTimes - 1))}
                  className="w-5 h-5 rounded bg-amber-800 flex items-center justify-center"
                >
                  <Minus className="w-3 h-3 text-amber-200" />
                </button>

                <span className="text-sm font-bold text-amber-200 w-6 text-center font-space">
                  {repeatTimes}x
                </span>

                <button
                  onClick={() => setRepeatTimes(Math.min(9, repeatTimes + 1))}
                  className="w-5 h-5 rounded bg-amber-800 flex items-center justify-center"
                >
                  <Plus className="w-3 h-3 text-amber-200" />
                </button>
              </div>
            </div>

            <div className="space-y-1 mb-2 min-h-[32px]">
              {repeatChildren.length === 0 ? (
                <p className="text-[10px] text-amber-400/50 text-center py-1 font-space">
                  Clique nos comandos acima
                </p>
              ) : (
                repeatChildren.map((c, i) => {
                  const cfg = COMMAND_CONFIG[c.type];
                  const Ic = cfg.icon;

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${cfg.color} ${cfg.textColor} font-space`}
                    >
                      <Ic className="w-3 h-3" />
                      {cfg.label}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingRepeat(false);
                  setRepeatChildren([]);
                }}
                className="flex-1 text-[10px] h-7 border-amber-500/30 text-amber-300"
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                onClick={confirmRepeat}
                className="flex-1 text-[10px] h-7 bg-amber-600 hover:bg-amber-500 text-white"
              >
                Confirmar
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Command queue */}
      <div className="flex-1 p-3 border-x border-border/50 bg-card/30 overflow-y-auto min-h-[120px] max-h-[280px]">
        <div className="space-y-1.5">
          <AnimatePresence>
            {commands.map((cmd, i) => (
              <div key={i}>
                <CommandBlock
                  cmd={cmd}
                  index={i}
                  onRemove={removeCommand}
                  isExecuting={gameState === "executing"}
                  executingIndex={executingIndex}
                  isDisabled={isDisabled}
                />

                {cmd.type === "repeat" && cmd.children && (
                  <div className="ml-4 mt-1 pl-2 border-l-2 border-amber-500/40 space-y-1">
                    {cmd.children.map((child, ci) => {
                      const cfg = COMMAND_CONFIG[child.type];
                      const Ic = cfg.icon;

                      return (
                        <div
                          key={ci}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${cfg.color} ${cfg.textColor} font-space opacity-80`}
                        >
                          <Ic className="w-3 h-3" />
                          {cfg.label}
                        </div>
                      );
                    })}

                    <Badge
                      variant="outline"
                      className="text-[9px] border-amber-500/30 text-amber-400"
                    >
                      Repetir {cmd.times}x
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {commands.length === 0 && !isAddingRepeat && (
            <p className="text-center text-muted-foreground/50 text-xs py-6 font-space">
              Adicione comandos acima
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-3 border border-border/50 bg-muted/50 rounded-b-xl space-y-2">
        {isPlanning && (
          <>
            <Button
              onClick={() => onExecute(commands)}
              disabled={commands.length === 0}
              className="
                w-full h-12
                rounded-xl
                bg-cyan-400
                text-slate-950
                border border-cyan-200
                font-orbitron font-black text-sm tracking-[0.18em]
                uppercase
                gap-2
                shadow-[0_0_22px_rgba(34,211,238,0.45)]
                hover:bg-cyan-300
                hover:shadow-[0_0_32px_rgba(34,211,238,0.65)]
                active:scale-[0.98]
                transition-all duration-200
                disabled:bg-slate-800
                disabled:text-cyan-200/40
                disabled:border-cyan-500/20
                disabled:shadow-none
                disabled:cursor-not-allowed
              "
            >
              <Play className="w-5 h-5" />
              EXECUTAR
            </Button>

            <Button
              variant="outline"
              onClick={clearAll}
              disabled={commands.length === 0}
              className="w-full h-8 text-xs font-space text-muted-foreground gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Limpar tudo
            </Button>
          </>
        )}

        {(gameState === "won" || gameState === "lost") && (
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full h-11 font-orbitron font-bold text-sm tracking-wider border-primary/50 text-primary"
          >
            TENTAR NOVAMENTE
          </Button>
        )}
      </div>
    </div>
  );
}
