import React, { useEffect, useRef, useState } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 10, y: 10 });
  const [speed, setSpeed] = useState(150);
  const [countdown, setCountdown] = useState(4); // Contador regresivo de 4 segundos

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 20;

    const handleGameLoop = () => {
      if (!gameStarted || gameOver) return;

      let newSnake = [...snake];
      let head = { x: newSnake[0].x, y: newSnake[0].y };

      // Mover la serpiente
      switch (direction) {
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

      // Detectar colisiones con paredes
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        onComplete(score >= 10);
        return;
      }

      // Detectar colisiones con sí misma
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        onComplete(score >= 10);
        return;
      }

      newSnake.unshift(head);

      // Comer comida
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood({
          x: Math.floor(Math.random() * (tileCount - 2)) + 1,
          y: Math.floor(Math.random() * (tileCount - 2)) + 1,
        });
        setSpeed(prev => Math.max(50, prev - 10)); // Aumentar velocidad
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);

      // Dibujar
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar paredes
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, canvas.width, gridSize); // Pared superior
      ctx.fillRect(0, 0, gridSize, canvas.height); // Pared izquierda
      ctx.fillRect(0, canvas.height - gridSize, canvas.width, gridSize); // Pared inferior
      ctx.fillRect(canvas.width - gridSize, 0, gridSize, canvas.height); // Pared derecha

      ctx.fillStyle = 'lime';
      newSnake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });

      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    };

    let gameInterval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      gameInterval = setInterval(handleGameLoop, speed);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || countdown > 0) return;
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
        case 'Escape':
          setGameOver(true);
          onComplete(score >= 10);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (gameInterval) clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, score, gameOver, gameStarted, countdown, speed, onComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !gameStarted) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, gameStarted]);

  const startGame = () => {
    setGameStarted(false); // Reinicia el estado para mostrar el contador
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 5, y: 5 }]);
    setFood({ x: 10, y: 10 });
    setSpeed(150);
    setCountdown(4); // Reinicia el contador
  };

  if (!gameStarted && countdown > 0) {
    return (
      <div className={styles.startScreen}>
        <h1 className={styles.title}>Juego de la Serpiente</h1>
        <p className={styles.countdown}>Iniciando en: {countdown}</p>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className={styles.startScreen}>
        <h1 className={styles.title}>Juego de la Serpiente</h1>
        <p className={styles.instructions}>
          Usa las flechas para moverte. Come 10 manzanas para ganar. Presiona ESC para salir.
        </p>
        <button className={styles.startButton} onClick={startGame}>
          Iniciar Juego
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className={styles.gameOverScreen}>
        <h2>Juego Terminado</h2>
        <p>Manzanas comidas: {score}</p>
        {score >= 10 ? (
          <p>¡Ganaste! 🎉</p>
        ) : (
          <p>Perdiste. Chocaste con un límite.</p>
        )}
        <button className={styles.restartButton} onClick={startGame}>
          Reiniciar
        </button>
        <button className={styles.exitButton} onClick={() => onComplete(score >= 10)}>
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>Juego de la Serpiente</h1>
      <p className={styles.score}>Manzanas: {score}</p>
      <canvas ref={canvasRef} width="400" height="400" className={styles.canvas} />
      <p className={styles.instructions}>
        Usa las flechas para moverte. Come 10 manzanas para ganar. Presiona ESC para salir.
      </p>
    </div>
  );
};

export default SnakeGame;