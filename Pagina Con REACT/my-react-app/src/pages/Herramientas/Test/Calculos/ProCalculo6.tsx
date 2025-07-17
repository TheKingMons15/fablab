import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock, FaUser, FaSchool, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import RompeCabezasHuevos from '../../Minijuego/RompeCabezasHuevos';
import SnakeGame from '../../Minijuego/SnakeGame';

interface QuestionItem {
  question: string;
  answer: string | number;
  points: number;
  type: 'escrito' | 'opciones';
  options?: string[];
  image?: string;
  isNumeric?: boolean;
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo6: React.FC = () => {
  const navigate = useNavigate();
  // Estados del test
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(9).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [writtenAnswerConfirmed, setWrittenAnswerConfirmed] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameType, setMiniGameType] = useState<'egg' | 'snake'>('egg');
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [testId, setTestId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState(false);

  // Estados del formulario
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

  // Array que define en qué subtests mostrar minijuegos
  const minigameSubtests = [3, 6];

  // Función para normalizar respuestas - MEJORADA
  const normalizeAnswer = (answer: string | number, isNumericQuestion: boolean = false): string | number => {
    if (typeof answer === 'number') return answer;
    
    // Manejar números escritos con comas como decimales
    const commaToDot = answer.toString().replace(',', '.');
    if (!isNaN(Number(commaToDot))) {
      const num = Number(commaToDot);
      return isNumericQuestion ? Math.round(num) : num;
    }
    
    // Convertir números escritos en texto a minúsculas sin acentos
    return answer.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Función para comparar respuestas - MEJORADA
  const compareAnswers = (userAnswer: string | number, correctAnswer: string | number, isNumericQuestion: boolean = false): boolean => {
    const normalizedUser = normalizeAnswer(userAnswer, isNumericQuestion);
    const normalizedCorrect = normalizeAnswer(correctAnswer, isNumericQuestion);
    
    // Comparación numérica con tolerancia para decimales
    if (typeof normalizedCorrect === 'number') {
      const userNum = typeof normalizedUser === 'number' 
        ? normalizedUser 
        : Number(normalizedUser);
      
      if (isNaN(userNum)) return false;
      
      // Para preguntas numéricas, comparación exacta sin tolerancia
      if (isNumericQuestion) {
        return userNum === normalizedCorrect;
      }
      
      // Tolerancia para números decimales en otras preguntas
      return Math.abs(userNum - normalizedCorrect) < 0.1;
    }
    
    // Comparación de texto exacta
    return normalizedUser.toString() === normalizedCorrect.toString();
  };

  // Efecto para el temporizador
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!showStudentForm && timerActive && timeLeft > 0 && !showMiniGame) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult && !timeUp) {
      setTimerActive(false);
      setTimeUp(true);
      finishTest();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, timerActive, showResult, timeUp, showStudentForm, showMiniGame]);

  // Función para calcular el puntaje total - MEJORADA con logs de diagnóstico
  const calculateTotalScore = (): number => {
    let total = 0;
    subtests.forEach((subtest, index) => {
      const subtestScore = Math.min(score[index], subtest.maxScore);
      console.log(`Subtest ${index} (${subtest.name}): ${score[index]} / ${subtest.maxScore}`);
      total += subtestScore;
    });
    console.log('Total calculado:', total);
    return total;
  };

  const finishTest = async () => {
    const totalScore = calculateTotalScore();
    setIsSubmitting(true);
    setSaveError(false);
    
    try {
      const edadNum = parseInt(studentData.edad) || 0;

      const testData = {
        nombres: studentData.nombres.trim(),
        apellidos: studentData.apellidos.trim(),
        edad: edadNum,
        genero: studentData.genero,
        curso: studentData.curso.trim(),
        institucion: studentData.institucion.trim(),
        test_tipo: "ProCálculo6",
        puntuacion_total: totalScore,
      };

      console.log('Enviando datos al servidor:', testData);

      const response = await fetch('https://fablab.upec.edu.ec/procalculo-api/guardar-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar los resultados');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      setTestId(result.id);
      setShowResult(true);
      
      if (totalScore > 30) {
        launchConfetti();
      }
    } catch (error) {
      console.error('Error al guardar resultados:', error);
      setSaveError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const edadNum = parseInt(studentData.edad);

    if (!studentData.nombres.trim()) errors.nombres = 'Por favor ingresa los nombres';
    if (!studentData.apellidos.trim()) errors.apellidos = 'Por favor ingresa los apellidos';
    if (!studentData.edad || isNaN(edadNum)) errors.edad = 'Edad inválida';
    if (edadNum < 5 || edadNum > 12) errors.edad = 'La edad debe estar entre 5 y 12 años';
    if (!studentData.genero) errors.genero = 'Selecciona un género';
    if (!studentData.curso.trim()) errors.curso = 'Ingresa el curso/grado';
    if (!studentData.institucion.trim()) errors.institucion = 'Ingresa la institución';
    
    setFormErrors(errors);
    
    if (!errors.edad) {
      setStudentData(prev => ({
        ...prev,
        edad: edadNum.toString()
      }));
    }
    
    return Object.keys(errors).length === 0;
  };

  const startTest = () => {
    if (!validateForm()) return;
    setShowStudentForm(false);
    setTimerActive(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const subtests: Subtest[] = [
    {
      name: "Enumeración",
      maxScore: 12,
      items: [
        { 
          question: "¿Cuántos animales hay en la imagen?", 
          answer: "5", 
          points: 4,
          type: "escrito",
          image: '/img/Test_6 Enumeración_5.png',
          isNumeric: true
        },
        { 
          question: "¿Cuántos animales hay en la imagen?", 
          answer: "8", 
          points: 4,
          type: "escrito",
          image: '/img/Test_6 Enumeración_8.png',
          isNumeric: true
        },
        { 
          question: "¿Cuántos animales hay en la imagen?", 
          answer: "10", 
          points: 4,
          type: "escrito",
          image: '/img/Test_6 Enumeración_10.png',
          isNumeric: true
        }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Escribe los números del 10 al 0 en orden descendente, separados por comas", 
          answer: "10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Contar para atrás.png'
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
          type: "escrito",
          image: '/img/Test_6 Escritura_7.png',
          isNumeric: true
        },
        { 
          question: "Escribe el número 'veinte'", 
          answer: "20", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Escritura_20.png',
          isNumeric: true
        },
        { 
          question: "Escribe el número 'trescientos cinco'", 
          answer: "305", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Escritura_305.png',
          isNumeric: true
        }
      ]
    },
    {
      name: "Cálculo mental oral",
      maxScore: 12,
      items: [
        { 
          question: "10 + 10", 
          answer: 20, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Calculo_20.png',
          isNumeric: true
        },
        { 
          question: "1 + 15", 
          answer: 16, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Calculo_16.png',
          isNumeric: true
        },
        { 
          question: "2 + 7", 
          answer: 9, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Calculo_9.png',
          isNumeric: true
        },
        { 
          question: "10 - 3", 
          answer: 7, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Calculo_7.png',
          isNumeric: true
        },
        { 
          question: "18 - 6", 
          answer: 12, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Calculo_12.png',
          isNumeric: true
        },
        { 
          question: "7 - 4", 
          answer: 3, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Calculo_3.png',
          isNumeric: true
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
          image: '/img/Test_6 Lectura_57.png'
        },
        { 
          question: "Lee y escribe con palabras minúsculas el número: 15", 
          answer: "quince", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Lectura_15.png'
        },
        { 
          question: "Lee y escribe con palabras minúsculas el número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Lectura_138.png'
        },
        { 
          question: "Lee y escribe con palabras minúsculas el número: 9", 
          answer: "nueve", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Lectura_9.png'
        }
      ]
    },
    {
      name: "Estimación",
      maxScore: 6,
      items: [
        { 
          question: "¿2 nubes en el cielo es poco o mucho?", 
          answer: "poco", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Estimación_nubes.png'
        },
        { 
          question: "¿2 niños jugando en el recreo es poco o mucho?", 
          answer: "poco", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Estimación_niños.png'
        },
        { 
          question: "¿60 chicos en un cumpleaños es poco o mucho?", 
          answer: "mucho", 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Estimación_cumpleaños.png'
        }
      ]
    },
    {
      name: "Resolución de problemas",
      maxScore: 4,
      items: [
        { 
          question: "Pedro tiene 8 bolitas rojas y 2 amarillas. ¿Cuántas bolitas tiene en total?", 
          answer: 10, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Resolución_10.png',
          isNumeric: true
        },
        { 
          question: "Pedro tiene 10 bolitas y pierde 5. ¿Cuántas bolitas le quedan?", 
          answer: 5, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Resolución_5.png',
          isNumeric: true
        }
      ]
    },
    {
      name: "Adaptación",
      maxScore: 8,
      items: [
        { 
          question: "¿Cuánto crees que cuesta una bicicleta?", 
          answer: 150, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Adaptación_150.png',
          isNumeric: true
        },
        { 
          question: "¿Cuánto crees que cuesta una radio?", 
          answer: 90, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Adaptación_90.png',
          isNumeric: true
        },
        { 
          question: "¿Cuánto crees que cuesta una pelota de cuero?", 
          answer: 50, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Adaptación_50.png',
          isNumeric: true
        },
        { 
          question: "¿Cuánto crees que cuesta una gaseosa?", 
          answer: 1.50, 
          points: 2,
          type: "escrito",
          image: '/img/Test_6 Adaptación_1.50.png',
          isNumeric: true
        }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 2,
      items: [
        { 
          question: "Escribe el número 'quince'", 
          answer: 15, 
          points: 1,
          type: "escrito",
          image: '/img/Test_6 Escribir_15.png',
          isNumeric: true
        },
        { 
          question: "Escribe el número 'veinticinco'", 
          answer: 25, 
          points: 1,
          type: "escrito",
          image: '/img/Test_6 Escribir_25.png',
          isNumeric: true
        }
      ]
    }
  ];

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback || timeUp) return;
    
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isNumericQuestion = currentQuestion.isNumeric || false;
    const isCorrect = compareAnswers(selectedAnswer, currentQuestion.answer, isNumericQuestion);
    
    setCorrectAnswer(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(prevScore => {
        const newScore = [...prevScore];
        newScore[currentSubtest] += currentQuestion.points;
        console.log(`Pregunta correcta! Puntos añadidos: ${currentQuestion.points}. Subtest ${currentSubtest} ahora tiene: ${newScore[currentSubtest]}`);
        return newScore;
      });
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
        setMiniGameType(currentSubtest === 3 ? 'egg' : 'snake');
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
    setScore(Array(9).fill(0));
    setShowResult(false);
    setShowFeedback(false);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    setShowMiniGame(false);
    setMiniGameType('egg');
    setTimeLeft(20 * 60);
    setTimerActive(false);
    setTimeUp(false);
    setShowStudentForm(true);
    setTestId(null);
    setSaveError(false);
  };

  const getResultMessage = () => {
    const totalScore = calculateTotalScore();
    const percentage = (totalScore / 60) * 100;
    
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
            min="5"
            max="12"
            className={formErrors.edad ? styles.inputError : ''}
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
          />
          {formErrors.institucion && <span className={styles.errorMessage}>{formErrors.institucion}</span>}
        </div>
        
        <div className={styles.formActions}>
          <button 
            className={styles.startTestButton}
            onClick={startTest}
          >
            Comenzar Test
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

  const renderResults = () => {
    const totalScore = calculateTotalScore();
    
    return (
      <section className={styles.resultSection}>
        <div className={styles.resultContainer}>
          <h2 className={styles.resultTitle}>
            {getResultMessage()}
          </h2>
          
          <div className={styles.scoreCard}>
            <div className={styles.scoreVisual}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreNumber}>{totalScore}</span>
                <span className={styles.scoreTotal}>/60</span>
              </div>
              {timeUp && (
                <div className={styles.timeUpWarning}>
                  ⏰ El tiempo ha terminado
                </div>
              )}
              {saveError && (
                <div className={styles.saveError}>
                  ⚠ Hubo un problema al guardar los resultados
                </div>
              )}
            </div>
            
            <p className={styles.scoreText}>
              Puntuación total: <span className={styles.scoreHighlight}>{totalScore}</span> de 60 puntos
              {testId && (
                <span className={styles.testId}>ID de prueba: {testId}</span>
              )}
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
              <button 
                className={styles.restartButton} 
                onClick={restartTest}
                disabled={isSubmitting}
              >
                <FaRedo /> {isSubmitting ? 'Guardando...' : 'Intentar de nuevo'}
              </button>
              <button 
                className={styles.homeButton} 
                onClick={() => navigate('/herramientas/test')}
              >
                Elegir otra prueba
              </button>
              {saveError && (
                <button 
                  className={styles.retryButton}
                  onClick={finishTest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Reintentar guardado'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderTestInProgress = () => (
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

export default ProCalculo6;