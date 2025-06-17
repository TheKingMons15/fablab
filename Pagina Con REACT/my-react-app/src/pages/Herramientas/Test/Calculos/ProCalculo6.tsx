import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import RompeCabezasHuevos from '../../Minijuego/RompeCabezasHuevos';
import SnakeGame from '../../Minijuego/SnakeGame';

interface QuestionItem {
  question: string;
  answer: string | number;
  points: number;
  type: 'escrito';
  image?: string;
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo6: React.FC = () => {
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(9).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [showMiniGame, setShowMiniGame] = useState(false);
<<<<<<< HEAD
=======
  const [miniGameType, setMiniGameType] = useState<'egg' | 'snake'>('egg');
>>>>>>> 9a12e4b737eadba35ade477a8ade5f6b2065605c
  const [timeLeft, setTimeLeft] = useState(20 * 60);
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
      if (totalScore > 30) {
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
          question: "¿Cuántos puntos hay en la imagen?", 
          answer: "5", 
          points: 4,
          type: "escrito",
          image: '/img/puntos5.jpg'
        },
        { 
          question: "¿Cuántos puntos hay en la imagen?", 
          answer: "8", 
          points: 4,
          type: "escrito",
          image: '/img/puntos8.jpg'
        },
        { 
          question: "¿Cuántos puntos hay en la imagen?", 
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
          question: "Escribe los números del 10 al 0 en orden descendente, separados por comas", 
          answer: "10,9,8,7,6,5,4,3,2,1,0", 
          points: 2,
          type: "escrito"
        }
      ]
    },
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
    {
      name: "Cálculo mental",
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
          question: "2 + 7", 
          answer: "9", 
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
          question: "7 - 4", 
          answer: "3", 
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
          question: "Escribe con palabras el número: 57", 
          answer: "cincuenta y siete", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe con palabras el número: 15", 
          answer: "quince", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe con palabras el número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe con palabras el número: 9", 
          answer: "nueve", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Estimación",
      maxScore: 6,
      items: [
        { 
          question: "¿2 nubes en el cielo es poco o mucho? (escribe 'poco' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "¿2 niños jugando en el recreo es poco o mucho? (escribe 'poco' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "¿60 chicos en un cumpleaños es poco o mucho? (escribe 'poco' o 'mucho')", 
          answer: "mucho", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Resolución de problemas",
      maxScore: 4,
      items: [
        { 
          question: "Pedro tiene 8 bolitas rojas y 2 amarillas. ¿Cuántas bolitas tiene en total?", 
          answer: "10", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Pedro tiene 10 bolitas y pierde 5. ¿Cuántas bolitas le quedan?", 
          answer: "5", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Adaptación",
      maxScore: 8,
      items: [
        { 
          question: "¿Cuánto crees que cuesta una bicicleta? (escribe el número)", 
          answer: "150", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "¿Cuánto crees que cuesta una radio? (escribe el número)", 
          answer: "90", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "¿Cuánto crees que cuesta una pelota de cuero? (escribe el número)", 
          answer: "50", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "¿Cuánto crees que cuesta una gaseosa? (escribe el número)", 
          answer: "1.50", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
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
          question: "Escribe el número 'veinticinco'", 
          answer: "25", 
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
    
    setShowFeedback(true);
    
    if (isCorrect) {
      const newScore = [...score];
      newScore[currentSubtest] += currentQuestion.points;
      setScore(newScore);
      setAnimation('correct');
    } else {
      setAnimation('wrong');
    }
    
    setTimeout(() => {
      moveToNextItem();
    }, 2000);
  };

  const moveToNextItem = () => {
    setShowFeedback(false);
    setAnimation('');
    setWrittenAnswer('');
    
    if (currentItem + 1 >= subtests[currentSubtest].items.length) {
      const nextSubtest = currentSubtest + 1;
      if (nextSubtest > 0 && nextSubtest % 3 === 0 && nextSubtest < subtests.length) {
        setShowMiniGame(true);
        setMiniGameType(nextSubtest === 3 ? 'egg' : 'snake');
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
        if (totalScore > 30) {
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
      if (totalScore > 30) {
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
    setScore(Array(9).fill(0));
    setShowResult(false);
    setShowFeedback(false);
    setAnimation('');
    setWrittenAnswer('');
    setShowMiniGame(false);
    setMiniGameType('egg');
    setTimeLeft(20 * 60);
    setTimerActive(true);
    setTimeUp(false);
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 60) * 100;
    
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
              alt="Imagen de la pregunta"
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
            onChange={(e) => setWrittenAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && writtenAnswer.trim()) {
                handleAnswer(writtenAnswer);
              }
            }}
            disabled={timeUp}
          />
          <button 
            className={styles.submitButton}
            onClick={() => writtenAnswer.trim() && handleAnswer(writtenAnswer)}
            disabled={!writtenAnswer.trim() || timeUp}
          >
            Enviar respuesta
          </button>
        </div>
<<<<<<< HEAD
      </div>
    );
=======
      );
    }
    return null;
  };

  const renderOralInput = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if (currentQuestion.type === "oral") {
      return (
        <div className={styles.oralContainer}>
          <div className={styles.voiceControl}>
            <button
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              onClick={toggleVoiceRecognition}
              disabled={oralAnswerConfirmed || timeUp}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              {isListening ? ' Escuchando...' : ' Usar micrófono'}
            </button>
            
            {recognizedText && (
              <div className={styles.recognizedText}>
                <p>Reconocido: <strong>{recognizedText}</strong></p>
              </div>
            )}
          </div>
          
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="O escribe tu respuesta aquí..."
              value={oralAnswer}
              onChange={(e) => {
                setOralAnswer(e.target.value);
                setOralAnswerConfirmed(false);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && oralAnswer.trim()) {
                  setOralAnswerConfirmed(true);
                }
              }}
              disabled={oralAnswerConfirmed || timeUp}
            />
            <button 
              className={styles.submitButton}
              onClick={() => oralAnswer.trim() && setOralAnswerConfirmed(true)}
              disabled={!oralAnswer.trim() || oralAnswerConfirmed || timeUp}
            >
              Terminar
            </button>
          </div>

          {oralAnswerConfirmed && (
            <div className={styles.confirmationButtons}>
              <p>¿Estás seguro de tu respuesta?</p>
              <div className={styles.confirmationButtonGroup}>
                <button 
                  className={styles.confirmButton}
                  onClick={() => {
                    handleAnswer(oralAnswer);
                    setOralAnswerConfirmed(false);
                  }}
                  disabled={timeUp}
                >
                  Sí, enviar
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => {
                    setOralAnswerConfirmed(false);
                    setRecognizedText('');
                    setOralAnswer('');
                  }}
                  disabled={timeUp}
                >
                  No, corregir
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderCountingExercise = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];

    if (currentQuestion.type === "conteo") {
      const isCountingUp = currentSubtest === 0;
      const targetNumber = currentQuestion.countingItems ?? (isCountingUp ? 20 : 10);
      
      return (
        <div className={styles.countingContainer}>
          {currentQuestion.image && (
            <div className={styles.countingImageContainer}>
              <img 
                src={currentQuestion.image} 
                alt={`Imagen con ${currentQuestion.answer} puntos para contar`}
                className={styles.countingImage}
              />
              <div className={styles.imageCaption}>
                {currentQuestion.question}
              </div>
            </div>
          )}
          
          <div className={styles.countingHeader}>
            <button
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              onClick={toggleVoiceRecognition}
              disabled={timeUp}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              {isListening ? ' Escuchando...' : ' Usar micrófono'}
            </button>
            
            {recognizedText && (
              <div className={styles.recognizedText}>
                <p>Reconocido: <strong>{recognizedText}</strong></p>
              </div>
            )}
          </div>
          
          <div className={styles.countingProgress}>
            <p>
              {isCountingUp ? "Conteo ascendente: " : "Conteo descendente: "}
              {countingProgress > 0 ? (
                Array.from(
                  {length: isCountingUp ? countingProgress : targetNumber - countingProgress + 1}, 
                  (_, i) => isCountingUp ? i + 1 : targetNumber - i
                ).join(", ")
              ) : "..."}
            </p>
          </div>
          
          <div className={styles.countingControls}>
            <button 
              className={styles.countingButton}
              onClick={() => {
                handleManualCount();
                setCountingFinished(false);
              }}
              disabled={isCountingUp ? countingProgress >= targetNumber : countingProgress > targetNumber || timeUp}
            >
              {countingProgress === 0 ? 
                `Comenzar a contar ${isCountingUp ? 'desde 1' : `desde ${targetNumber}`}` : 
                `Continuar conteo`}
            </button>
            
            <button 
              className={styles.submitButton}
              onClick={() => {
                setCountingFinished(true);
              }}
              disabled={timeUp}
            >
              Terminar conteo
            </button>
          </div>

          {countingFinished && (
            <div className={styles.confirmationButtons}>
              <p>¿Terminaste de contar?</p>
              <div className={styles.confirmationButtonGroup}>
                <button 
                  className={styles.confirmButton}
                  onClick={() => {
                    const answer = isCountingUp ? countingProgress : targetNumber - countingProgress;
                    handleAnswer(answer.toString());
                    setCountingFinished(false);
                  }}
                  disabled={timeUp}
                >
                  Sí, continuar
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setCountingFinished(false)}
                  disabled={timeUp}
                >
                  No, seguir contando
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
>>>>>>> 9a12e4b737eadba35ade477a8ade5f6b2065605c
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
          <div className={`${styles.feedback} ${animation === 'correct' ? styles.correctFeedback : styles.incorrectFeedback}`}>
            <p>
              {animation === 'correct' 
                ? "¡Correcto! 🎉" 
                : `La respuesta correcta es: ${currentQuestion.answer}`}
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
            {miniGameType === 'egg' ? (
              <RompeCabezasHuevos onComplete={handleMiniGameComplete} />
            ) : (
              <SnakeGame onComplete={handleMiniGameComplete} />
            )}
          </div>
        ) : (
          <>
            <section className={styles.testHeader}>
              <div className={styles.titleWrapper}>
                <h1 className={styles.testTitle}>
                  <img src="/img/test.png" alt="Logo de Media Lab" className={styles.logoSmall} />
                  Pro-Cálculo <span className={styles.ageBadge}>6 años</span>
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
                        <span className={styles.scoreTotal}>/60</span>
                      </div>
                      {timeUp && (
                        <div className={styles.timeUpWarning}>
                          ⏰ El tiempo ha terminado
                        </div>
                      )}
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
          </>
        )}
      </main>
    </div>
  );
};

export default ProCalculo6;