import React, { useState, useEffect } from 'react';
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
  const [showMatch, setShowMatch] = useState<{ show: boolean; image: string }>({ show: false, image: '' });

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
    setShowMatch({ show: false, image: '' });
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

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>¡Une los Huevos!</h1>
      
      <div className={styles.gameBoard}>
        {pieces.map(piece => renderPiece(piece))}
      </div>
      
      <div className={styles.stats}>
        <p>Huevos completados: {matches.length} / {eggImages.length}</p>
      </div>
      
      {/* Efecto de mostrar imagen completa al hacer match */}
      {showMatch.show && (
        <div className={styles.fullEggOverlay}>
          <div className={styles.fullEggContainer}>
            <img 
              src={showMatch.image} 
              alt="Huevo completo" 
              className={styles.fullEggImage}
            />
            <div className={styles.confetti}></div>
          </div>
        </div>
      )}
      
      {/* Pantalla de finalización */}
      {gameCompleted && (
        <div className={styles.completionScreen}>
          <h2>¡Felicidades! 🎉</h2>
          <p>Completaste todos los huevos correctamente</p>
          
          <div className={styles.completedEggsGallery}>
            <h3>Tus huevos completos:</h3>
            <div className={styles.completedEggsGrid}>
              {matches.map((match, index) => (
                <div key={index} className={styles.completedEggContainer}>
                  <img 
                    src={match.fullImage} 
                    alt={`Huevo completo ${index + 1}`}
                    className={styles.completedEggImage}
                  />
                </div>
              ))}
            </div>
          </div>
          
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

export default RompeCabezasHuevos;