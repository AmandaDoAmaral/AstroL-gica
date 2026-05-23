import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LEVELS } from "@/lib/levelData";
import useGameEngine from "@/hooks/useGameEngine";
import GameGrid from "@/components/game/GameGrid";
import CommandPanel from "@/components/game/CommandPanel";
import HUD from "@/components/game/HUD";
import GameOverModal from "@/components/game/GameOverModal";

export default function Game() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split("/");
  const levelId = parseInt(pathParts[pathParts.length - 1]) || 1;

  const level = useMemo(
    () => LEVELS.find((l) => l.id === levelId) || LEVELS[0],
    [levelId]
  );

  const [commands, setCommands] = useState([]);

  const {
    roverPos,
    roverDir,
    collectedCrystals,
    gameState,
    executingIndex,
    attempts,
    explosionPos,
    execute,
    reset,
    retry,
  } = useGameEngine(level);

  const handleExecute = (cmds) => {
    execute(cmds);
  };

  const handleReset = () => {
    retry();
    setCommands([]);
  };

  const handleNextLevel = () => {
    const nextId = levelId + 1;
    if (nextId <= LEVELS.length) {
      navigate(`/game/${nextId}`);
      window.location.reload();
    }
  };

  const hasNextLevel = levelId < LEVELS.length;

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 flex flex-col">
      {/* HUD */}
      <HUD
        level={level}
        collectedCrystals={collectedCrystals}
        commandCount={commands.length}
        attempts={attempts}
        onBack={() => navigate("/")}
      />

      {/* Hint bar */}
      {gameState === "planning" && (
        <div className="mt-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg">
          <p className="text-[10px] font-space text-primary/70">
            💡 {level.hint}
          </p>
        </div>
      )}

      {/* Main game area */}
      <div className="flex-1 mt-3 flex flex-col lg:flex-row gap-3 min-h-0">
        {/* Grid area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[500px]">
            <GameGrid
              level={level}
              roverPos={roverPos}
              roverDir={roverDir}
              collectedCrystals={collectedCrystals}
              explosionPos={explosionPos}
              gameState={gameState}
            />
          </div>
        </div>

        {/* Command panel */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <CommandPanel
            commands={commands}
            setCommands={setCommands}
            onExecute={handleExecute}
            onReset={handleReset}
            gameState={gameState}
            executingIndex={executingIndex}
            maxCommands={level.maxCommands}
            availableCommands={level.availableCommands}
          />
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        gameState={gameState}
        onRetry={handleReset}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
      />
    </div>
  );
}