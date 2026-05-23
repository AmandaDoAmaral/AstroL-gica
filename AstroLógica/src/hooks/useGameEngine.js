import { useState, useCallback, useRef } from "react";

const DIRECTIONS = [
  { row: -1, col: 0 },  // 0 = up
  { row: 0, col: 1 },   // 1 = right
  { row: 0, col: -1 },  // 3 = left  (actually index 3)
  { row: 1, col: 0 },   // 2 = down
];

// direction index: 0=up, 1=right, 2=down, 3=left
const DIR_VECTORS = [
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
];

export default function useGameEngine(level) {
  const [roverPos, setRoverPos] = useState({
    row: level.roverStart.row,
    col: level.roverStart.col,
  });
  const [roverDir, setRoverDir] = useState(level.roverStart.direction);
  const [collectedCrystals, setCollectedCrystals] = useState([]);
  const [gameState, setGameState] = useState("planning"); // planning, executing, won, lost
  const [executingIndex, setExecutingIndex] = useState(-1);
  const [attempts, setAttempts] = useState(1);
  const [explosionPos, setExplosionPos] = useState(null);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRoverPos({ row: level.roverStart.row, col: level.roverStart.col });
    setRoverDir(level.roverStart.direction);
    setCollectedCrystals([]);
    setGameState("planning");
    setExecutingIndex(-1);
    setExplosionPos(null);
  }, [level]);

  const retry = useCallback(() => {
    reset();
    setAttempts((a) => a + 1);
  }, [reset]);

  const expandCommands = (commands) => {
    const expanded = [];
    for (const cmd of commands) {
      if (cmd.type === "repeat") {
        const times = cmd.times || 2;
        const inner = cmd.children || [];
        for (let i = 0; i < times; i++) {
          expanded.push(...expandCommands(inner));
        }
      } else {
        expanded.push(cmd);
      }
    }
    return expanded;
  };

  const execute = useCallback(
    (commands) => {
      const expanded = expandCommands(commands);
      if (expanded.length === 0) return;

      setGameState("executing");
      setExecutingIndex(0);

      let currentPos = { row: level.roverStart.row, col: level.roverStart.col };
      let currentDir = level.roverStart.direction;
      let crystals = [];

      const stepThrough = (index) => {
        if (index >= expanded.length) {
          // Check if all crystals collected
          const allCrystals = level.crystals;
          if (crystals.length >= allCrystals.length) {
            setGameState("won");
          } else {
            setGameState("won"); // partial win - reached end
            // Actually check properly
            const allCollected = allCrystals.every((c) =>
              crystals.some((cc) => cc.row === c.row && cc.col === c.col)
            );
            if (allCollected) {
              setGameState("won");
            } else {
              // Ran out of commands but didn't collect all
              setGameState("lost");
              setExplosionPos(null);
            }
          }
          return;
        }

        const cmd = expanded[index];
        setExecutingIndex(index);

        if (cmd.type === "forward") {
          const vec = DIR_VECTORS[currentDir];
          const newRow = currentPos.row + vec.row;
          const newCol = currentPos.col + vec.col;

          // Check bounds
          if (
            newRow < 0 ||
            newRow >= level.gridSize.rows ||
            newCol < 0 ||
            newCol >= level.gridSize.cols
          ) {
            setExplosionPos({ ...currentPos });
            setGameState("lost");
            return;
          }

          // Check crater
          if (level.grid[newRow][newCol] === 1) {
            setRoverPos({ row: newRow, col: newCol });
            setExplosionPos({ row: newRow, col: newCol });
            setGameState("lost");
            return;
          }

          currentPos = { row: newRow, col: newCol };
          setRoverPos({ ...currentPos });

          // Check crystal
          const crystalHere = level.crystals.find(
            (c) => c.row === newRow && c.col === newCol
          );
          if (
            crystalHere &&
            !crystals.some((c) => c.row === newRow && c.col === newCol)
          ) {
            crystals = [...crystals, { row: newRow, col: newCol }];
            setCollectedCrystals([...crystals]);
          }
        } else if (cmd.type === "right") {
          currentDir = (currentDir + 1) % 4;
          setRoverDir(currentDir);
        } else if (cmd.type === "left") {
          currentDir = (currentDir + 3) % 4;
          setRoverDir(currentDir);
        }

        timeoutRef.current = setTimeout(() => stepThrough(index + 1), 500);
      };

      timeoutRef.current = setTimeout(() => stepThrough(0), 300);
    },
    [level]
  );

  return {
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
  };
}