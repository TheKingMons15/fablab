import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import RompeCabezasHuevos from '../../Minijuego/RompeCabezasHuevos';

interface QuestionItem {
  question: string;
  answer: string | number;
  points: number;
  type: 'escrito'; // Simplificado a solo tipo escrito
  options?: string[];
  countingItems?: number;
  min?: number;
  max?: number;
  image?: string;
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo7: React.FC = () => {
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(12).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>(Array(12).fill([]));
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [writtenAnswerConfirmed, setWrittenAnswerConfirmed] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult && !timeUp) {
      setTimerActive(false);
      setTimeUp(true);
      setShowResult(true);
      const totalScore = score.reduce((a, b) => a + b, 0);
      if (totalScore > 50) {
        launchConfetti();
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, timerActive, showResult, timeUp, score]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const subtests: Subtest[] = [
    {
      name: "Enumeración",
      maxScore: 12,
      items: [
        { 
          question: "¿Cuántos puntos hay en la imagen? (13 puntos)", 
          answer: "13", 
          points: 4,
          type: "escrito",
          image: '/img/puntos13.jpg'
        },
        { 
          question: "¿Cuántos puntos hay en la imagen? (8 puntos)", 
          answer: "8", 
          points: 4,
          type: "escrito",
          image: '/img/puntos8.jpg'
        },
        { 
          question: "¿Cuántos puntos hay en la imagen? (10 puntos)", 
          answer: "10", 
          points: 4,
          type: "escrito",
          image: '/img/puntos10.jpg'
        }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Escribe los números contando hacia atrás desde 15 hasta 0", 
          answer: "15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0", 
          points: 2,
          type: "escrito"
        }
      ]
    },
    {
      name: "Escritura de números",
      maxScore: 8,
      items: [
        { 
          question: "Escribe el número 'treinta y ocho'", 
          answer: "38", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'ciento sesenta y nueve'", 
          answer: "169", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'noventa y siete'", 
          answer: "97", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'mil doscientos'", 
          answer: "1200", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Cálculo mental oral",
      maxScore: 12,
      items: [
        { 
          question: "10 + 10", 
          answer: "20", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "1 + 15", 
          answer: "16", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "12 + 7", 
          answer: "19", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "10 - 3", 
          answer: "7", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "18 - 6", 
          answer: "12", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "25 - 12", 
          answer: "13", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 8,
      items: [
        { 
          question: "Lee este número: 57", 
          answer: "cincuenta y siete", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Lee este número: 15", 
          answer: "quince", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Lee este número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Lee este número: 9", 
          answer: "nueve", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Posicionar en escala",
      maxScore: 6,
      items: [
        { 
          question: "Escribe dónde colocarías el número 80 en una escala del 0 al 100", 
          answer: "80", 
          points: 2,
          type: "escrito"
        },
        { 
          question: "Escribe dónde colocarías el número 62 en una escala del 0 al 100", 
          answer: "62", 
          points: 2,
          type: "escrito"
        },
        { 
          question: "Escribe dónde colocarías el número 10 en una escala del 0 al 100", 
          answer: "10", 
          points: 2,
          type: "escrito"
        }
      ]
    },
    {
      name: "Estimación perceptiva",
      maxScore: 4,
      items: [
        { 
          question: "¿Cuántas pelotas y vasos hay? (57 pelotas, 83 vasos)", 
          answer: "57/83", 
          points: 4,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Estimación en contexto",
      maxScore: 6,
      items: [
        { 
          question: "¿2 nubes en el cielo es poco o mucho? (Escribe 'poco' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito"
        },
        { 
          question: "¿2 niños jugando en el recreo es poco o mucho? (Escribe 'poco' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito"
        },
        { 
          question: "¿60 niños en un cumpleaños es poco o mucho? (Escribe 'poco' o 'mucho')", 
          answer: "mucho", 
          points: 2,
          type: "escrito"
        }
      ]
    },
    {
      name: "Resolución de problemas",
      maxScore: 8,
      items: [
        { 
          question: "12 - 5", 
          answer: "7", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "16 - 4", 
          answer: "12", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "6 + 7", 
          answer: "13", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "4 + (4+3) + (7-2)", 
          answer: "16", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Comparación de números",
      maxScore: 6,
      items: [
        { 
          question: "¿Cuál es mayor: 654 o 546? (Escribe el número mayor)", 
          answer: "654", 
          points: 2,
          type: "escrito"
        },
        { 
          question: "¿Cuál es mayor: 97 o 352? (Escribe el número mayor)", 
          answer: "352", 
          points: 2,
          type: "escrito"
        },
        { 
          question: "¿Cuál es mayor: 96 o 69? (Escribe el número mayor)", 
          answer: "96", 
          points: 2,
          type: "escrito"
        }
      ]
    },
    {
      name: "Determinación de cantidad",
      maxScore: 12,
      items: [
        { 
          question: "Escribe el número menor en: 5, 8520, 000, 12, 49, 50, 97", 
          answer: "0", 
          points: 1,
          type: "escrito"
        },
        { 
          question: "Escribe el número mayor en: 1234, 1993, 3000, 8520", 
          answer: "8520", 
          points: 1,
          type: "escrito"
        }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 3,
      items: [
        { 
          question: "Escribe los 5 números que siguen después de 137", 
          answer: "138,139,140,141,142", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe los 5 números antes de 362", 
          answer: "361,360,359,358,357", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe los 5 números después de 362", 
          answer: "363,364,365,366,367", 
          points: 1,
          type: "escrito" 
        }
      ]
    }
  ];

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback || timeUp) return;
    
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isCorrect = normalizeText(selectedAnswer.toString()) === 
                     normalizeText(currentQuestion.answer.toString());
    
    setCorrectAnswer(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      const newScore = [...score];
      newScore[currentSubtest] += currentQuestion.points;
      setScore(newScore);
      setAnimation('correct');
    } else {
      setAnimation('wrong');
    }
    
    const newAnswers = [...userAnswers];
    newAnswers[currentSubtest] = [...newAnswers[currentSubtest], selectedAnswer];
    setUserAnswers(newAnswers);
    
    setTimeout(() => {
      moveToNextItem();
    }, 2000);
  };

  const moveToNextItem = () => {
    setShowFeedback(false);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    
    if (currentItem + 1 >= subtests[currentSubtest].items.length) {
      const nextSubtest = currentSubtest + 1;
      if (nextSubtest > 0 && nextSubtest % 3 === 0 && nextSubtest < subtests.length) {
        setShowMiniGame(true);
        return;
      }
    }
    
    if (currentItem + 1 < subtests[currentSubtest].items.length) {
      setCurrentItem(currentItem + 1);
    } else {
      if (currentSubtest + 1 < subtests.length) {
        setCurrentSubtest(currentSubtest + 1);
        setCurrentItem(0);
      } else {
        setShowResult(true);
        setTimerActive(false);
        const totalScore = score.reduce((a, b) => a + b, 0);
        if (totalScore > 50) {
          launchConfetti();
        }
      }
    }
  };

  const handleMiniGameComplete = (success: boolean) => {
    setShowMiniGame(false);

    if (success) {
      setAnimation('correct');
    } else {
      setAnimation('wrong');
    }
    
    if (currentSubtest + 1 < subtests.length) {
      setCurrentSubtest(currentSubtest + 1);
      setCurrentItem(0);
    } else {
      setShowResult(true);
      setTimerActive(false);
      const totalScore = score.reduce((a, b) => a + b, 0);
      if (totalScore > 50) {
        launchConfetti();
      }
    }
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const restartTest = () => {
    setCurrentSubtest(0);
    setCurrentItem(0);
    setScore(Array(12).fill(0));
    setShowResult(false);
    setUserAnswers(Array(12).fill([]));
    setShowFeedback(false);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    setShowMiniGame(false);
    setTimeLeft(25 * 60);
    setTimerActive(true);
    setTimeUp(false);
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 87) * 100;
    
    if (timeUp) {
      return "¡Tiempo terminado! ⏰";
    }
    
    if (percentage >= 80) return "¡Excelente trabajo! 🎉";
    if (percentage >= 60) return "¡Muy bien hecho! 🌟";
    if (percentage >= 40) return "¡Buen intento! 👍";
    return "¡Sigue practicando! 💪";
  };

  const renderInputField = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    return (
      <div className={styles.writtenAnswerContainer}>
        {currentQuestion.image && (
          <div className={styles.questionImageContainer}>
            <img 
              src={currentQuestion.image} 
              alt={currentQuestion.question}
              className={styles.questionImage}
            />
          </div>
        )}
        
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Escribe tu respuesta aquí..."
            value={writtenAnswer}
            onChange={(e) => {
              setWrittenAnswer(e.target.value);
              setWrittenAnswerConfirmed(false);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && writtenAnswer.trim()) {
                setWrittenAnswerConfirmed(true);
              }
            }}
            disabled={timeUp}
          />
          <button 
            className={styles.submitButton}
            onClick={() => writtenAnswer.trim() && setWrittenAnswerConfirmed(true)}
            disabled={!writtenAnswer.trim() || timeUp}
          >
            Terminar
          </button>
        </div>

        {writtenAnswerConfirmed && (
          <div className={styles.confirmationButtons}>
            <p>¿Estás seguro de tu respuesta?</p>
            <div className={styles.confirmationButtonGroup}>
              <button 
                className={styles.confirmButton}
                onClick={() => {
                  handleAnswer(writtenAnswer);
                  setWrittenAnswerConfirmed(false);
                }}
                disabled={timeUp}
              >
                Sí, enviar
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setWrittenAnswerConfirmed(false)}
                disabled={timeUp}
              >
                No, corregir
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    const currentSubtestData = subtests[currentSubtest];
    const currentQuestion = currentSubtestData.items[currentItem];
    
    return (
      <div className={styles.questionContent}>
        <h3 className={styles.subtestTitle}>{currentSubtestData.name}</h3>
        <p className={styles.questionPrompt}>{currentQuestion.question}</p>
        
        {renderInputField()}
        
        {showFeedback && (
          <div className={`${styles.feedback} ${correctAnswer ? styles.correctFeedback : styles.incorrectFeedback}`}>
            <p>
              {correctAnswer 
                ? "¡Correcto! 🎉" 
                : `La respuesta correcta es: ${subtests[currentSubtest].items[currentItem].answer}`}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.testContainer}>
        <div className={styles.cloudBackground}></div>
        
        {showMiniGame ? (
          <div className={styles.miniGameContainer}>
            <RompeCabezasHuevos onComplete={handleMiniGameComplete} />
          </div>
        ) : (
          <>
            <section className={styles.testHeader}>
              <div className={styles.titleWrapper}>
                <h1 className={styles.testTitle}>
                  <img src="/img/test.png" alt="Logo de Media Lab" className={styles.logoSmall} />
                  Pro-Cálculo <span className={styles.ageBadge}>7 años</span>
                </h1>
              </div>
              
              <div className={styles.controlButtons}>
                <a href="/Herramientas/test" className={styles.backButton}>
                  <FaArrowLeft /> Volver
                </a>
              </div>
            </section>

            {!showResult ? (
              <section className={`${styles.questionSection} ${animation ? styles[animation] : ''}`}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${((currentSubtest + (currentItem / subtests[currentSubtest].items.length)) / subtests.length) * 100}%` 
                    }}
                  ></div>
                </div>
                
                <div className={styles.questionInfo}>
                  <div className={styles.questionCounter}>
                    Subtest {currentSubtest + 1} de {subtests.length} - Ítem {currentItem + 1} de {subtests[currentSubtest].items.length}
                  </div>
                  <div className={styles.timer}>
                    <FaClock /> Tiempo restante: {formatTime(timeLeft)}
                  </div>
                </div>
                
                <div className={styles.questionCard}>
                  {renderQuestion()}
                </div>
              </section>
            ) : (
              <section className={styles.resultSection}>
                <div className={styles.resultContainer}>
                  <h2 className={styles.resultTitle}>
                    {getResultMessage()}
                  </h2>
                  
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreVisual}>
                      <div className={styles.scoreCircle}>
                        <span className={styles.scoreNumber}>{score.reduce((a, b) => a + b, 0)}</span>
                        <span className={styles.scoreTotal}>/87</span>
                      </div>
                      {timeUp && (
                        <div className={styles.timeUpWarning}>
                          ⏰ El tiempo ha terminado
                        </div>
                      )}
                    </div>
                    
                    <p className={styles.scoreText}>
                      Puntuación total: <span className={styles.scoreHighlight}>{score.reduce((a, b) => a + b, 0)}</span> de 87 puntos
                    </p>
                    
                    <div className={styles.subtestScores}>
                      <h3>Puntuación por subtest:</h3>
                      <ul>
                        {subtests.map((subtest, index) => (
                          <li key={index}>
                            {subtest.name}: {score[index]} / {subtest.maxScore}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={styles.actionsContainer}>
                      <button className={styles.restartButton} onClick={restartTest}>
                        <FaRedo /> Intentar de nuevo
                      </button>
                      <a href="/test" className={styles.homeButton}>
                        Elegir otra prueba
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProCalculo7;