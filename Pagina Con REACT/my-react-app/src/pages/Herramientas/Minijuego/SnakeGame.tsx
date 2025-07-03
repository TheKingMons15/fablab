import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame: React.FC<{ onComplete?: (success: boolean) => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing' | 'paused'>('menu');
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [nextDirection, setNextDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 6, y: 6 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 12, y: 10 });
  const [speed, setSpeed] = useState(180);
  const [countdown, setCountdown] = useState(3);
  const [highScore, setHighScore] = useState(0);

  // Configuración del juego optimizada para 20x20
  const gridSize = 20;
  const tileCount = 20;
  const canvasWidth = tileCount * gridSize;
  const canvasHeight = tileCount * gridSize;

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };
      attempts++;
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y) && attempts < 100);
    return newFood;
  }, [tileCount]);

  const resetGameAfterLife = useCallback(() => {
    const newSnake = [{ x: 6, y: 6 }];
    setSnake(newSnake);
    setDirection('right');
    setNextDirection('right');
    setFood(generateFood(newSnake));
    setGameState('countdown');
    setCountdown(3);
  }, [generateFood]);

  const startNewGame = useCallback(() => {
    const initialSnake = [{ x: 6, y: 6 }];
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setSnake(initialSnake);
    setDirection('right');
    setNextDirection('right');
    setFood(generateFood(initialSnake));
    setSpeed(180);
    setGameState('countdown');
    setCountdown(3);
  }, [generateFood]);

  const handleGameEnd = useCallback((won: boolean) => {
    setGameWon(won);
    setGameOver(true);
    setGameState('menu');
    if (score > highScore) setHighScore(score);
    
    // Llamar a onComplete después de un pequeño delay para que la UI se actualice
    setTimeout(() => {
      if (onComplete) {
        onComplete(won);
      }
    }, 100);
  }, [score, highScore, onComplete]);

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

        // Verificar colisiones con bordes
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          setLives(currentLives => {
            const newLives = currentLives - 1;
            if (newLives <= 0) {
              handleGameEnd(false);
            } else {
              setTimeout(resetGameAfterLife, 1000);
            }
            return newLives;
          });
          return currentSnake;
        }

        // Verificar colisiones con el propio cuerpo
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setLives(currentLives => {
            const newLives = currentLives - 1;
            if (newLives <= 0) {
              handleGameEnd(false);
            } else {
              setTimeout(resetGameAfterLife, 1000);
            }
            return newLives;
          });
          return currentSnake;
        }

        newSnake.unshift(head);

        // Verificar si comió la comida
        if (head.x === food.x && head.y === food.y) {
          setScore(currentScore => {
            const newScore = currentScore + 1;
            if (newScore >= 20) {
              handleGameEnd(true);
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          setSpeed(currentSpeed => Math.max(60, currentSpeed - 4));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const render = () => {
      if (!ctx) return;

      // Fondo con gradiente
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1B5E20');
      gradient.addColorStop(0.5, '#2E7D32');
      gradient.addColorStop(1, '#388E3C');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Patrón de tablero
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = 0; x < tileCount; x++) {
        for (let y = 0; y < tileCount; y++) {
          if ((x + y) % 2 === 0) {
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
          }
        }
      }

      // Líneas de cuadrícula más sutiles para el tablero más pequeño
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Dibujar serpiente con elementos ajustados al tamaño más pequeño
      snake.forEach((segment, index) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        
        if (index === 0) {
          // Cabeza de la serpiente
          const headGradient = ctx.createRadialGradient(
            x + gridSize/2, y + gridSize/2, 0,
            x + gridSize/2, y + gridSize/2, gridSize/2
          );
          headGradient.addColorStop(0, '#0D47A1');
          headGradient.addColorStop(0.7, '#1565C0');
          headGradient.addColorStop(1, '#0D47A1');
          
          ctx.fillStyle = headGradient;
          ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
          
          // Borde de la cabeza
          ctx.strokeStyle = '#BBDEFB';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
          
          // Ojos ajustados al tamaño más pequeño
          ctx.fillStyle = '#FFEB3B';
          const eyeSize = 4;
          const eyeOffset = 4;
          
          ctx.beginPath();
          ctx.arc(x + eyeOffset + eyeSize/2, y + eyeOffset + eyeSize/2, eyeSize/2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + gridSize - eyeOffset - eyeSize/2, y + eyeOffset + eyeSize/2, eyeSize/2, 0, Math.PI * 2);
          ctx.fill();
          
          // Pupilas
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(x + eyeOffset + eyeSize/2, y + eyeOffset + eyeSize/2, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + gridSize - eyeOffset - eyeSize/2, y + eyeOffset + eyeSize/2, 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Brillo en los ojos
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x + eyeOffset + eyeSize/2 - 0.5, y + eyeOffset + eyeSize/2 - 0.5, 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + gridSize - eyeOffset - eyeSize/2 - 0.5, y + eyeOffset + eyeSize/2 - 0.5, 0.5, 0, Math.PI * 2);
          ctx.fill();
          
        } else {
          // Cuerpo de la serpiente
          const alpha = Math.max(0.7, 1 - (index * 0.03));
          const bodyGradient = ctx.createRadialGradient(
            x + gridSize/2, y + gridSize/2, 0,
            x + gridSize/2, y + gridSize/2, gridSize/2
          );
          bodyGradient.addColorStop(0, `rgba(27, 94, 32, ${alpha})`);
          bodyGradient.addColorStop(0.8, `rgba(46, 125, 50, ${alpha})`);
          bodyGradient.addColorStop(1, `rgba(27, 94, 32, ${alpha})`);
          
          ctx.fillStyle = bodyGradient;
          ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
          
          // Borde del cuerpo
          ctx.strokeStyle = `rgba(129, 199, 132, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
          
          // Patrón decorativo más pequeño
          if (index % 2 === 0) {
            ctx.fillStyle = `rgba(76, 175, 80, ${alpha * 0.5})`;
            ctx.fillRect(x + 6, y + 6, gridSize - 12, gridSize - 12);
          }
        }
      });

      // Dibujar comida (manzana) ajustada al tamaño más pequeño
      const appleX = food.x * gridSize;
      const appleY = food.y * gridSize;
      const appleRadius = (gridSize / 2) - 2;
      
      // Sombra de la manzana
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(appleX + gridSize/2 + 1, appleY + gridSize/2 + 1, appleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Cuerpo principal de la manzana
      const appleGradient = ctx.createRadialGradient(
        appleX + gridSize/2 - 2, appleY + gridSize/2 - 2, 0,
        appleX + gridSize/2, appleY + gridSize/2, appleRadius
      );
      appleGradient.addColorStop(0, '#FF5722');
      appleGradient.addColorStop(0.7, '#F44336');
      appleGradient.addColorStop(1, '#D32F2F');
      
      ctx.fillStyle = appleGradient;
      ctx.beginPath();
      ctx.arc(appleX + gridSize/2, appleY + gridSize/2, appleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Brillo principal más pequeño
      ctx.fillStyle = '#FFCDD2';
      ctx.beginPath();
      ctx.arc(appleX + gridSize/2 - 3, appleY + gridSize/2 - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Brillo secundario
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(appleX + gridSize/2 - 2, appleY + gridSize/2 - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Tallo más pequeño
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(appleX + gridSize/2 - 1, appleY + 2, 2, 4);
      
      // Hoja más pequeña
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.ellipse(appleX + gridSize/2 + 3, appleY + 3, 3, 2, Math.PI/4, 0, Math.PI * 2);
      ctx.fill();
      
      // Detalles de la hoja
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(appleX + gridSize/2 + 1, appleY + 4);
      ctx.lineTo(appleX + gridSize/2 + 4, appleY + 2);
      ctx.stroke();
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
  }, [gameState, snake, food, nextDirection, speed, score, lives, highScore, generateFood, resetGameAfterLife, tileCount, gridSize, handleGameEnd]);

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
          <h1 className={styles.gameTitle}>🐍 SNAKE</h1>
          
          {gameOver && (
            <div className={`${styles.gameResult} ${gameWon ? styles.winMessage : styles.loseMessage}`}>
              {gameWon ? (
                <div>
                  <h2>🎉 ¡GANASTE! 🎉</h2>
                  <p>¡Comiste {score} manzanas!</p>
                </div>
              ) : (
                <div>
                  <h2>💀 GAME OVER</h2>
                  <p>Puntuación: {score}</p>
                </div>
              )}
            </div>
          )}

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>🏆 Récord:</span>
              <span className={styles.statValue}>{highScore}</span>
            </div>
          </div>

          <button 
            className={styles.playButton}
            onClick={startNewGame}
          >
            {gameOver ? '🔄 JUGAR DE NUEVO' : '🎮 COMENZAR JUEGO'}
          </button>

          <div className={styles.instructions}>
            <h3>📋 Instrucciones</h3>
            <ul>
              <li>🎯 Come 20 manzanas para ganar</li>
              <li>⚡ Tienes 3 vidas</li>
              <li>🕹️ Usa las flechas o WASD</li>
              <li>⏸️ Espacio para pausar</li>
              <li>🚪 ESC para salir</li>
            </ul>
          </div>

          {onComplete && (
            <button 
              className={styles.exitButton}
              onClick={() => onComplete(gameWon)}
            >
              🚪 Salir del Juego
            </button>
          )}
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
        
        <div className={styles.canvas}>
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <div className={styles.gameStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Puntuación</span>
            <span className={styles.statValue}>{score}/20</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Vidas</span>
            <span className={styles.statValue}>{'❤️'.repeat(lives)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Récord</span>
            <span className={styles.statValue}>{highScore}</span>
          </div>
        </div>
      </div>

      <div className={styles.canvas}>
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
        {gameState === 'paused' && (
          <div className={styles.pauseOverlay}>
            <div className={styles.pauseMessage}>
              <h2>⏸️ PAUSADO</h2>
              <p>Presiona ESPACIO para continuar</p>
            </div>
          </div>
        )}
      </div>

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