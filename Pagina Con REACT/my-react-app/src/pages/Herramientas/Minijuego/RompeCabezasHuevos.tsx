import React, { useState, useEffect, useCallback } from 'react';
import styles from './RompeCabezasHuevos.module.css';

interface RompeCabezasHuevosProps {
  onComplete: (success: boolean) => void;
}

interface EggPiece {
  id: string;
  image: string;
  type: 'top' | 'bottom';
  matched: boolean;
  fullImage?: string;
}

interface EggImage {
  id: string;
  top: string;
  bottom: string;
  full: string;
}

const eggImages: EggImage[] = [
  {
    id: 'egg1',
    top: '/img/Huevo1_Sup.jpg',
    bottom: '/img/Huevo1_Inf.jpg',
    full: '/img/Huevo1_Completo.jpg'
  },
  {
    id: 'egg2',
    top: '/img/Huevo2_Sup.jpg',
    bottom: '/img/Huevo2_Inf.jpg',
    full: '/img/Huevo1_Completo.jpg'
  },
  {
    id: 'egg3',
    top: '/img/Huevo3_Sup.jpg',
    bottom: '/img/Huevo3_Inf.jpg',
    full: '/img/Huevo1_Completo.jpg'
  },
  {
    id: 'egg4',
    top: '/img/Huevo4_Sup.jpg',
    bottom: '/img/Huevo4_Inf.jpg',
    full: '/img/Huevo1_Completo.jpg'
  },
  {
    id: 'egg5',
    top: '/img/Huevo5_Sup.jpg',
    bottom: '/img/Huevo5_Inf.jpg',
    full: '/img/Huevo1_Completo.jpg'
  },
  {
    id: 'egg6',
    top: '/img/Huevo6_Sup.jpg',
    bottom: '/img/Huevo6_Inf.jpg',
    full: '/img/Huevo1_Completo.jpg'
  }
];

const RompeCabezasHuevos: React.FC<RompeCabezasHuevosProps> = ({ onComplete }) => {
  const [pieces, setPieces] = useState<EggPiece[]>([]);
  const [selectedPieces, setSelectedPieces] = useState<EggPiece[]>([]);
  const [matches, setMatches] = useState<{ id: string; fullImage: string }[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showMatch, setShowMatch] = useState<{ show: boolean; image: string }>({ show: false, image: '' });
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos = 180 segundos
  const [gameStarted, setGameStarted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);

  // Formatear tiempo en MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted && !gameOver && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            onComplete(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted, gameOver, timeLeft, onComplete]);

  const initializeGame = useCallback(() => {
    const newPieces: EggPiece[] = [];
    
    eggImages.forEach(egg => {
      newPieces.push({
        id: `${egg.id}-top`,
        image: egg.top,
        type: 'top',
        matched: false,
        fullImage: egg.full
      });
      newPieces.push({
        id: `${egg.id}-bottom`,
        image: egg.bottom,
        type: 'bottom',
        matched: false,
        fullImage: egg.full
      });
    });

    const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffledPieces);
    setSelectedPieces([]);
    setMatches([]);
    setGameCompleted(false);
    setGameOver(false);
    setShowMatch({ show: false, image: '' });
    setTimeLeft(180);
    setGameStarted(true);
    setAttempts(0);
    setCorrectMatches(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handlePieceClick = (piece: EggPiece) => {
    if (piece.matched || selectedPieces.some(p => p.id === piece.id) || gameOver || gameCompleted) return;
    if (selectedPieces.length >= 2) return;

    const newSelected = [...selectedPieces, piece];
    setSelectedPieces(newSelected);

    if (newSelected.length === 2) {
      setAttempts(prev => prev + 1);
      const [first, second] = newSelected;
      const firstEggId = first.id.split('-')[0];
      const secondEggId = second.id.split('-')[0];
      
      if (firstEggId === secondEggId && first.type !== second.type) {
        setCorrectMatches(prev => prev + 1);
        // Mostrar la imagen completa temporalmente
        setShowMatch({ show: true, image: first.fullImage || '' });
        
        setTimeout(() => {
          setPieces(prevPieces => 
            prevPieces.map(p => 
              p.id === first.id || p.id === second.id ? { ...p, matched: true } : p
            )
          );
          
          const newMatches = [...matches, { id: firstEggId, fullImage: first.fullImage || '' }];
          setMatches(newMatches);
          setSelectedPieces([]);
          setShowMatch({ show: false, image: '' });
          
          if (newMatches.length === eggImages.length) {
            setGameCompleted(true);
            setGameStarted(false);
            onComplete(true);
          }
        }, 4000);
      } else {
        setTimeout(() => {
          setSelectedPieces([]);
        }, 1000);
      }
    }
  };

  const renderPiece = (piece: EggPiece) => {
    const isSelected = selectedPieces.some(p => p.id === piece.id);
    const isMatched = piece.matched;
    
    return (
      <div 
        key={piece.id}
        className={`${styles.piece} ${isSelected ? styles.selected : ''} ${isMatched ? styles.matched : ''}`}
        onClick={() => handlePieceClick(piece)}
      >
        <img 
          src={piece.image} 
          alt={`Parte de huevo ${piece.type === 'top' ? 'superior' : 'inferior'}`}
          className={styles.pieceImage}
        />
        {isMatched && <div className={styles.matchEffect}></div>}
      </div>
    );
  };

  const handleExitGame = () => {
    onComplete(false);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>🥚 ¡Une los Huevos! 🥚</h1>
        
        <div className={styles.gameInfo}>
          <div className={`${styles.timer} ${timeLeft <= 30 ? styles.timerWarning : ''} ${timeLeft <= 10 ? styles.timerCritical : ''}`}>
            <span className={styles.timerIcon}>⏰</span>
            <span className={styles.timerText}>{formatTime(timeLeft)}</span>
          </div>
          
          <div className={styles.scoreBoard}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🎯</span>
              <span>Intentos: {attempts}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>✅</span>
              <span>Aciertos: {correctMatches}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🥚</span>
              <span>Completados: {matches.length}/{eggImages.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.gameBoard}>
        {pieces.map(piece => renderPiece(piece))}
      </div>
      
      <div className={styles.controls}>
        <button 
          className={styles.resetButton}
          onClick={initializeGame}
          disabled={showMatch.show}
        >
          🔄 Nuevo Juego
        </button>
        <button 
          className={styles.resetButton}
          onClick={handleExitGame}
          disabled={showMatch.show}
        >
          🚪 Salir del Minijuego
        </button>
      </div>
      
      {/* Efecto de mostrar imagen completa al hacer match */}
      {showMatch.show && (
        <div className={styles.fullEggOverlay}>
          <div className={styles.fullEggContainer}>
            <div className={styles.matchMessage}>¡Excelente! 🎉</div>
            <img 
              src={showMatch.image} 
              alt="Huevo completo" 
              className={styles.fullEggImage}
            />
            <div className={styles.confetti}></div>
          </div>
        </div>
      )}
      
      {/* Pantalla de Game Over */}
      {gameOver && !gameCompleted && (
        <div className={styles.gameOverScreen}>
          <div className={styles.gameOverContent}>
            <h2>⏰ ¡Se acabó el tiempo! ⏰</h2>
            <p>No lograste completar todos los huevos a tiempo</p>
            
            <div className={styles.finalStats}>
              <div className={styles.finalStat}>
                <span className={styles.statNumber}>{correctMatches}</span>
                <span className={styles.statLabel}>Huevos completados</span>
              </div>
              <div className={styles.finalStat}>
                <span className={styles.statNumber}>{attempts}</span>
                <span className={styles.statLabel}>Intentos realizados</span>
              </div>
              <div className={styles.finalStat}>
                <span className={styles.statNumber}>{attempts > 0 ? Math.round((correctMatches / attempts) * 100) : 0}%</span>
                <span className={styles.statLabel}>Precisión</span>
              </div>
            </div>
            
            <button 
              className={styles.playAgainButton}
              onClick={initializeGame}
            >
              🎮 Intentar otra vez
            </button>
          </div>
        </div>
      )}
      
      {/* Pantalla de finalización exitosa */}
      {gameCompleted && (
        <div className={styles.completionScreen}>
          <div className={styles.completionContent}>
            <h2>🎉 ¡Felicidades! 🎉</h2>
            <p>¡Completaste todos los huevos correctamente!</p>
            
            <div className={styles.victoryStats}>
              <div className={styles.victoryStat}>
                <span className={styles.statIcon}>⏱️</span>
                <span>Tiempo restante: {formatTime(timeLeft)}</span>
              </div>
              <div className={styles.victoryStat}>
                <span className={styles.statIcon}>🎯</span>
                <span>Precisión: {attempts > 0 ? Math.round((correctMatches / attempts) * 100) : 100}%</span>
              </div>
            </div>
            
            <div className={styles.completedEggsGallery}>
              <h3>🏆 Tus huevos completos:</h3>
              <div className={styles.completedEggsGrid}>
                {matches.map((match, index) => (
                  <div key={index} className={styles.completedEggContainer}>
                    <img 
                      src={match.fullImage} 
                      alt={`Huevo completo ${index + 1}`}
                      className={styles.completedEggImage}
                    />
                    <div className={styles.eggNumber}>{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className={styles.playAgainButton}
              onClick={initializeGame}
            >
              🎮 Jugar otra vez
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RompeCabezasHuevos;