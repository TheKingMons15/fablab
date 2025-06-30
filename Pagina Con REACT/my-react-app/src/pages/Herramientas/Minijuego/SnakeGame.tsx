import React, { useEffect, useRef, useState, useCallback } from 'react';

type Position = {
  x: number;
  y: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type GameState = 'menu' | 'countdown' | 'playing' | 'paused';

type Direction = 'up' | 'down' | 'left' | 'right';

interface SnakeGameProps {
  onComplete?: (gameWon: boolean) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onComplete = () => {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [direction, setDirection] = useState<Direction>('right');
  const [nextDirection, setNextDirection] = useState<Direction>('right');
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [speed, setSpeed] = useState(200);
  const [countdown, setCountdown] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animTime, setAnimTime] = useState(0);

  const gridSize = 20;
  const tileCount = 17;
  const canvasWidth = tileCount * gridSize;
  const canvasHeight = tileCount * gridSize;

  // Función para generar partículas
  const createParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        x: x * gridSize + gridSize / 2,
        y: y * gridSize + gridSize / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        maxLife: 30,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const generateFood = useCallback(() => {
    let newFood: Position;
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
    setParticles([]);
    setGameState('countdown');
    setCountdown(3);
  }, []);

  // Función de render mejorada
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fondo con gradiente dinámico
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, `hsl(${120 + Math.sin(animTime * 0.01) * 20}, 70%, 45%)`);
    gradient.addColorStop(1, `hsl(${140 + Math.cos(animTime * 0.01) * 20}, 60%, 35%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Grid sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvasHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvasWidth, i * gridSize);
      ctx.stroke();
    }

    // Dibujar serpiente con efectos
    snake.forEach((segment, index) => {
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;
      
      if (index === 0) {
        // Cabeza con brillo
        const headGradient = ctx.createRadialGradient(
          x + gridSize/2, y + gridSize/2, 0,
          x + gridSize/2, y + gridSize/2, gridSize/2
        );
        headGradient.addColorStop(0, '#333');
        headGradient.addColorStop(1, '#000');
        
        ctx.fillStyle = headGradient;
        ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
        
        // Ojos brillantes
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + gridSize - 6, y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Puntos blancos en los ojos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + 6, y + 6, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + gridSize - 6, y + 6, 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Cuerpo con gradiente
        const bodyGradient = ctx.createRadialGradient(
          x + gridSize/2, y + gridSize/2, 0,
          x + gridSize/2, y + gridSize/2, gridSize/2
        );
        const alpha = Math.max(0.3, 1 - index * 0.1);
        bodyGradient.addColorStop(0, `rgba(40, 40, 40, ${alpha})`);
        bodyGradient.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
        
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(x + 3, y + 3, gridSize - 6, gridSize - 6);
      }
    });

    // Dibujar comida con animación espectacular
    const foodX = food.x * gridSize;
    const foodY = food.y * gridSize;
    
    // Aura brillante de la comida
    const auraGradient = ctx.createRadialGradient(
      foodX + gridSize/2, foodY + gridSize/2, 0,
      foodX + gridSize/2, foodY + gridSize/2, gridSize
    );
    auraGradient.addColorStop(0, `hsla(${(animTime * 2) % 360}, 100%, 50%, 0.6)`);
    auraGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = auraGradient;
    ctx.fillRect(foodX - gridSize/2, foodY - gridSize/2, gridSize * 2, gridSize * 2);
    
    // Manzana principal con pulso
    const pulseSize = 2 + Math.sin(animTime * 0.1) * 1;
    const appleGradient = ctx.createRadialGradient(
      foodX + gridSize/2, foodY + gridSize/2, 0,
      foodX + gridSize/2, foodY + gridSize/2, gridSize/2 + pulseSize
    );
    appleGradient.addColorStop(0, '#ff6666');
    appleGradient.addColorStop(0.7, '#ff0000');
    appleGradient.addColorStop(1, '#cc0000');
    
    ctx.fillStyle = appleGradient;
    ctx.beginPath();
    ctx.arc(foodX + gridSize/2, foodY + gridSize/2, gridSize/2 - 2 + pulseSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo en la manzana
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(foodX + gridSize/3, foodY + gridSize/3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Hojita verde
    ctx.fillStyle = '#00aa00';
    ctx.fillRect(foodX + gridSize/2 - 1, foodY + 2, 2, 6);

    // Dibujar partículas
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [snake, food, particles, animTime, canvasHeight, canvasWidth, gridSize, tileCount]);

  // Actualizar partículas
  useEffect(() => {
    const updateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1
        })).filter(p => p.life > 0)
      );
    };

    const interval = setInterval(updateParticles, 16);
    return () => clearInterval(interval);
  }, []);

  // Animación principal
  useEffect(() => {
    const animate = () => {
      setAnimTime(prev => prev + 1);
      render();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (gameState !== 'menu') {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, render]);

  // Lógica del juego
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setDirection(nextDirection);

      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { x: newSnake[0].x, y: newSnake[0].y };

        switch (nextDirection) {
          case 'up': head.y -= 1; break;
          case 'down': head.y += 1; break;
          case 'left': head.x -= 1; break;
          case 'right': head.x += 1; break;
        }

        // Colisión con paredes
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          createParticles(head.x, head.y, '#ff0000');
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

        // Colisión consigo mismo
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          createParticles(head.x, head.y, '#ff0000');
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

        // Comer comida
        if (head.x === food.x && head.y === food.y) {
          createParticles(food.x, food.y, '#ffff00');
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

    gameLoopRef.current = setInterval(gameLoop, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, nextDirection, speed, food, score, lives, highScore, generateFood, resetGameAfterLife, tileCount]);

  // Controles
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

  // Countdown
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

  const menuStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px'
  };

  const gameStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '20px'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '25px',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease'
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '30px',
    margin: '20px 0',
    padding: '15px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)'
  };

  if (gameState === 'menu') {
    return (
      <div style={menuStyle}>
        <h1 style={{fontSize: '4rem', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          🐍 SNAKE PREMIUM
        </h1>
        
        {gameOver && (
          <div style={{margin: '30px 0'}}>
            {gameWon ? (
              <div>
                <h2 style={{color: '#ffeb3b', fontSize: '2.5rem'}}>🎉 ¡INCREÍBLE! 🎉</h2>
                <p style={{fontSize: '1.5rem'}}>¡Comiste {score} manzanas mágicas!</p>
              </div>
            ) : (
              <div>
                <h2 style={{color: '#f44336', fontSize: '2.5rem'}}>💀 GAME OVER</h2>
                <p style={{fontSize: '1.5rem'}}>Puntuación Final: {score}</p>
              </div>
            )}
          </div>
        )}

        <div style={statsStyle}>
          <div>
            <span style={{fontSize: '1.2rem'}}>🏆 Récord: </span>
            <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{highScore}</span>
          </div>
        </div>

        <button 
          style={buttonStyle}
          onClick={startNewGame}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {gameOver ? '🔄 JUGAR OTRA VEZ' : '🎮 COMENZAR AVENTURA'}
        </button>

        <div style={{margin: '30px 0', maxWidth: '500px'}}>
          <h3 style={{color: '#ffeb3b'}}>🎯 MISIÓN</h3>
          <div style={{textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '10px'}}>
            <p>🍎 Come 15 manzanas mágicas para ganar</p>
            <p>❤️ Tienes 3 vidas preciosas</p>
            <p>🕹️ Controles: Flechas o WASD</p>
            <p>⏸️ ESPACIO para pausar</p>
            <p>🚪 ESC para salir al menú</p>
          </div>
        </div>

        <button 
          style={{...buttonStyle, background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)'}}
          onClick={() => onComplete(gameWon)}
        >
          🚪 Salir del Juego
        </button>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div style={gameStyle}>
        <div style={statsStyle}>
          <div>Puntuación: <strong>{score}/15</strong></div>
          <div>Vidas: <strong>{'❤️'.repeat(lives)}</strong></div>
        </div>
        
        <div style={{margin: '30px 0'}}>
          <h2 style={{fontSize: '2rem', color: '#ffeb3b'}}>¡Prepárate para la acción!</h2>
          <div style={{
            fontSize: '4rem', 
            color: '#ff6b6b',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            animation: `${countdown <= 1 ? 'pulse 0.5s infinite' : 'none'}`
          }}>
            {countdown}
          </div>
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={canvasWidth} 
          height={canvasHeight}
          style={{
            border: '3px solid #fff',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(255,255,255,0.3)'
          }}
        />
      </div>
    );
  }

  return (
    <div style={gameStyle}>
      <div style={statsStyle}>
        <div>Puntuación: <strong>{score}/15</strong></div>
        <div>Vidas: <strong>{'❤️'.repeat(lives)}</strong></div>
        <div>Récord: <strong>{highScore}</strong></div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={canvasWidth} 
        height={canvasHeight}
        style={{
          border: '3px solid #fff',
          borderRadius: '10px',
          boxShadow: '0 0 30px rgba(255,255,255,0.4)',
          margin: '20px 0'
        }}
      />

      {gameState === 'paused' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2 style={{color: '#ffeb3b', fontSize: '2rem'}}>⏸️ PAUSA</h2>
          <p>Presiona ESPACIO para continuar</p>
        </div>
      )}

      <div style={{display: 'flex', gap: '15px'}}>
        <button 
          style={buttonStyle}
          onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
        >
          {gameState === 'playing' ? '⏸️ Pausar' : '▶️ Continuar'}
        </button>
        <button 
          style={{...buttonStyle, background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)'}}
          onClick={() => setGameState('menu')}
        >
          🏠 Menú
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;