import React, { useState, useEffect, useRef, useCallback } from "react";
import Paddle from "./Paddle";
import Ball from "./Ball";
import Brick from "./Brick";
import PowerUp from "./PowerUp";
import { levels } from "../levels/levels";
import styles from "../styles/GameBoard.module.css";

const START_WIDTH = 800;
const START_HEIGHT = 600;
const PADDLE_START_WIDTH = 100;

function GameBoard() {
  // ---------- States ----------
  const [gameWidth, setGameWidth] = useState(START_WIDTH);
  const [gameHeight, setGameHeight] = useState(START_HEIGHT);

  // "menu", "playing", "paused", "gameover", "levelcomplete", "alllevelscomplete"
  const [gameState, setGameState] = useState("menu");

  const [levelIndex, setLevelIndex] = useState(0);
  const [bricks, setBricks] = useState([]);

  // Paddle
  const [paddleX, setPaddleX] = useState(
    START_WIDTH / 2 - PADDLE_START_WIDTH / 2
  );
  const [paddleWidth, setPaddleWidth] = useState(PADDLE_START_WIDTH);

  // Main ball
  const [ballPos, setBallPos] = useState({ x: 0, y: 0, dx: 3, dy: -3 });
  // Extra balls
  const [balls, setBalls] = useState([]);

  // Power-ups
  const [powerUps, setPowerUps] = useState([]);

  // Score, lives, highscore
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highscore, setHighscore] = useState(
    parseInt(localStorage.getItem("highscore") || "0", 10)
  );

  // requestAnimationFrame reference
  const animationFrameRef = useRef(null);

  // ============ 1) Responsive ============
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 900) {
        setGameWidth(600);
        setGameHeight(400);
      } else {
        setGameWidth(START_WIDTH);
        setGameHeight(START_HEIGHT);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ============ 2) Memoized Functions ============

  // Next level
  const nextLevel = useCallback(() => {
    // If it's not the last level
    if (levelIndex < levels.length - 1) {
      setGameState("levelcomplete");
    } else {
      // All levels completed
      setGameState("alllevelscomplete");
    }
  }, [levelIndex]);

  // Reset current level, center bricks, and increase ball speed
  const resetLevel = useCallback(() => {
    const currentLevel = levels[levelIndex] || [];
    let newBricks = currentLevel.map((b) => ({ ...b }));

    // Calculate bounding box (minX, maxX) for bricks
    let minX = Infinity;
    let maxX = -Infinity;

    newBricks.forEach((brick) => {
      if (brick.x < minX) minX = brick.x;
      if (brick.x + brick.width > maxX) maxX = brick.x + brick.width;
    });

    const levelWidth = maxX - minX;
    const offset = (gameWidth - levelWidth) / 2;

    // Remap x for centering
    newBricks = newBricks.map((brick) => ({
      ...brick,
      x: brick.x - minX + offset,
    }));

    setBricks(newBricks);

    setPaddleWidth(PADDLE_START_WIDTH);
    setPaddleX(gameWidth / 2 - PADDLE_START_WIDTH / 2);

    // Set ball speed based on level
    const baseSpeed = 2;
    const speedIncrement = 0.5 * levelIndex;

    setBallPos({
      x: gameWidth / 2,
      y: gameHeight - 70,
      dx: baseSpeed + speedIncrement,
      dy: -(baseSpeed + speedIncrement),
    });

    setPowerUps([]);
    setBalls([]);
  }, [levelIndex, gameWidth, gameHeight]);

  // Create a power-up (random)
  const createPowerUp = useCallback((x, y) => {
    // 20% chance
    if (Math.random() < 0.2) {
      const types = ["LIFE", "WIDE", "EXTRABALL", "SHRINK"];
      const randType = types[Math.floor(Math.random() * types.length)];
      setPowerUps((prev) => [
        ...prev,
        {
          x: x + 30,
          y,
          width: 30,
          height: 30,
          dy: 2, // drops by 2px per frame
          type: randType,
        },
      ]);
    }
  }, []);

  // Apply a power-up
  const applyPowerUp = useCallback(
    (type) => {
      switch (type) {
        case "LIFE":
          setLives((l) => l + 1);
          break;
        case "WIDE":
          setPaddleWidth((w) => Math.min(w + 40, gameWidth - 50));
          break;
        case "SHRINK":
          setPaddleWidth((w) => Math.max(w - 20, 40));
          break;
        case "EXTRABALL":
          setBalls((old) => [
            ...old,
            {
              x: ballPos.x,
              y: ballPos.y,
              dx: -ballPos.dx,
              dy: -ballPos.dy,
            },
          ]);
          break;
        default:
          break;
      }
    },
    [ballPos, gameWidth]
  );

  // Update the ball's position and handle collisions
  const updateBall = useCallback(
    (ball) => {
      let { x, y, dx, dy } = ball;
      let newX = x + dx;
      let newY = y + dy;
      let newDx = dx;
      let newDy = dy;

      // Left/right
      if (newX <= 0 || newX >= gameWidth - 20) {
        newDx = -newDx;
      }
      // Top
      if (newY <= 0) {
        newDy = -newDy;
      }
      // Paddle collision
      const paddleTop = gameHeight - 40;
      if (
        newY >= paddleTop &&
        newX + 20 >= paddleX &&
        newX <= paddleX + paddleWidth
      ) {
        newDy = -Math.abs(newDy);
        const paddleCenter = paddleX + paddleWidth / 2;
        const impactPos = newX + 10 - paddleCenter;
        newDx = impactPos * 0.1;
      }

      // Bottom => lose a life
      if (newY >= gameHeight) {
        loseLife();
        return {
          x: gameWidth / 2,
          y: gameHeight - 70,
          dx: 3,
          dy: -3,
        };
      }

      // Brick collision
      const updated = [...bricks];
      for (let i = 0; i < updated.length; i++) {
        const b = updated[i];
        if (
          newX + 20 >= b.x &&
          newX <= b.x + b.width &&
          newY + 20 >= b.y &&
          newY <= b.y + b.height
        ) {
          b.hits -= 1;
          newDy = -newDy;
          setScore((s) => s + 100);

          // Destroy brick and spawn power-up
          if (b.hits <= 0) {
            createPowerUp(b.x, b.y);
            updated.splice(i, 1);
          }
          break;
        }
      }
      setBricks(updated);

      // If no bricks remain => next level
      if (updated.length === 0) {
        nextLevel();
      }

      return { x: newX, y: newY, dx: newDx, dy: newDy };
    },
    [bricks, paddleX, paddleWidth, gameWidth, gameHeight, createPowerUp, nextLevel]
  );

  // ============ 3) Effects ============
  // (a) On levelIndex/gameWidth change => reset level
  useEffect(() => {
    if (levelIndex < levels.length) {
      resetLevel();
    }
  }, [levelIndex, gameWidth, resetLevel]);

  // (b) Update highscore
  useEffect(() => {
    if (score > highscore) {
      setHighscore(score);
      localStorage.setItem("highscore", String(score));
    }
  }, [score, highscore]);

  // (c) Game loop using requestAnimationFrame
  useEffect(() => {
    function gameLoop() {
      if (gameState === "playing") {
        // Main ball
        setBallPos((old) => updateBall(old));
        // Extra balls
        setBalls((old) => old.map(updateBall));

        // Power-ups fall and check collision with the paddle
        setPowerUps((old) =>
          old
            .map((p) => ({
              ...p,
              y: p.y + p.dy, // falling
            }))
            .filter((p) => {
              // Remove if it goes off the bottom of the screen
              if (p.y > gameHeight) {
                return false;
              }
              // Paddle collision
              const paddleTop = gameHeight - 40;
              if (
                p.y + p.height >= paddleTop &&
                p.x + p.width >= paddleX &&
                p.x <= paddleX + paddleWidth
              ) {
                applyPowerUp(p.type);
                return false;
              }
              return true;
            })
        );
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, updateBall, gameHeight, paddleX, paddleWidth, applyPowerUp]);

  // ---------- 4) loseLife and Handlers ----------

  function loseLife() {
    setLives((l) => {
      const newL = l - 1;
      if (newL <= 0) {
        setGameState("gameover");
      }
      return newL;
    });
  }

  function handleStart() {
    setScore(0);
    setLives(3);
    setLevelIndex(0);
    resetLevel();
    setGameState("playing");
  }
  function handlePause() {
    setGameState("paused");
  }
  function handleResume() {
    setGameState("playing");
  }
  function handleRestart() {
    setGameState("menu");
  }
  function handleNextLevel() {
    setLevelIndex((idx) => idx + 1);
    setGameState("playing");
  }

  // ---------- 5) Paddle movement with mouse ----------
  function handleMouseMove(e) {
    if (gameState !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const newX = mouseX - paddleWidth / 2;
    setPaddleX(Math.max(0, Math.min(gameWidth - paddleWidth, newX)));
  }

  // ---------- RENDER ----------
  return (
    <>
      <div className={styles.infoBar}>
        <span>Score: {score}</span>
        <span>Lives: {lives}</span>
        <span>Highscore: {highscore}</span>
      </div>

      <div
        id="gameBoardContainer"
        className={styles.gameBoard}
        style={{ width: gameWidth, height: gameHeight }}
        onMouseMove={handleMouseMove}
      >
        {gameState === "menu" && (
          <div className={styles.overlay}>
            <h2>Menu</h2>
            <button onClick={handleStart}>Start</button>
          </div>
        )}
        {gameState === "paused" && (
          <div className={styles.overlay}>
            <h2>Paused</h2>
            <button onClick={handleResume}>Resume</button>
            <button onClick={handleRestart}>Menu</button>
          </div>
        )}
        {gameState === "gameover" && (
          <div className={styles.overlay}>
            <h2>Game Over</h2>
            <button onClick={handleRestart}>Menu</button>
          </div>
        )}
        {gameState === "levelcomplete" && (
          <div className={styles.overlay}>
            <h2>Level Complete!</h2>
            <button onClick={handleNextLevel}>Next Level</button>
          </div>
        )}
        {gameState === "alllevelscomplete" && (
          <div className={styles.overlay}>
            <h2>All Levels Complete</h2>
            <button onClick={handleRestart}>Menu</button>
          </div>
        )}

        {/* Bricks */}
        {bricks.map((b, i) => (
          <Brick key={i} brick={b} />
        ))}

        {/* Power-Ups */}
        {powerUps.map((pu, i) => (
          <PowerUp key={i} powerUp={pu} />
        ))}

        {/* Main ball */}
        {(gameState === "playing" || gameState === "paused") && (
          <Ball position={{ x: ballPos.x, y: ballPos.y }} />
        )}

        {/* Extra balls */}
        {balls.map((b, i) => (
          <Ball key={i} position={{ x: b.x, y: b.y }} />
        ))}

        {/* Paddle */}
        <Paddle x={paddleX} width={paddleWidth} />
      </div>

      {gameState === "playing" && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button onClick={handlePause}>Pause</button>
        </div>
      )}
    </>
  );
}

export default GameBoard;
