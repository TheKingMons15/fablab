import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaRedo, FaMusic, FaVolumeMute } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';

// Definición de tipos para TypeScript
type QuestionItem = {
  question: string;
  answer: string | number;
  points: number;
  type: 'oral' | 'escrito' | 'opciones';
  options?: string[];
  countingItems?: number; // Para enumeración
};

type Subtest = {
  name: string;
  maxScore: number;
  items: QuestionItem[];
};

const ProCalculo6: React.FC = () => {
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(9).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>(Array(9).fill([]));
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [optionSelected, setOptionSelected] = useState<string | number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [oralAnswer, setOralAnswer] = useState('');
  const [countingProgress, setCountingProgress] = useState(0);

  // Estructura exacta del test según el documento PDF
  const subtests: Subtest[] = [
    // 1. Enumeración (3 ítems)
    {
      name: "Enumeración",
      maxScore: 12,
      items: [
        { 
          question: "Cuenta los puntos en voz alta hasta donde puedas", 
          answer: "20", // Se espera que cuente hasta 20
          points: 4,
          type: "oral",
          countingItems: 20
        },
        { 
          question: "Cuenta los números en orden ascendente nuevamente", 
          answer: "20", 
          points: 4,
          type: "oral",
          countingItems: 20
        },
        { 
          question: "Cuenta los números en orden ascendente una vez más", 
          answer: "20", 
          points: 4,
          type: "oral",
          countingItems: 20
        }
      ]
    },
    // 2. Contar oralmente para atrás (1 ítem)
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Cuenta hacia atrás desde 10", 
          answer: "0", // Debe llegar a 0
          points: 2,
          type: "oral" 
        }
      ]
    },
    // 3. Escritura de números (3 ítems)
    {
      name: "Escritura de números",
      maxScore: 6,
      items: [
        { 
          question: "Escribe el número 'siete'", 
          answer: "7", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'veinte'", 
          answer: "20", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'trescientos cinco'", 
          answer: "305", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    // 4. Cálculo mental oral (6 ítems)
    {
      name: "Cálculo mental",
      maxScore: 12,
      items: [
        { 
          question: "10 + 10", 
          answer: "20", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "1 + 15", 
          answer: "16", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "2 + 7", 
          answer: "9", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "10 - 3", 
          answer: "7", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "18 - 6", 
          answer: "12", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "7 - 4", 
          answer: "3", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    // 5. Lectura de números (4 ítems)
    {
      name: "Lectura de números",
      maxScore: 8,
      items: [
        { 
          question: "Lee este número: 57", 
          answer: "cincuenta y siete", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 15", 
          answer: "quince", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 9", 
          answer: "nueve", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    // 6. Estimación de cantidades (3 ítems)
    {
      name: "Estimación",
      maxScore: 6,
      items: [
        { 
          question: "¿2 nubes en el cielo es poco o mucho?", 
          answer: "poco", 
          points: 2,
          type: "opciones",
          options: ["poco", "mucho"] 
        },
        { 
          question: "¿2 niños jugando en el recreo es poco o mucho?", 
          answer: "poco", 
          points: 2,
          type: "opciones",
          options: ["poco", "mucho"] 
        },
        { 
          question: "¿60 chicos en un cumpleaños es poco o mucho?", 
          answer: "mucho", 
          points: 2,
          type: "opciones",
          options: ["poco", "mucho"] 
        }
      ]
    },
    // 7. Resolución de problemas (2 ítems)
    {
      name: "Resolución de problemas",
      maxScore: 4,
      items: [
        { 
          question: "Pedro tiene 8 bolitas rojas y 2 amarillas. ¿Cuántas bolitas tiene en total?", 
          answer: "10", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Pedro tiene 10 bolitas y pierde 5. ¿Cuántas bolitas le quedan?", 
          answer: "5", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    // 8. Adaptación (4 ítems)
    {
      name: "Adaptación",
      maxScore: 8,
      items: [
        { 
          question: "¿Cuánto crees que cuesta una bicicleta?", 
          answer: "150", 
          points: 2,
          type: "opciones",
          options: ["50", "150", "300"] 
        },
        { 
          question: "¿Cuánto crees que cuesta una radio?", 
          answer: "90", 
          points: 2,
          type: "opciones",
          options: ["30", "90", "200"] 
        },
        { 
          question: "¿Cuánto crees que cuesta una pelota de cuero?", 
          answer: "50", 
          points: 2,
          type: "opciones",
          options: ["20", "50", "100"] 
        },
        { 
          question: "¿Cuánto crees que cuesta una gaseosa?", 
          answer: "1.50", 
          points: 2,
          type: "opciones",
          options: ["1.50", "5", "10"] 
        }
      ]
    },
    // 9. Escribir en cifra (2 ítems)
    {
      name: "Escribir en cifra",
      maxScore: 2,
      items: [
        { 
          question: "Escribe el número 'quince'", 
          answer: "15", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'quince'", 
          answer: "15", 
          points: 1,
          type: "escrito" 
        }
      ]
    }
  ];

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (!showResult && !showFeedback && timeLeft === null) {
      setTimeLeft(30);
    }
    
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0 && !showFeedback) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleTimeUp();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, showFeedback, currentSubtest, currentItem, showResult]);

  const handleTimeUp = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      setCorrectAnswer(false);
      playSound('wrong');
      
      const newAnswers = [...userAnswers];
      newAnswers[currentSubtest] = [...newAnswers[currentSubtest], "tiempo_agotado"];
      setUserAnswers(newAnswers);
      
      setTimeout(() => {
        moveToNextItem();
      }, 2000);
    }
  };

  const playSound = (type: 'correct' | 'wrong' | 'complete') => {
    if (!soundEnabled) return;
    console.log(`Playing ${type} sound`);
  };

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback) return;
    
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    let isCorrect = false;
    
    // Para respuestas escritas, comparamos sin distinguir mayúsculas/espacios
    if (currentQuestion.type === "escrito") {
      isCorrect = selectedAnswer.toString().trim().toLowerCase() === 
                  currentQuestion.answer.toString().trim().toLowerCase();
    } 
    // Para enumeración y contar para atrás, verificamos si llegó al número esperado
    else if (currentSubtest === 0 || currentSubtest === 1) {
      isCorrect = selectedAnswer.toString() === currentQuestion.answer.toString();
    }
    // Para otras respuestas orales, comparamos directamente
    else {
      isCorrect = selectedAnswer === currentQuestion.answer;
    }
    
    setOptionSelected(selectedAnswer);
    setCorrectAnswer(isCorrect);
    setShowFeedback(true);
    
    // Actualizar puntuación
    if (isCorrect) {
      const newScore = [...score];
      newScore[currentSubtest] += currentQuestion.points;
      setScore(newScore);
      playSound('correct');
      setAnimation('correct');
    } else {
      playSound('wrong');
      setAnimation('wrong');
    }
    
    // Actualizar respuestas
    const newAnswers = [...userAnswers];
    newAnswers[currentSubtest] = [...newAnswers[currentSubtest], selectedAnswer];
    setUserAnswers(newAnswers);
    
    setTimeout(() => {
      moveToNextItem();
    }, 2000);
  };

  const moveToNextItem = () => {
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setOralAnswer('');
    setCountingProgress(0);
    
    if (currentItem + 1 < subtests[currentSubtest].items.length) {
      setCurrentItem(currentItem + 1);
      setTimeLeft(30);
    } else {
      if (currentSubtest + 1 < subtests.length) {
        setCurrentSubtest(currentSubtest + 1);
        setCurrentItem(0);
        setTimeLeft(30);
      } else {
        setShowResult(true);
        playSound('complete');
        
        const totalScore = score.reduce((a, b) => a + b, 0);
        if (totalScore > 30) {
          launchConfetti();
        }
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
    setScore(Array(9).fill(0));
    setShowResult(false);
    setUserAnswers(Array(9).fill([]));
    setTimeLeft(30);
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setOralAnswer('');
    setCountingProgress(0);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 60) * 100;
    
    if (percentage >= 80) return "¡Excelente trabajo! 🎉";
    if (percentage >= 60) return "¡Muy bien hecho! 🌟";
    if (percentage >= 40) return "¡Buen intento! 👍";
    return "¡Sigue practicando! 💪";
  };

  const handleWrittenAnswerSubmit = () => {
    if (writtenAnswer.trim()) {
      handleAnswer(writtenAnswer);
    }
  };

  const handleOralAnswerSubmit = () => {
    if (oralAnswer.trim()) {
      handleAnswer(oralAnswer);
    }
  };

  const simulateCounting = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const target = currentQuestion.countingItems || 10;
    
    if (countingProgress < target) {
      setCountingProgress(countingProgress + 1);
    } else {
      handleAnswer(target.toString());
    }
  };

  const renderInputField = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if (currentQuestion.type === "escrito") {
      return (
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Escribe tu respuesta..."
            value={writtenAnswer}
            onChange={(e) => setWrittenAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleWrittenAnswerSubmit();
              }
            }}
          />
          <button 
            className={styles.submitButton}
            onClick={handleWrittenAnswerSubmit}
            disabled={!writtenAnswer.trim()}
          >
            Enviar
          </button>
        </div>
      );
    }
    return null;
  };

  const renderOralInput = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if (currentQuestion.type === "oral" && currentSubtest !== 0 && currentSubtest !== 1) {
      return (
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Di tu respuesta..."
            value={oralAnswer}
            onChange={(e) => setOralAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleOralAnswerSubmit();
              }
            }}
          />
          <button 
            className={styles.submitButton}
            onClick={handleOralAnswerSubmit}
            disabled={!oralAnswer.trim()}
          >
            Enviar
          </button>
        </div>
      );
    }
    return null;
  };

  const renderCountingExercise = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if ((currentSubtest === 0 || currentSubtest === 1) && currentQuestion.type === "oral") {
      return (
        <div className={styles.countingContainer}>
          <div className={styles.countingProgress}>
            {currentSubtest === 0 ? (
              <p>Contando: {countingProgress > 0 ? Array.from({length: countingProgress}, (_, i) => i + 1).join(", ") : "..."}</p>
            ) : (
              <p>Contando hacia atrás: {countingProgress > 0 ? 
                Array.from({length: countingProgress}, (_, i) => 10 - i).join(", ") : "..."}</p>
            )}
          </div>
          <button 
            className={styles.countingButton}
            onClick={simulateCounting}
          >
            {countingProgress === 0 ? "Comenzar a contar" : "Siguiente número"}
          </button>
          <button 
            className={styles.submitButton}
            onClick={() => handleAnswer(countingProgress > 0 ? 
              (currentSubtest === 0 ? countingProgress.toString() : (10 - countingProgress + 1).toString()) : "0")}
            disabled={countingProgress === 0}
          >
            Terminar
          </button>
        </div>
      );
    }
    return null;
  };

  const renderQuestion = () => {
    const currentSubtestData = subtests[currentSubtest];
    const currentQuestion = currentSubtestData.items[currentItem];
    
    return (
      <div className={styles.questionContent}>
        <h3 className={styles.subtestTitle}>{currentSubtestData.name}</h3>
        <p className={styles.questionPrompt}>{currentQuestion.question}</p>
        
        {currentQuestion.type === "opciones" && currentQuestion.options && (
          <div className={styles.optionsGrid}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} 
                  ${optionSelected === option ? styles.selected : ''} 
                  ${showFeedback && option === currentQuestion.answer ? styles.correct : ''} 
                  ${showFeedback && optionSelected === option && option !== currentQuestion.answer ? styles.incorrect : ''}`}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
              >
                <span className={styles.optionContent}>
                  <span className={styles.optionText}>{option}</span>
                  {showFeedback && option === currentQuestion.answer && (
                    <FaCheck className={styles.feedbackIcon} />
                  )}
                  {showFeedback && optionSelected === option && option !== currentQuestion.answer && (
                    <FaTimes className={styles.feedbackIcon} />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
        
        {renderCountingExercise()}
        {renderInputField()}
        {renderOralInput()}
        
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
        
        <section className={styles.testHeader}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.testTitle}>
              <img src="/img/test.png" alt="Logo de Media Lab" className={styles.logoSmall} />
              Pro-Cálculo <span className={styles.ageBadge}>6 años</span>
            </h1>
          </div>
          
          <div className={styles.controlButtons}>
            <button
              className={styles.soundButton}
              onClick={toggleSound}
              aria-label={soundEnabled ? "Silenciar sonidos" : "Activar sonidos"}
            >
              {soundEnabled ? <FaMusic /> : <FaVolumeMute />}
            </button>
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
                Tiempo: <span className={timeLeft && timeLeft < 10 ? styles.timerWarning : ''}>{timeLeft}</span>
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
                    <span className={styles.scoreTotal}>/60</span>
                  </div>
                </div>
                
                <p className={styles.scoreText}>
                  Puntuación total: <span className={styles.scoreHighlight}>{score.reduce((a, b) => a + b, 0)}</span> de 60 puntos
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
      </main>
    </div>
  );
};

export default ProCalculo6;