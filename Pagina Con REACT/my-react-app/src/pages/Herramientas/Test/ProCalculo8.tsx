import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaStar, FaTrophy, FaRedo, FaMusic, FaVolumeMute } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';

const ProCalculo8: React.FC = () => {
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
  
  // Preguntas para niños de 8 años basadas en el test Pro-Cálculo
  const questions = [
    // 1. Multiplicación avanzada
    {
      type: "multiplication",
      question: "¿Cuál es el resultado de 6 × 7?",
      image: "/img/multiplication-8-years.png",
      answer: "42",
      options: ["36", "40", "42", "48"],
      explanation: "6 × 7 = 42 (6 veces 7 es 42)"
    },
    // 2. División básica
    {
      type: "division",
      question: "¿Cuánto es 45 ÷ 5?",
      image: "/img/division-8-years.png",
      answer: "9",
      options: ["7", "8", "9", "10"],
      explanation: "45 ÷ 5 = 9 (porque 5 × 9 = 45)"
    },
    // 3. Resta con llevadas
    {
      type: "subtraction",
      question: "Un libro tiene 124 páginas. Si Mario ya leyó 75 páginas, ¿cuántas le faltan por leer?",
      image: "/img/subtraction-8-years.png",
      answer: "49",
      options: ["39", "49", "51", "59"],
      explanation: "124 - 75 = 49 páginas por leer"
    },
    // 4. Secuencias numéricas (multiplicativas)
    {
      type: "number_sequence",
      question: "¿Qué número falta en la secuencia: 2, 4, 8, 16, __?",
      image: "/img/sequence-8-years.png",
      answer: "32",
      options: ["18", "24", "32", "36"],
      explanation: "La secuencia se multiplica por 2 cada vez: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
    },
    // 5. Problema verbal con multiplicación
    {
      type: "word_problem",
      question: "Pedro compró 3 juguetes que cuestan 15 euros cada uno. ¿Cuánto dinero gastó en total?",
      image: "/img/word-problem-8-years.png",
      answer: "45",
      options: ["35", "40", "45", "50"],
      explanation: "3 juguetes × 15€ cada uno = 45€ en total"
    },
    // 6. Fracciones básicas
    {
      type: "fractions",
      question: "¿Cuánto es 1/2 + 1/4?",
      image: "/img/fractions-8-years.png",
      answer: "3/4",
      options: ["1/6", "2/6", "3/4", "2/4"],
      explanation: "1/2 = 2/4, entonces 2/4 + 1/4 = 3/4"
    },
    // 7. Valor posicional avanzado
    {
      type: "place_value",
      question: "En el número 3,857, ¿qué valor tiene el dígito 5?",
      image: "/img/place-value-8-years.png",
      answer: "50",
      options: ["5", "50", "500", "5,000"],
      explanation: "El 5 está en la posición de las decenas: 3,857 = 3,000 + 800 + 50 + 7"
    },
    // 8. Problema verbal combinado
    {
      type: "mixed_operations",
      question: "Laura tiene 50€. Gasta 15€ en un libro y 8€ en un lápiz. ¿Cuánto dinero le queda?",
      image: "/img/mixed-ops-8-years.png",
      answer: "27",
      options: ["25", "27", "33", "35"],
      explanation: "50€ - 15€ - 8€ = 27€ le quedan"
    },
    // 9. Geometría básica
    {
      type: "geometry",
      question: "¿Cuántos vértices tiene un cubo?",
      image: "/img/cube-8-years.png",
      answer: "8",
      options: ["4", "6", "8", "12"],
      explanation: "Un cubo tiene 8 vértices (esquinas)"
    },
    // 10. Medidas y conversiones
    {
      type: "measurement",
      question: "¿Cuántos centímetros hay en 3 metros y medio?",
      image: "/img/measurement-8-years.png",
      answer: "350",
      options: ["35", "305", "350", "3,500"],
      explanation: "1 metro = 100 cm → 3.5 metros = 350 cm"
    }
  ];

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (currentQuestion >= 0 && !showResult && !showFeedback && timeLeft === null) {
      setTimeLeft(20); // 20 segundos por pregunta para 8 años
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
      setTimeLeft(20);
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
    setTimeLeft(20);
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
      case 'multiplication':
      case 'division':
        return (
          <div className={styles.questionContent}>
            {currentQ.image && <img src={currentQ.image} alt="Operación matemática" className={styles.mathImage} />}
            <p className={styles.questionPrompt}>{currentQ.question}</p>
          </div>
        );
      
      case 'subtraction':
      case 'mixed_operations':
        return (
          <div className={styles.questionContent}>
            <img src={currentQ.image} alt="Problema matemático" className={styles.wordProblemImage} />
            <p className={styles.questionPrompt}>{currentQ.question}</p>
          </div>
        );
      
      case 'number_sequence':
        return (
          <div className={styles.questionContent}>
            <img src={currentQ.image} alt="Secuencia numérica" className={styles.sequenceImage} />
            <p className={styles.questionPrompt}>{currentQ.question}</p>
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
        <div className={styles.mathBackground}></div>
        
        <section className={styles.testHeader}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.testTitle}>
              <img src="/img/Medialab.png" alt="Logo de Media Lab" className={styles.logoSmall} />
              Pro-Cálculo <span className={styles.ageBadge}>8 años</span>
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

export default ProCalculo8;