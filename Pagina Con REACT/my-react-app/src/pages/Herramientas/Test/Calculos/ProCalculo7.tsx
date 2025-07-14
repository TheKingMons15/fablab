import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock, FaUser, FaSchool, FaBirthdayCake, FaVenusMars, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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

const ProCalculo7: React.FC = () => {
  const navigate = useNavigate();
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(12).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [writtenAnswerConfirmed, setWrittenAnswerConfirmed] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameType, setMiniGameType] = useState<'egg' | 'snake'>('egg');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [studentData, setStudentData] = useState({
    nombres: '',
    apellidos: '',
    edad: '',
    genero: '',
    curso: '',
    institucion: ''
  });
  const [showStudentForm, setShowStudentForm] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState<number[]>([]);

  const minigameSubtests = [3, 6, 9];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!showStudentForm && timerActive && timeLeft > 0 && !showMiniGame) {
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
  }, [timeLeft, timerActive, showResult, timeUp, score, showStudentForm, showMiniGame]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const edadNum = parseInt(studentData.edad);

    if (!studentData.nombres.trim()) errors.nombres = 'Por favor ingresa los nombres';
    if (!studentData.apellidos.trim()) errors.apellidos = 'Por favor ingresa los apellidos';
    if (!studentData.edad || isNaN(edadNum)) errors.edad = 'Edad inválida';
    if (edadNum < 6 || edadNum > 8) errors.edad = 'La edad debe estar entre 6 y 8 años';
    if (!studentData.genero) errors.genero = 'Selecciona un género';
    if (!studentData.curso.trim()) errors.curso = 'Ingresa el curso/grado';
    if (!studentData.institucion.trim()) errors.institucion = 'Ingresa la institución';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveStudentData = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowStudentForm(false);
      setTimerActive(true);
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Ocurrió un error al guardar los datos. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          question: "¿Cuántos globos hay en la imagen?", 
          answer: "13", 
          points: 4,
          type: "escrito",
          image: '/img/13_globos.png'
        },
        { 
          question: "¿Cuántos paletas hay en la imagen?", 
          answer: "8", 
          points: 4,
          type: "escrito",
          image: '/img/8_paletas.png'
        },
        { 
          question: "¿Cuántos autos hay en la imagen?", 
          answer: "10", 
          points: 4,
          type: "escrito",
          image: '/img/10_carros.png'
        }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Escribe los números contando hacia atrás desde 15 hasta 0 (separados por comas)", 
          answer: "15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0", 
          points: 2,
          type: "escrito",
          image: '/img/Contar15_0.png'
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
          type: "escrito",
          image: '/img/Escritura de números_38.png'
        },
        { 
          question: "Escribe el número 'ciento sesenta y nueve'", 
          answer: "169", 
          points: 2,
          type: "escrito",
          image: '/img/Escritura de números_169.png'
        },
        { 
          question: "Escribe el número 'noventa y siete'", 
          answer: "97", 
          points: 2,
          type: "escrito",
          image: '/img/Escritura de números_97.png'
        },
        { 
          question: "Escribe el número 'mil doscientos'", 
          answer: "1200", 
          points: 2,
          type: "escrito",
          image: '/img/Escritura de números_1200.png'
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
          type: "escrito",
          image: '/img/Sumar10_10.jpg'
        },
        { 
          question: "1 + 15", 
          answer: "16", 
          points: 2,
          type: "escrito",
          image: '/img/Sumar1_15.jpg'
        },
        { 
          question: "12 + 7", 
          answer: "19", 
          points: 2,
          type: "escrito",
          image: '/img/Sumar12_7.png'
        },
        { 
          question: "10 - 3", 
          answer: "7", 
          points: 2,
          type: "escrito",
          image: '/img/Restar10_3.jpg'
        },
        { 
          question: "18 - 6", 
          answer: "12", 
          points: 2,
          type: "escrito",
          image: '/img/Restar18_6.jpg'
        },
        { 
          question: "25 - 12", 
          answer: "13", 
          points: 2,
          type: "escrito",
          image: '/img/Restar25_12.png.'
        }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 8,
      items: [
        { 
          question: "Lee y escribe con palabras minúsculas el número: 57", 
          answer: "cincuenta y siete", 
          points: 2,
          type: "escrito",
          image: '/img/Lectura de números cincuenta_siete.jpg'
        },
        { 
          question: "Lee y escribe con palabras minúsculas el número: 15", 
          answer: "quince", 
          points: 2,
          type: "escrito",
          image: '/img/Lectura de números quince.jpg'
        },
        { 
          question: "Lee y escribe con palabras minúsculas el número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "escrito",
          image: '/img/Lectura de números ciento_treinta_ocho.jpg'
        },
        { 
          question: "Lee y escribe con palabras minúsculas el número: 9", 
          answer: "nueve", 
          points: 2,
          type: "escrito",
          image: '/img/Lectura de números nueve.jpg'
        }
      ]
    },
    {
      name: "Posicionar en escala",
      maxScore: 6,
      items: [
        { 
          question: "¿Dónde colocarías el número 56 en una escala del 0 al 100? (elige 1, 2 o 3)", 
          answer: "2", 
          points: 2,
          type: "escrito",
          image: '/img/escala_56.png'
        },
        { 
          question: "¿Dónde colocarías el número 80 en una escala del 0 al 100? (elige 1, 2 o 3)", 
          answer: "3", 
          points: 2,
          type: "escrito",
          image: '/img/escala_80.png'
        },
        { 
          question: "¿Dónde colocarías el número 62 en una escala del 0 al 100? (elige 1, 2 o 3)", 
          answer: "2", 
          points: 2,
          type: "escrito",
          image: '/img/escala_62.png'
        },
        { 
          question: "¿Dónde colocarías el número 10 en una escala del 0 al 100?", 
          answer: "1", 
          points: 2,
          type: "escrito",
          image: '/img/escala_10.png'
        }
      ]
    },
    {
      name: "Estimación perceptiva",
      maxScore: 4,
      items: [
        { 
          question: "¿Cuántas pelotas y vasos hayen total? Escribe: número de pelotas y número de vasos totales", 
          answer: "16", 
          points: 4,
          type: "escrito",
          image: '/img/Estimación perceptiva_16.png'
        }
      ]
    },
    {
      name: "Estimación en contexto",
      maxScore: 6,
      items: [
        { 
          question: "¿12 nubes en el cielo es poco o mucho? (Escribe 'poco' o 'mucho')", 
          answer: "mucho", 
          points: 2,
          type: "escrito",
          image: '/img/12_nubes.png'
        },
        { 
          question: "¿2 niños jugando en el recreo es poco o mucho? (Escribe 'poco' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito",
          image: '/img/2_niños.png'
        },
        { 
          question: "¿60 niños en un cumpleaños es poco o mucho? (Escribe 'poco' o 'mucho')", 
          answer: "mucho", 
          points: 2,
          type: "escrito",
          image: '/img/60_cumpleaños.png'
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
          type: "escrito",
          image: '/img/Restar12_5.png'
        },
        { 
          question: "16 - 4", 
          answer: "12", 
          points: 2,
          type: "escrito",
          image: '/img/Restar16_4.png'
        },
        { 
          question: "6 + 7", 
          answer: "13", 
          points: 2,
          type: "escrito",
          image: '/img/Sumar6_7.png'
        },
        { 
          question: "4 + (4+3) + (7-2)", 
          answer: "16", 
          points: 2,
          type: "escrito",
          image: '/img/Sumar4_0.png'
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
          type: "escrito",
          image: '/img/comparacion_654.png'
        },
        { 
          question: "¿Cuál es mayor: 97 o 352? (Escribe el número mayor)", 
          answer: "352", 
          points: 2,
          type: "escrito",
          image: '/img/comparacion_97.png'
        },
        { 
          question: "¿Cuál es mayor: 96 o 69? (Escribe el número mayor)", 
          answer: "96", 
          points: 2,
          type: "escrito",
          image: '/img/comparacion_96.png'
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
          points: 6,
          type: "escrito",
          image: '/img/Determinacion_0.png'
        },
        { 
          question: "Escribe el número mayor en: 1234, 1993, 3000, 8520", 
          answer: "8520", 
          points: 6,
          type: "escrito",
          image: '/img/Determinacion_8520.png'
        }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 3,
      items: [
        { 
          question: "Escribe los 5 números que siguen después de 137 (separados por comas)", 
          answer: "138,139,140,141,142", 
          points: 1,
          type: "escrito",
          image: '/img/Escribir_en_cifra_137.png'
        },
        { 
          question: "Escribe los 5 números antes de 362 (separados por comas)", 
          answer: "361,360,359,358,357", 
          points: 1,
          type: "escrito",
          image: '/img/Escribir_en_cifra_362.2.png'
        },
        { 
          question: "Escribe los 5 números después de 362 (separados por comas)", 
          answer: "363,364,365,366,367", 
          points: 1,
          type: "escrito",
          image: '/img/Escribir_en_cifra_362.png'
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
      
      if (minigameSubtests.includes(currentSubtest)) {
        setShowMiniGame(true);
        setMiniGameType(currentSubtest === 3 || currentSubtest === 9 ? 'egg' : 'snake');
        return;
      }
      
      if (nextSubtest < subtests.length) {
        setCurrentSubtest(nextSubtest);
        setCurrentItem(0);
      } else {
        finishTest();
      }
    } else {
      setCurrentItem(currentItem + 1);
    }
  };

  const finishTest = () => {
    setShowResult(true);
    setTimerActive(false);
    const totalScore = score.reduce((a, b) => a + b, 0);
    if (totalScore > 50) {
      launchConfetti();
    }
  };

  const handleMiniGameComplete = (success: boolean) => {
    setShowMiniGame(false);
    setAnimation(success ? 'correct' : 'wrong');
    
    setTimeout(() => {
      setAnimation('');
      const nextSubtest = currentSubtest + 1;
      
      if (nextSubtest < subtests.length) {
        setCurrentSubtest(nextSubtest);
        setCurrentItem(0);
      } else {
        finishTest();
      }
    }, 1000);
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
    setShowFeedback(false);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    setShowMiniGame(false);
    setMiniGameType('egg');
    setTimeLeft(25 * 60);
    setTimerActive(false);
    setTimeUp(false);
    setShowStudentForm(true);
    setShowDetails([]);
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

  const handleConfirmAnswer = () => {
    if (writtenAnswer.trim()) {
      handleAnswer(writtenAnswer.trim());
      setWrittenAnswerConfirmed(false);
    }
  };

  const handleCancelAnswer = () => {
    setWrittenAnswerConfirmed(false);
  };

  const handleSubmitAnswer = () => {
    if (writtenAnswer.trim() && !showFeedback && !timeUp) {
      setWrittenAnswerConfirmed(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderStudentForm = () => (
    <div className={styles.studentFormContainer}>
      <div className={styles.studentFormCard}>
        <h2 className={styles.formTitle}>
          <FaUser /> Datos del Estudiante
        </h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="nombres">
            <FaUser /> Nombres:
          </label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            value={studentData.nombres}
            onChange={handleInputChange}
            className={formErrors.nombres ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {formErrors.nombres && <span className={styles.errorMessage}>{formErrors.nombres}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="apellidos">
            <FaUser /> Apellidos:
          </label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={studentData.apellidos}
            onChange={handleInputChange}
            className={formErrors.apellidos ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {formErrors.apellidos && <span className={styles.errorMessage}>{formErrors.apellidos}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="edad">
            <FaBirthdayCake /> Edad:
          </label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={studentData.edad}
            onChange={handleInputChange}
            min="6"
            max="8"
            className={formErrors.edad ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {formErrors.edad && <span className={styles.errorMessage}>{formErrors.edad}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="genero">
            <FaVenusMars /> Género:
          </label>
          <select
            id="genero"
            name="genero"
            value={studentData.genero}
            onChange={handleInputChange}
            className={formErrors.genero ? styles.inputError : ''}
            disabled={isSubmitting}
          >
            <option value="">Selecciona...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {formErrors.genero && <span className={styles.errorMessage}>{formErrors.genero}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="curso">
            <FaSchool /> Curso/Grado:
          </label>
          <input
            type="text"
            id="curso"
            name="curso"
            value={studentData.curso}
            onChange={handleInputChange}
            className={formErrors.curso ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {formErrors.curso && <span className={styles.errorMessage}>{formErrors.curso}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="institucion">
            <FaSchool /> Institución Educativa:
          </label>
          <input
            type="text"
            id="institucion"
            name="institucion"
            value={studentData.institucion}
            onChange={handleInputChange}
            className={formErrors.institucion ? styles.inputError : ''}
            disabled={isSubmitting}
          />
          {formErrors.institucion && <span className={styles.errorMessage}>{formErrors.institucion}</span>}
        </div>
        
        <div className={styles.formActions}>
          <button 
            className={styles.startTestButton}
            onClick={saveStudentData}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cargando...' : 'Comenzar Test'}
          </button>
        </div>
      </div>
    </div>
  );

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
              if (e.key === 'Enter' && writtenAnswer.trim() && !showFeedback) {
                handleSubmitAnswer();
              }
            }}
            disabled={timeUp || showFeedback}
          />
          <button 
            className={styles.submitButton}
            onClick={handleSubmitAnswer}
            disabled={!writtenAnswer.trim() || timeUp || showFeedback}
          >
            Enviar respuesta
          </button>
        </div>

        {writtenAnswerConfirmed && !showFeedback && (
          <div className={styles.confirmationButtons}>
            <p>Tu respuesta: <strong>"{writtenAnswer}"</strong></p>
            <p>¿Estás seguro de tu respuesta?</p>
            <div className={styles.confirmationButtonGroup}>
              <button 
                className={styles.confirmButton}
                onClick={handleConfirmAnswer}
                disabled={timeUp}
              >
                Sí, confirmar
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleCancelAnswer}
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
                : `La respuesta correcta es: ${currentQuestion.answer}`}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderMiniGame = () => (
    <div className={styles.miniGameContainer}>
      {miniGameType === 'egg' ? (
        <RompeCabezasHuevos onComplete={handleMiniGameComplete} />
      ) : (
        <SnakeGame onComplete={handleMiniGameComplete} />
      )}
    </div>
  );

  const renderResults = () => (
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
            <h3>Resultados por subtest:</h3>
            <ul className={styles.subtestList}>
              {subtests.map((subtest, index) => (
                <li key={index} className={styles.subtestItem}>
                  <div className={styles.subtestSummary}>
                    <span>{subtest.name}:</span>
                    <span>{score[index]} / {subtest.maxScore}</span>
                    <button
                      className={styles.toggleDetailsButton}
                      onClick={() => {
                        setShowDetails(prev =>
                          prev.includes(index)
                            ? prev.filter(i => i !== index)
                            : [...prev, index]
                        );
                      }}
                    >
                      {showDetails.includes(index) ? 'Ocultar detalles' : 'Mostrar detalles'}
                    </button>
                  </div>
                  {showDetails.includes(index) && (
                    <ul className={styles.detailsList}>
                      {subtest.items.map((item, itemIndex) => (
                        <li key={itemIndex} className={styles.questionResult}>
                          <strong>Pregunta:</strong> {item.question}<br />
                          <strong>Respuesta esperada:</strong> {item.answer}<br />
                          <strong>Puntos obtenidos:</strong> {score[index] >= item.points ? item.points : 0} / {item.points}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.actionsContainer}>
            <button className={styles.restartButton} onClick={restartTest}>
              <FaRedo /> Intentar de nuevo
            </button>
            <button 
              className={styles.homeButton} 
              onClick={() => navigate('/herramientas/test')}
            >
              Elegir otra prueba
            </button>
            <button
              className={styles.pdfButton}
              onClick={() => generatePDF()}
            >
              <FaFilePdf /> Generar PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const generatePDF = () => {
  const latexLines = [];

  // Encabezado del documento
  latexLines.push(
    `\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[spanish]{babel}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{amsmath}
\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{Informe de Resultados - Pro-Cálculo 7 años}
\\fancyhead[R]{Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota', hour12: true, hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}}
\\fancyfoot[C]{\\thepage}
\\begin{document}`
  );

  // Datos del estudiante
  latexLines.push(
    `\\section*{Datos del Estudiante}
\\begin{itemize}
  \\item Nombres: ${studentData.nombres}
  \\item Apellidos: ${studentData.apellidos}
  \\item Edad: ${studentData.edad} años
  \\item Género: ${studentData.genero === 'M' ? 'Masculino' : studentData.genero === 'F' ? 'Femenino' : 'No especificado'}
  \\item Curso/Grado: ${studentData.curso}
  \\item Institución Educativa: ${studentData.institucion}
\\end{itemize}`
  );

  // Resultados del test
  latexLines.push(
    `\\section*{Resultados del Test}
\\textbf{Puntuación Total:} ${score.reduce((a, b) => a + b, 0)} / 87 puntos\\\\

\\subsection*{Detalles por Subtest}
\\begin{longtable}{p{4cm} p{3cm} p{5cm}}
\\toprule
\\textbf{Subtest} & \\textbf{Puntuación} & \\textbf{Detalles} \\\\
\\midrule
\\endhead`
  );

  // Detalles por subtest
  subtests.forEach((subtest, index) => {
    latexLines.push(
      `${subtest.name} & ${score[index]} / ${subtest.maxScore} & \\begin{itemize}[leftmargin=*]`
    );
    subtest.items.forEach(item => {
      latexLines.push(
        `\\item Pregunta: ${item.question} \\\\ Respuesta esperada: ${item.answer} \\\\ Puntos obtenidos: ${score[index] >= item.points ? item.points : 0} / ${item.points}`
      );
    });
    latexLines.push(`\\end{itemize} \\\\ \\midrule`);
  });

  // Cierre del documento
  latexLines.push(
    `\\bottomrule
\\end{longtable}

\\end{document}`
  );

  // Unir todas las líneas en un solo string
  const latexContent = latexLines.join('\n');

  // Crear y descargar el archivo
  const blob = new Blob([latexContent], { type: 'text/x-tex' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ProCalculo7_Results_${studentData.nombres}_${studentData.apellidos}.tex`;
  link.click();
  URL.revokeObjectURL(url);
};
  const renderTestInProgress = () => (
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

      <section className={`${styles.questionSection} ${animation ? styles[animation] : ''}`}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ 
              width: `${((currentSubtest + currentItem / subtests[currentSubtest].items.length) / subtests.length) * 100}%` 
            }}
          ></div>
        </div>
        
        <div className={styles.questionInfo}>
          <div className={styles.questionCounter}>
            Subtest ${currentSubtest + 1} de ${subtests.length} - Ítem ${currentItem + 1} de ${subtests[currentSubtest].items.length}
          </div>
          <div className={styles.timer}>
            <FaClock /> Tiempo restante: ${formatTime(timeLeft)}
          </div>
        </div>
        
        <div className={styles.questionCard}>
          ${renderQuestion()}
        </div>
      </section>
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <main className={styles.testContainer}>
        <div className={styles.cloudBackground}></div>
        
        {showStudentForm ? (
          renderStudentForm()
        ) : showMiniGame ? (
          renderMiniGame()
        ) : showResult ? (
          renderResults()
        ) : (
          renderTestInProgress()
        )}
      </main>
    </div>
  );
};

export default ProCalculo7;