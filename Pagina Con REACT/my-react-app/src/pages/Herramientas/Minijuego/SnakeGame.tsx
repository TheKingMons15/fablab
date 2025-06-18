import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing' | 'paused'>('menu');
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [nextDirection, setNextDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 10, y: 10 });
  const [speed, setSpeed] = useState(200);
  const [countdown, setCountdown] = useState(3);
  const [highScore, setHighScore] = useState(0);

  const gridSize = 20;
  const tileCount = 17;

  const generateFood = useCallback((): { x: number; y: number } => {
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * (tileCount - 2)) + 1,
        y: Math.floor(Math.random() * (tileCount - 2)) + 1,
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGameAfterLife = useCallback(() => {
    setSnake([{ x: 5, y: 5 }]);
    setDirection('right');
    setNextDirection('right');
    setFood(generateFood());
    setGameState('countdown');
    setCountdown(3);
  }, [generateFood]);

  const startNewGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setSnake([{ x: 5, y: 5 }]);
    setDirection('right');
    setNextDirection('right');
    setFood({ x: 10, y: 10 });
    setSpeed(200);
    setGameState('countdown');
    setCountdown(3);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (gameState !== 'playing') return;

      setDirection(nextDirection);

      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { x: newSnake[0].x, y: newSnake[0].y };

        switch (nextDirection) {
          case 'up':
            head.y -= 1;
            break;
          case 'down':
            head.y += 1;
            break;
          case 'left':
            head.x -= 1;
            break;
          case 'right':
            head.x += 1;
            break;
        }

        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          setLives(currentLives => {
            const newLives = currentLives - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setGameState('menu');
              if (score > highScore) setHighScore(score);
            } else {
              setTimeout(resetGameAfterLife, 1000);
            }
            return newLives;
          });
          return currentSnake;
        }

        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setLives(currentLives => {
            const newLives = currentLives - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setGameState('menu');
              if (score > highScore) setHighScore(score);
            } else {
              setTimeout(resetGameAfterLife, 1000);
            }
            return newLives;
          });
          return currentSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore(currentScore => {
            const newScore = currentScore + 1;
            if (newScore >= 15) {
              setGameWon(true);
              setGameOver(true);
              setGameState('menu');
              if (newScore > highScore) setHighScore(newScore);
            }
            return newScore;
          });
          setFood(generateFood());
          setSpeed(currentSpeed => Math.max(80, currentSpeed - 5));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const render = () => {
      if (!ctx) return;

      // Fondo sólido en lugar de imagen
      ctx.fillStyle = '#4CAF50'; // Verde sólido
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar serpiente (negra)
      snake.forEach((segment, index) => {
        if (index === 0) {
          ctx.fillStyle = '#000000'; // Cabeza negra
          ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
          ctx.fillStyle = '#ffffff'; // Ojos blancos
          ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 3, 3);
          ctx.fillRect(segment.x * gridSize + 13, segment.y * gridSize + 4, 3, 3);
        } else {
          ctx.fillStyle = '#000000'; // Cuerpo negro
          ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
        }
      });

      // Dibujar comida como un rectángulo rojo
      ctx.fillStyle = '#ff0000'; // Manzana como rectángulo rojo
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    };

    let gameInterval: NodeJS.Timeout;
    if (gameState === 'playing') {
      gameInterval = setInterval(() => {
        gameLoop();
        render();
      }, speed);
    } else {
      render();
    }

    return () => {
      if (gameInterval) clearInterval(gameInterval);
    };
  }, [gameState, snake, food, nextDirection, speed, score, lives, highScore, generateFood, resetGameAfterLife]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' && gameState !== 'paused') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'down') setNextDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'up') setNextDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'right') setNextDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'left') setNextDirection('right');
          break;
        case ' ':
          setGameState(gameState === 'playing' ? 'paused' : 'playing');
          break;
        case 'Escape':
          setGameState('menu');
          break;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, direction]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setCountdown(3);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, gameState]);

  if (gameState === 'menu') {
    return (
      <div className={styles.menuScreen}>
        <div className={styles.menuContainer}>
          <h1 className={styles.gameTitle}>🐍 SNAKE GAME</h1>
          
          {gameOver && (
            <div className={styles.gameResult}>
              {gameWon ? (
                <div className={styles.winMessage}>
                  <h2>🎉 ¡GANASTE! 🎉</h2>
                  <p>¡Comiste {score} manzanas!</p>
                </div>
              ) : (
                <div className={styles.loseMessage}>
                  <h2>💀 GAME OVER</h2>
                  <p>Puntuación: {score}</p>
                </div>
              )}
            </div>
          )}

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Récord:</span>
              <span className={styles.statValue}>{highScore}</span>
            </div>
          </div>

          <button className={styles.playButton} onClick={startNewGame}>
            {gameOver ? '🔄 JUGAR DE NUEVO' : '🎮 COMENZAR JUEGO'}
          </button>

          <div className={styles.instructions}>
            <h3>📋 Instrucciones:</h3>
            <ul>
              <li>🎯 Come 15 manzanas para ganar</li>
              <li>⚡ Tienes 3 vidas</li>
              <li>🕹️ Usa las flechas o WASD</li>
              <li>⏸️ Espacio para pausar</li>
              <li>🚪 ESC para salir</li>
            </ul>
          </div>

          <button 
            className={styles.exitButton} 
            onClick={() => onComplete(gameWon)}
          >
            🚪 Salir del Juego
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className={styles.countdownScreen}>
        <div className={styles.gameInfo}>
          <div className={styles.gameStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Puntuación:</span>
              <span className={styles.statValue}>{score}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Vidas:</span>
              <span className={styles.statValue}>{'❤️'.repeat(lives)}</span>
            </div>
          </div>
        </div>
        <div className={styles.countdownContainer}>
          <h2 className={styles.countdownTitle}>¡Prepárate!</h2>
          <div className={styles.countdownNumber}>{countdown}</div>
        </div>
        <canvas ref={canvasRef} width="340" height="200" className={styles.canvas} />
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <div className={styles.gameStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Puntuación:</span>
            <span className={styles.statValue}>{score}/15</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Vidas:</span>
            <span className={styles.statValue}>{'❤️'.repeat(lives)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Récord:</span>
            <span className={styles.statValue}>{highScore}</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} width="340" height="200" className={styles.canvas} />

      {gameState === 'paused' && (
        <div className={styles.pauseOverlay}>
          <div className={styles.pauseMessage}>
            <h2>⏸️ PAUSADO</h2>
            <p>Presiona ESPACIO para continuar</p>
          </div>
        </div>
      )}

      <div className={styles.gameControls}>
        <button 
          className={styles.controlButton}
          onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
        >
          {gameState === 'playing' ? '⏸️ Pausar' : '▶️ Continuar'}
        </button>
        <button 
          className={styles.controlButton}
          onClick={() => setGameState('menu')}
        >
          🏠 Menú
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;