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
  
  // Preguntas para niños de 6 años
  const questions = [
    {
      question: "¿Cuánto es 3 + 4?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      image: "/img/question1.png", // Imágenes ilustrativas pueden mejorar la experiencia
      explanation: "Sumamos 3 manzanas y 4 manzanas para obtener 7 manzanas en total."
    },
    {
      question: "¿Cuánto es 10 - 3?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      image: "/img/question2.png",
      explanation: "Empezamos con 10 puntos y quitamos 3 puntos, nos quedan 7 puntos."
    },
    {
      question: "Si tienes 5 manzanas y te dan 2 más, ¿cuántas manzanas tienes en total?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      image: "/img/question3.png",
      explanation: "Tenemos 5 manzanas y sumamos 2 más: 5 + 2 = 7 manzanas."
    },
    {
      question: "¿Qué número falta: 2, 4, 6, __?",
      options: ["7", "8", "9", "10"],
      answer: "8",
      image: "/img/question4.png",
      explanation: "Esta es una secuencia donde sumamos 2 cada vez: 2 + 2 = 4, 4 + 2 = 6, 6 + 2 = 8"
    },
    {
      question: "¿Cuánto es 2 + 2 + 2?",
      options: ["4", "5", "6", "8"],
      answer: "6",
      image: "/img/question5.png",
      explanation: "Sumamos tres veces el número 2: 2 + 2 + 2 = 6"
    },
  ];

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (currentQuestion >= 0 && !showResult && !showFeedback && timeLeft === null) {
      setTimeLeft(30); // 30 segundos por pregunta
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

  // Efecto para limpiar al desmontar
  useEffect(() => {
    return () => {
      // Limpiar cualquier recurso o temporizador al salir
    };
  }, []);

  const handleTimeUp = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      setCorrectAnswer(false);
      playSound('wrong');
      
      // Avanzar a la siguiente pregunta después de 2 segundos
      setTimeout(() => {
        moveToNextQuestion(null);
      }, 2000);
    }
  };

  const playSound = (type: 'correct' | 'wrong' | 'complete') => {
    if (!soundEnabled) return;
    
    // Aquí implementarías la reproducción de sonidos
    // Por ejemplo usando la Howler.js library
    console.log(`Playing ${type} sound`);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (showFeedback) return; // Evitar múltiples clicks
    
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
    
    // Avanzar a la siguiente pregunta después de 2 segundos
    setTimeout(() => {
      moveToNextQuestion(selectedAnswer);
    }, 2000);
  };

  const moveToNextQuestion = (selectedAnswer: string | null) => {
    if (selectedAnswer !== null) {
      setUserAnswers([...userAnswers, selectedAnswer]);
    } else {
      // Si el tiempo se acabó
      setUserAnswers([...userAnswers, 'tiempo_agotado']);
    }
    
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(30); // Reiniciar temporizador
    } else {
      setShowResult(true);
      playSound('complete');
      
      // Lanzar confeti si la puntuación es buena
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

  return (
    <main className={styles.testContainer}>
      <div className={styles.cloudBackground}></div>
      
      <section className={styles.testHeader}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.testTitle}>
            <img src="/img/Medialab.png" alt="Logo de Media Lab" className={styles.logoSmall} />
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
            {questions[currentQuestion].image && (
              <div className={styles.questionImageContainer}>
                <img 
                  src={questions[currentQuestion].image} 
                  alt="Imagen ilustrativa" 
                  className={styles.questionImage}
                />
              </div>
            )}
            
            <h2 className={styles.questionText}>
              {questions[currentQuestion].question}
            </h2>
            
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
        </section>
      )}
    </main>
  );
};

export default ProCalculo6;