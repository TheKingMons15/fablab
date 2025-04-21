import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaStar, FaTrophy, FaRedo, FaMusic, FaVolumeMute } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';

const ProCalculo6: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [optionSelected, setOptionSelected] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animation, setAnimation] = useState('');
  
  // Preguntas para niños de 6 años basadas en el test Pro-Cálculo
  const questions = [
    // 1. Enumeración
    {
      type: "enumeration",
      question: "Cuenta los puntos en voz alta:",
      image: "/img/enumeracion.png",
      answer: "8",
      options: ["6", "7", "8", "9"],
      explanation: "Hay 8 puntos en total."
    },
    // 2. Contar hacia atrás
    {
      type: "count_backwards",
      question: "Cuenta hacia atrás desde 10:",
      answer: "10,9,8,7,6,5,4,3,2,1,0",
      options: ["10,8,6,4,2,0", "10,9,7,5,3,1", "10,9,8,7,6,5,4,3,2,1,0", "9,7,5,3,1"],
      explanation: "Debes contar: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0"
    },
    // 3. Escritura de números
    {
      type: "number_writing",
      question: "Escribe el número que se dicta: 'veinte'",
      answer: "20",
      options: ["12", "20", "02", "22"],
      explanation: "El número 'veinte' se escribe como 20."
    },
    // 4. Cálculo mental oral
    {
      type: "mental_math",
      question: "¿Cuánto es 10 + 10?",
      answer: "20",
      options: ["10", "20", "30", "100"],
      explanation: "10 + 10 = 20"
    },
    {
      type: "mental_math",
      question: "¿Cuánto es 18 - 6?",
      answer: "12",
      options: ["10", "11", "12", "13"],
      explanation: "18 - 6 = 12"
    },
    // 5. Lectura de números
    {
      type: "number_reading",
      question: "Lee este número en voz alta: 57",
      answer: "cincuenta y siete",
      options: ["cinco siete", "cincuenta y siete", "setenta y cinco", "cinco y siete"],
      explanation: "57 se lee 'cincuenta y siete'."
    },
    // 6. Estimación de cantidades
    {
      type: "quantity_estimation",
      question: "¿60 niños en un cumpleaños es poco, más o menos, o mucho?",
      answer: "mucho",
      options: ["poco", "más o menos", "mucho"],
      explanation: "60 niños en un cumpleaños es una cantidad grande."
    },
    // 7. Resolución de problemas
    {
      type: "problem_solving",
      question: "Pedro tiene 8 bolitas rojas y 2 amarillas. ¿Cuántas bolitas tiene en total?",
      answer: "10",
      options: ["6", "8", "10", "12"],
      explanation: "8 bolitas rojas + 2 amarillas = 10 bolitas"
    },
    // 8. Adaptación (asociación de precios)
    {
      type: "price_adaptation",
      question: "¿Cuánto crees que cuesta una pelota de cuero?",
      answer: "$50",
      options: ["$10", "$50", "$100", "$200"],
      explanation: "Una pelota de cuero básica cuesta alrededor de $50."
    },
    // 9. Escribir en cifra
    {
      type: "number_sequence",
      question: "Escribe los números que vienen después del 15:",
      answer: "16,17,18,19,20",
      options: ["14,13,12,11,10", "16,17,18,19,20", "15,16,17,18,19", "20,19,18,17,16"],
      explanation: "Después del 15 vienen: 16, 17, 18, 19, 20"
    }
  ];

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (currentQuestion >= 0 && !showResult && !showFeedback && timeLeft === null) {
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
  }, [timeLeft, showFeedback, currentQuestion, showResult]);

  const handleTimeUp = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      setCorrectAnswer(false);
      playSound('wrong');
      
      setTimeout(() => {
        moveToNextQuestion(null);
      }, 2000);
    }
  };

  const playSound = (type: 'correct' | 'wrong' | 'complete') => {
    if (!soundEnabled) return;
    console.log(`Playing ${type} sound`);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (showFeedback) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
    setOptionSelected(selectedAnswer);
    setCorrectAnswer(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
      playSound('correct');
      setAnimation('correct');
    } else {
      playSound('wrong');
      setAnimation('wrong');
    }
    
    setTimeout(() => {
      moveToNextQuestion(selectedAnswer);
    }, 2000);
  };

  const moveToNextQuestion = (selectedAnswer: string | null) => {
    if (selectedAnswer !== null) {
      setUserAnswers([...userAnswers, selectedAnswer]);
    } else {
      setUserAnswers([...userAnswers, 'tiempo_agotado']);
    }
    
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      playSound('complete');
      
      if (score + (selectedAnswer === questions[currentQuestion].answer ? 1 : 0) > questions.length / 2) {
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
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    setTimeLeft(30);
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const getResultMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "¡Excelente trabajo! 🎉";
    if (percentage >= 60) return "¡Muy bien hecho! 🌟";
    if (percentage >= 40) return "¡Buen intento! 👍";
    return "¡Sigue practicando! 💪";
  };

  const renderQuestion = () => {
    const currentQ = questions[currentQuestion];
    
    switch(currentQ.type) {
      case 'enumeration':
        return (
          <div className={styles.questionContent}>
            <img src={currentQ.image} alt="Puntos para contar" className={styles.enumerationImage} />
            <p className={styles.questionPrompt}>Cuenta los puntos en voz alta:</p>
          </div>
        );
      
      case 'count_backwards':
        return (
          <div className={styles.questionContent}>
            <p className={styles.questionPrompt}>Cuenta hacia atrás desde 10:</p>
          </div>
        );
      
      case 'number_writing':
        return (
          <div className={styles.questionContent}>
            <p className={styles.questionPrompt}>Escribe el número: <strong>'veinte'</strong></p>
          </div>
        );
      
      default:
        return (
          <div className={styles.questionContent}>
            {currentQ.image && <img src={currentQ.image} alt="Ilustración" className={styles.questionImage} />}
            <p className={styles.questionPrompt}>{currentQ.question}</p>
          </div>
        );
    }
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
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className={styles.questionInfo}>
              <div className={styles.questionCounter}>
                Pregunta {currentQuestion + 1} de {questions.length}
              </div>
              <div className={styles.timer}>
                Tiempo: <span className={timeLeft && timeLeft < 10 ? styles.timerWarning : ''}>{timeLeft}</span>
              </div>
            </div>
            
            <div className={styles.questionCard}>
              {renderQuestion()}
              
              <div className={styles.optionsGrid}>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.optionButton} 
                      ${optionSelected === option ? styles.selected : ''} 
                      ${showFeedback && option === questions[currentQuestion].answer ? styles.correct : ''} 
                      ${showFeedback && optionSelected === option && option !== questions[currentQuestion].answer ? styles.incorrect : ''}`}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                  >
                    <span className={styles.optionContent}>
                      <span className={styles.optionText}>{option}</span>
                      {showFeedback && option === questions[currentQuestion].answer && (
                        <FaCheck className={styles.feedbackIcon} />
                      )}
                      {showFeedback && optionSelected === option && option !== questions[currentQuestion].answer && (
                        <FaTimes className={styles.feedbackIcon} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              
              {showFeedback && (
                <div className={`${styles.feedback} ${correctAnswer ? styles.correctFeedback : styles.incorrectFeedback}`}>
                  <p>
                    {correctAnswer 
                      ? "¡Correcto! 🎉" 
                      : `La respuesta correcta es: ${questions[currentQuestion].answer}`}
                  </p>
                  <p className={styles.explanation}>
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              )}
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
                    <span className={styles.scoreNumber}>{score}</span>
                    <span className={styles.scoreTotal}>/{questions.length}</span>
                  </div>
                  <div className={styles.starContainer}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${styles.star} ${index < Math.ceil((score / questions.length) * 5) ? styles.activeStar : ''}`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className={styles.scoreText}>
                  Has acertado <span className={styles.scoreHighlight}>{score}</span> de {questions.length} preguntas
                </p>
                
                <div className={styles.medalContainer}>
                  {score === questions.length && (
                    <div className={styles.medal}>
                      <FaTrophy className={styles.trophyIcon} />
                      <span>¡Medalla de Oro!</span>
                    </div>
                  )}
                  {score >= Math.floor(questions.length * 0.7) && score < questions.length && (
                    <div className={styles.medal}>
                      <FaStar className={styles.medalIcon} />
                      <span>¡Muy Bien!</span>
                    </div>
                  )}
                </div>
                
                <h3 className={styles.summaryTitle}>Repaso de preguntas</h3>
                <div className={styles.resultSummary}>
                  {questions.map((q, index) => (
                    <div key={index} className={`${styles.resultItem} ${
                      userAnswers[index] === q.answer 
                        ? styles.correctItem 
                        : styles.incorrectItem
                    }`}>
                      <div className={styles.resultQuestion}>
                        <span className={styles.questionNumber}>#{index + 1}</span>
                        <span className={styles.questionPreview}>{q.question}</span>
                      </div>
                      <div className={styles.resultAnswers}>
                        <div>
                          {userAnswers[index] === 'tiempo_agotado' ? (
                            <span className={styles.timeUp}>¡Tiempo agotado!</span>
                          ) : (
                            <>
                              <span className={styles.userAnswer}>
                                Tu respuesta: {userAnswers[index]}
                              </span>
                              {userAnswers[index] !== q.answer && (
                                <span className={styles.correctAnswerText}>
                                  Respuesta: {q.answer}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <span className={styles.resultIcon}>
                          {userAnswers[index] === q.answer ? (
                            <FaCheck className={styles.correctIcon} />
                          ) : (
                            <FaTimes className={styles.incorrectIcon} />
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
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