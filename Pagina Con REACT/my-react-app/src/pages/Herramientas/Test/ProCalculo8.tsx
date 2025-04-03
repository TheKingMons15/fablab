import React, { useState } from 'react';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import styles from './ProCalculo.module.css';

const ProCalculo8: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Preguntas para niños de 8 años
  const questions = [
    {
      question: "¿Cuál es el resultado de 6 × 7?",
      options: ["36", "40", "42", "48"],
      answer: "42"
    },
    {
      question: "¿Cuánto es 45 ÷ 5?",
      options: ["7", "8", "9", "10"],
      answer: "9"
    },
    {
      question: "Un libro tiene 124 páginas. Si Mario ya leyó 75 páginas, ¿cuántas le faltan por leer?",
      options: ["39", "49", "51", "59"],
      answer: "49"
    },
    {
      question: "¿Qué número falta en la secuencia: 2, 4, 8, 16, __?",
      options: ["18", "24", "32", "36"],
      answer: "32"
    },
    {
      question: "Pedro compró 3 juguetes que cuestan 15 euros cada uno. ¿Cuánto dinero gastó en total?",
      options: ["35", "40", "45", "50"],
      answer: "45"
    },
  ];

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setUserAnswers([...userAnswers, selectedAnswer]);
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  return (
    <main className={styles.testContainer}>
      <section className={styles.testHeader}>
        <h1 className={styles.testTitle}>
          <img src="/img/Medialab.png" alt="Logo de Media Lab" className={styles.logoSmall} />
          Pro-Cálculo - 8 años
        </h1>
        <a href="/test" className={styles.backButton}>
          <FaArrowLeft /> Volver
        </a>
      </section>

      {!showResult ? (
        <section className={styles.questionSection}>
          <div className={styles.questionCounter}>
            Pregunta {currentQuestion + 1} de {questions.length}
          </div>
          <div className={styles.questionCard}>
            <h2 className={styles.questionText}>{questions[currentQuestion].question}</h2>
            <div className={styles.optionsGrid}>
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={styles.optionButton}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.resultSection}>
          <h2 className={styles.resultTitle}>
            {score > (questions.length / 2) ? "¡Muy bien! 🎉" : "¡Sigue practicando! 💪"}
          </h2>
          <div className={styles.scoreCard}>
            <p className={styles.scoreText}>
              Has acertado <span className={styles.scoreHighlight}>{score}</span> de {questions.length} preguntas
            </p>
            <div className={styles.resultSummary}>
              {questions.map((q, index) => (
                <div key={index} className={styles.resultItem}>
                  <span>Pregunta {index + 1}: </span>
                  {userAnswers[index] === q.answer ? (
                    <span className={styles.correct}><FaCheck /> Correcto</span>
                  ) : (
                    <span className={styles.incorrect}>
                      <FaTimes /> Incorrecto (Respuesta correcta: {q.answer})
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button className={styles.restartButton} onClick={restartTest}>
              Intentar de nuevo
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProCalculo8;