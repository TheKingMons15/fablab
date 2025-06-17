import React, { useEffect, useRef, useState } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 15 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 20;

    const handleGameLoop = () => {
      if (gameOver) return;

      // Mover la serpiente
      let newSnake = [...snake];
      let head = { x: newSnake[0].x, y: newSnake[0].y };

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

      // Detectar colisiones con bordes
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        onComplete(false);
        return;
      }

      // Detectar colisiones con sí misma
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        onComplete(false);
        return;
      }

      newSnake.unshift(head);

      // Comer comida
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood({
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        });
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);

      // Condición de victoria
      if (score >= 10) {
        setGameOver(true);
        onComplete(true);
        return;
      }

      // Dibujar
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'lime';
      newSnake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });

      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    };

    const gameInterval = setInterval(handleGameLoop, 100); // Usamos 100ms como velocidad inicial

    const handleKeyDown = (e: KeyboardEvent) => {
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
          onComplete(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, score, gameOver, onComplete]);

  if (gameOver) {
    return (
      <div className={styles.gameOver}>
        <h2>Juego terminado</h2>
        <p>Puntuación: {score}</p>
        <p>Presiona ESC para salir o recarga la página para jugar de nuevo.</p>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>Juego de la Culebrita</h1>
      <p className={styles.score}>Puntuación: {score}</p>
      <canvas ref={canvasRef} width="400" height="400" className={styles.canvas} />
      <p className={styles.instructions}>
        Usa las flechas para moverte. Presiona ESC para salir. Alcanza 10 puntos para ganar.
      </p>
    </div>
  );
};

export default SnakeGame;