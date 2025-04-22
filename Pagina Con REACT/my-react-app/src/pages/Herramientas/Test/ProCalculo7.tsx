import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaStar, FaTrophy, FaRedo, FaMusic, FaVolumeMute } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';

const ProCalculo7: React.FC = () => {
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
  
  // Preguntas para niños de 7 años basadas en el test Pro-Cálculo
  const questions = [
    // 1. Cálculo mental suma
    {
      type: "sum",
      question: "¿Cuánto es 8 + 7?",
      image: "/img/sum-7-years.png",
      answer: "15",
      options: ["13", "14", "15", "16"],
      explanation: "Sumamos 8 + 7 = 15"
    },
    // 2. Cálculo mental resta
    {
      type: "subtraction",
      question: "¿Cuánto es 20 - 8?",
      image: "/img/substract-7-years.png",
      answer: "12",
      options: ["10", "11", "12", "13"],
      explanation: "Restamos 20 - 8 = 12"
    },
    // 3. Multiplicación básica
    {
      type: "multiplication",
      question: "Si tienes 3 cajas con 4 juguetes cada una, ¿cuántos juguetes tienes en total?",
      image: "/img/multiplication-7-years.png",
      answer: "12",
      options: ["7", "9", "11", "12"],
      explanation: "Multiplicamos 3 cajas × 4 juguetes = 12 juguetes en total"
    },
    // 4. Secuencias numéricas
    {
      type: "number_sequence",
      question: "¿Qué número falta: 5, 10, 15, __?",
      image: "/img/sequence-7-years.png",
      answer: "20",
      options: ["18", "19", "20", "25"],
      explanation: "Esta secuencia suma 5 cada vez: 5 + 5 = 10, 10 + 5 = 15, 15 + 5 = 20"
    },
    // 5. División básica
    {
      type: "division",
      question: "María tiene 24 caramelos y le da la mitad a su hermano. ¿Cuántos caramelos le quedan?",
      image: "/img/division-7-years.png",
      answer: "12",
      options: ["10", "12", "14", "16"],
      explanation: "La mitad de 24 es 24 ÷ 2 = 12 caramelos"
    },
    // 6. Problema verbal combinado
    {
      type: "word_problem",
      question: "Luis compró 2 lápices a $5 cada uno y 1 cuaderno a $8. ¿Cuánto gastó en total?",
      image: "/img/word-problem-7-years.png",
      answer: "18",
      options: ["15", "16", "17", "18"],
      explanation: "2 lápices × $5 = $10 + $8 del cuaderno = $18 en total"
    },
    // 7. Reconocimiento de formas geométricas
    {
      type: "geometry",
      question: "¿Cuántos lados tiene un hexágono?",
      image: "/img/hexagon-7-years.png",
      answer: "6",
      options: ["4", "5", "6", "8"],
      explanation: "Un hexágono tiene 6 lados (hexa = 6)"
    },
    // 8. Comparación de cantidades
    {
      type: "quantity_comparison",
      question: "¿Qué número es mayor: 35 o 53?",
      image: "/img/number-comparison-7-years.png",
      answer: "53",
      options: ["35", "53", "Son iguales", "No se puede saber"],
      explanation: "53 es mayor que 35 porque tiene más decenas"
    },
    // 9. Valor posicional
    {
      type: "place_value",
      question: "En el número 47, ¿qué valor tiene el dígito 4?",
      image: "/img/place-value-7-years.png",
      answer: "40",
      options: ["4", "40", "400", "7"],
      explanation: "En 47, el 4 está en la posición de las decenas, por lo que vale 40"
    },
    // 10. Fracciones básicas
    {
      type: "fractions",
      question: "Si una pizza se divide en 8 partes iguales y comes 3, ¿qué fracción de la pizza comiste?",
      image: "/img/fractions-7-years.png",
      answer: "3/8",
      options: ["1/8", "3/8", "5/8", "8/3"],
      explanation: "Comiste 3 de las 8 partes, es decir, 3/8 de la pizza"
    }
  ];

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (currentQuestion >= 0 && !showResult && !showFeedback && timeLeft === null) {
      setTimeLeft(25); // 25 segundos por pregunta para 7 años
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
      setTimeLeft(25);
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
    setTimeLeft(25);
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
      case 'sum':
      case 'subtraction':
      case 'multiplication':
      case 'division':
        return (
          <div className={styles.questionContent}>
            {currentQ.image && <img src={currentQ.image} alt="Ilustración matemática" className={styles.mathImage} />}
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
      
      case 'word_problem':
        return (
          <div className={styles.questionContent}>
            <img src={currentQ.image} alt="Problema verbal" className={styles.wordProblemImage} />
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
        <div className={styles.planetBackground}></div>
        
        <section className={styles.testHeader}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.testTitle}>
              <img src="/img/Medialab.png" alt="Logo de Media Lab" className={styles.logoSmall} />
              Pro-Cálculo <span className={styles.ageBadge}>7 años</span>
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

export default ProCalculo7;