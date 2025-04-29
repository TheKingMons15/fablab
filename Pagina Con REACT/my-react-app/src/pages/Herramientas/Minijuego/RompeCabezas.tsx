import React, { useState, useEffect } from 'react';
import styles from './RompeCabezasHuevos.module.css';

// 1. Definimos las props que el componente debe recibir
interface RompeCabezasHuevosProps {
  onComplete: (success: boolean) => void;
}

interface EggPiece {
  id: string;
  image: string;
  type: 'top' | 'bottom';
  matched: boolean;
}

const eggImages = [
  {
    id: 'egg1',
    top: '/img/eggs/egg1-top.png',
    bottom: '/img/eggs/egg1-bottom.png'
  },
  {
    id: 'egg2',
    top: '/img/eggs/egg2-top.png',
    bottom: '/img/eggs/egg2-bottom.png'
  },
  {
    id: 'egg3',
    top: '/img/eggs/egg3-top.png',
    bottom: '/img/eggs/egg3-bottom.png'
  },
  {
    id: 'egg4',
    top: '/img/eggs/egg4-top.png',
    bottom: '/img/eggs/egg4-bottom.png'
  }
];

// 2. Añadimos las props al componente
export const RompeCabezasHuevos: React.FC<RompeCabezasHuevosProps> = ({ onComplete }) => {
  const [pieces, setPieces] = useState<EggPiece[]>([]);
  const [selectedPieces, setSelectedPieces] = useState<EggPiece[]>([]);
  const [matches, setMatches] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Inicializar el juego
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newPieces: EggPiece[] = [];
    
    eggImages.forEach(egg => {
      newPieces.push({
        id: `${egg.id}-top`,
        image: egg.top,
        type: 'top',
        matched: false
      });
      newPieces.push({
        id: `${egg.id}-bottom`,
        image: egg.bottom,
        type: 'bottom',
        matched: false
      });
    });

    const shuffledPieces = [...newPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffledPieces);
    setSelectedPieces([]);
    setMatches(0);
    setGameCompleted(false);
  };

  const handlePieceClick = (piece: EggPiece) => {
    if (piece.matched || selectedPieces.some(p => p.id === piece.id)) return;
    if (selectedPieces.length >= 2) return;

    const newSelected = [...selectedPieces, piece];
    setSelectedPieces(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const firstEggId = first.id.split('-')[0];
      const secondEggId = second.id.split('-')[0];
      
      if (firstEggId === secondEggId && first.type !== second.type) {
        setPieces(prevPieces => 
          prevPieces.map(p => 
            p.id === first.id || p.id === second.id ? { ...p, matched: true } : p
          )
        );
        
        const newMatches = matches + 1;
        setMatches(newMatches);
        setSelectedPieces([]);
        
        if (newMatches === eggImages.length) {
          setGameCompleted(true);
          onComplete(true); // Notificar al padre que se completó con éxito
        }
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

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>¡Une los Huevos!</h1>
      
      <div className={styles.gameBoard}>
        {pieces.map(piece => renderPiece(piece))}
      </div>
      
      <div className={styles.stats}>
        <p>Huevos completados: {matches} / {eggImages.length}</p>
      </div>
      
      {gameCompleted && (
        <div className={styles.completionScreen}>
          <h2>¡Felicidades! 🎉</h2>
          <p>Completaste todos los huevos</p>
          <button 
            className={styles.playAgainButton}
            onClick={initializeGame}
          >
            Jugar otra vez
          </button>
        </div>
      )}
      
      <button 
        className={styles.resetButton}
        onClick={initializeGame}
      >
        Reiniciar Juego
      </button>
    </div>
  );
};