import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock, FaUser, FaSchool, FaBirthdayCake, FaVenusMars, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
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

interface AnswerHistory {
  subtestIndex: number;
  itemIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  pointsEarned: number;
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
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
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
  const [testStartTime, setTestStartTime] = useState<string>('');
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);

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

  useEffect(() => {
    if (!showStudentForm && timerActive) {
      const now = new Date();
      setTestStartTime(now.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Guayaquil' }));
    }
  }, [showStudentForm, timerActive]);

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

  const saveStudentData = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      setTimeout(() => {
        setShowStudentForm(false);
        setTimerActive(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Ocurrió un error al guardar los datos. Por favor intenta nuevamente.');
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
        { question: "¿Cuántos globos hay en la imagen?", answer: "13", points: 4, type: "escrito", image: '/img/Test_7 Enumeración_13.png' },
        { question: "¿Cuántos paletas hay en la imagen?", answer: "8", points: 4, type: "escrito", image: '/img/Test_7 Enumeración_8.png' },
        { question: "¿Cuántos autos hay en la imagen?", answer: "10", points: 4, type: "escrito", image: '/img/Test_7 Enumeración_10.png' }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { question: "Escribe los números contando hacia atrás desde 15 hasta 0 (separados por comas)", answer: "15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0", points: 2, type: "escrito", image: '/img/Test_7 Contar para atrás_15.png' }
      ]
    },
    {
      name: "Escritura de números",
      maxScore: 8,
      items: [
        { question: "Escribe el número 'treinta y ocho'", answer: "38", points: 2, type: "escrito", image: '/img/Test_7 Escritura_38.png' },
        { question: "Escribe el número 'ciento sesenta y nueve'", answer: "169", points: 2, type: "escrito", image: '/img/Test_7 Escritura_169.png' },
        { question: "Escribe el número 'noventa y siete'", answer: "97", points: 2, type: "escrito", image: '/img/Test_7 Escritura_97.png' },
        { question: "Escribe el número 'mil doscientos'", answer: "1200", points: 2, type: "escrito", image: '/img/Test_7 Escritura_1200.png' }
      ]
    },
    {
      name: "Cálculo mental oral",
      maxScore: 12,
      items: [
        { question: "10 + 10", answer: "20", points: 2, type: "escrito", image: '/img/Test_7 Cálculo_20.png' },
        { question: "1 + 15", answer: "16", points: 2, type: "escrito", image: '/img/Test_7 Cálculo_16.png' },
        { question: "12 + 7", answer: "19", points: 2, type: "escrito", image: '/img/Test_7 Cálculo_19.png' },
        { question: "10 - 3", answer: "7", points: 2, type: "escrito", image: '/img/Test_7 Cálculo_7.png' },
        { question: "18 - 6", answer: "12", points: 2, type: "escrito", image: '/img/Test_7 Cálculo_12.png' },
        { question: "25 - 12", answer: "13", points: 2, type: "escrito", image: '/img/Test_7 Cálculo_13.png' }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 8,
      items: [
        { question: "Lee y escribe con palabras minúsculas el número: 57", answer: "cincuenta y siete", points: 2, type: "escrito", image: '/img/Test_7 Lectura_57.png' },
        { question: "Lee y escribe con palabras minúsculas el número: 15", answer: "quince", points: 2, type: "escrito", image: '/img/Test_7 Lectura_15.png' },
        { question: "Lee y escribe con palabras minúsculas el número: 138", answer: "ciento treinta y ocho", points: 2, type: "escrito", image: '/img/Test_7 Lectura_138.png' },
        { question: "Lee y escribe con palabras minúsculas el número: 9", answer: "nueve", points: 2, type: "escrito", image: '/img/Test_7 Lectura_9.png' }
      ]
    },
    {
      name: "Posicionar en escala",
      maxScore: 6,
      items: [
        { question: "¿Dónde colocarías el número 56 en una escala del 0 al 100? (elige 1, 2 o 3)", answer: "2", points: 2, type: "escrito", image: '/img/Test_7 Escala_56.png' },
        { question: "¿Dónde colocarías el número 80 en una escala del 0 al 100? (elige 1, 2 o 3)", answer: "3", points: 2, type: "escrito", image: '/img/Test_7 Escala_80.png' },
        { question: "¿Dónde colocarías el número 62 en una escala del 0 al 100? (elige 1, 2 o 3)", answer: "2", points: 2, type: "escrito", image: '/img/Test_7 Escala_62.png' },
        { question: "¿Dónde colocarías el número 10 en una escala del 0 al 100? (elige 1, 2 o 3)", answer: "1", points: 2, type: "escrito", image: '/img/Test_7 Escala_10.png' }
      ]
    },
    {
      name: "Estimación perceptiva",
      maxScore: 4,
      items: [
        { question: "¿Cuántas pelotas y vasos hay en total? Escribe: número de pelotas y número de vasos totales", answer: "16", points: 4, type: "escrito", image: '/img/Test_7 Estimación_16.png' }
      ]
    },
    {
      name: "Estimación en contexto",
      maxScore: 6,
      items: [
        { question: "¿12 nubes en el cielo es poco o mucho? (Escribe 'poco' o 'mucho')", answer: "mucho", points: 2, type: "escrito", image: '/img/Test_7 Estimación_12.png' },
        { question: "¿2 niños jugando en el recreo es poco o mucho? (Escribe 'poco' o 'mucho')", answer: "poco", points: 2, type: "escrito", image: '/img/Test_7 Estimación_2.png' },
        { question: "¿60 niños en un cumpleaños es poco o mucho? (Escribe 'poco' o 'mucho')", answer: "mucho", points: 2, type: "escrito", image: '/img/Test_7 Estimación_60.png' }
      ]
    },
    {
      name: "Resolución de problemas",
      maxScore: 8,
      items: [
        { question: "12 - 5", answer: "7", points: 2, type: "escrito", image: '/img/Test_7 Resolución_7.png' },
        { question: "16 - 4", answer: "12", points: 2, type: "escrito", image: '/img/Test_7 Resolución_12.png' },
        { question: "6 + 7", answer: "13", points: 2, type: "escrito", image: '/img/Test_7 Resolución_13.png' },
        { question: "4 + (4+3) + (7-2)", answer: "16", points: 2, type: "escrito", image: '/img/Test_7 Resolución_16.png' }
      ]
    },
    {
      name: "Comparación de números",
      maxScore: 6,
      items: [
        { question: "¿Cuál es mayor: 654 o 546? (Escribe el número mayor)", answer: "654", points: 2, type: "escrito", image: '/img/Test_7 Comparación_654.png' },
        { question: "¿Cuál es mayor: 97 o 352? (Escribe el número mayor)", answer: "352", points: 2, type: "escrito", image: '/img/Test_7 Comparación_352.png' },
        { question: "¿Cuál es mayor: 96 o 69? (Escribe el número mayor)", answer: "96", points: 2, type: "escrito", image: '/img/Test_7 Comparación_96.png' }
      ]
    },
    {
      name: "Determinación de cantidad",
      maxScore: 12,
      items: [
        { question: "Escribe el número menor en: 5, 8520, 0, 12, 49, 50, 97", answer: "0", points: 6, type: "escrito", image: '/img/Test_7 Determinación_0.png' },
        { question: "Escribe el número mayor en: 1234, 1993, 3000, 8520", answer: "8520", points: 6, type: "escrito", image: '/img/Test_7 Determinación_8520.png' }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 3,
      items: [
        { question: "Escribe los 5 números que siguen después de 137 (separados por comas)", answer: "138,139,140,141,142", points: 1, type: "escrito", image: '/img/Test_7 Escribir_137D.png' },
        { question: "Escribe los 5 números antes de 362 (separados por comas)", answer: "361,360,359,358,357", points: 1, type: "escrito", image: '/img/Test_7 Escribir_362A.png' },
        { question: "Escribe los 5 números después de 362 (separados por comas)", answer: "363,364,365,366,367", points: 1, type: "escrito", image: '/img/Test_7 Escribir_362D.png' }
      ]
    }
  ];

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback || timeUp) return;
    
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isCorrect = normalizeText(selectedAnswer.toString()) === normalizeText(currentQuestion.answer.toString());
    const pointsEarned = isCorrect ? currentQuestion.points : 0;

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
    
    setAnswerHistory(prev => [
      ...prev,
      {
        subtestIndex: currentSubtest,
        itemIndex: currentItem,
        question: currentQuestion.question,
        userAnswer: selectedAnswer.toString(),
        correctAnswer: currentQuestion.answer.toString(),
        pointsEarned
      }
    ]);
    
    setTimeout(() => {
      moveToNextItem();
    }, 2000);
  };

  const moveToNextItem = () => {
    setShowFeedback(false);
    setCorrectAnswer(null);
    setAnimation('');
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
    setWrittenAnswers({});
    setWrittenAnswerConfirmed(false);
    setShowMiniGame(false);
    setMiniGameType('egg');
    setTimeLeft(25 * 60);
    setTimerActive(false);
    setTimeUp(false);
    setShowStudentForm(true);
    setTestStartTime('');
    setAnswerHistory([]);
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
    if (writtenAnswers[`${currentSubtest}-${currentItem}`]) {
      handleAnswer(writtenAnswers[`${currentSubtest}-${currentItem}`]);
      setWrittenAnswerConfirmed(false);
    }
  };

  const handleCancelAnswer = () => {
    setWrittenAnswerConfirmed(false);
  };

  const handleSubmitAnswer = () => {
    if (writtenAnswers[`${currentSubtest}-${currentItem}`] && !showFeedback && !timeUp) {
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

  const generatePDF = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const content = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20mm;
            width: 100%;
            box-sizing: border-box;
            word-break: break-word;
            overflow-wrap: break-word;
            text-align: center;
          }
          h1 { margin: 10mm 0; }
          h2 { margin: 5mm 0; border-bottom: 1px solid #000; padding-bottom: 5mm; }
          p { margin: 2mm 0; }
          strong { margin-right: 10mm; }
          .section-break {
            page-break-before: always;
            margin-top: 20mm;
          }
          .answer-section { margin-left: 20mm; text-align: left; }
          .content-wrapper { width: 100%; max-width: 210mm; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="content-wrapper">
          <h1>RESULTADO DEL TEST – 7</h1>
          <h2>Datos del estudiante</h2>
          <p><strong>Nombre:</strong> ${studentData.nombres}</p>
          <p><strong>Apellido:</strong> ${studentData.apellidos}</p>
          <p><strong>Edad:</strong> ${studentData.edad}</p>
          <p><strong>Genero:</strong> ${studentData.genero === 'M' ? 'Masculino' : studentData.genero === 'F' ? 'Femenino' : ''}</p>
          <p><strong>Curso/Grado:</strong> ${studentData.curso}</p>
          <p><strong>Institución:</strong> ${studentData.institucion}</p>
          <p><strong>Fecha y hora:</strong> ${testStartTime}</p>
          <h2>PUNTUACIÓN TOTAL: ${totalScore}/87 Puntos</h2>
          <h2>Detalles del Test:</h2>
          ${subtests.map((subtest, subtestIndex) => `
            <div class="${subtestIndex > 0 ? 'section-break' : ''}">
              <h2>${subtest.name}: ${score[subtestIndex]} / ${subtest.maxScore}</h2>
              ${answerHistory
                .filter(a => a.subtestIndex === subtestIndex)
                .map(a => `
                  <div class="answer-section">
                    <p><strong>Pregunta:</strong> ${a.question}</p>
                    <p><strong>Respuesta esperada:</strong> ${a.correctAnswer}</p>
                    <p><strong>Respuesta proporcionada:</strong> ${a.userAnswer || 'No proporcionada'}</p>
                    <p><strong>Puntos obtenidos:</strong> ${a.pointsEarned} / ${subtests[a.subtestIndex].items[a.itemIndex].points}</p>
                  </div>
                `).join('')}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    const pdfOptions = {
      margin: [20, 20, 20, 20],
      filename: `Resultado_Test_7_${studentData.nombres}_${studentData.apellidos}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(pdfOptions).from(content).save();
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
    const answerKey = `${currentSubtest}-${currentItem}`;
    
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
            value={writtenAnswers[answerKey] || ''}
            onChange={(e) => {
              setWrittenAnswers(prev => ({ ...prev, [answerKey]: e.target.value }));
              setWrittenAnswerConfirmed(false);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && writtenAnswers[answerKey] && !showFeedback) {
                handleSubmitAnswer();
              }
            }}
            disabled={timeUp || showFeedback}
          />
          <button 
            className={styles.submitButton}
            onClick={handleSubmitAnswer}
            disabled={!writtenAnswers[answerKey] || timeUp || showFeedback}
          >
            Enviar respuesta
          </button>
        </div>

        {writtenAnswerConfirmed && !showFeedback && (
          <div className={styles.confirmationButtons}>
            <p>Tu respuesta: <strong>"{writtenAnswers[answerKey]}"</strong></p>
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
            <h3>Puntuación por subtest:</h3>
            <ul>
              {subtests.map((subtest, idx) => (
                <li key={idx}>
                  {subtest.name}: {score[idx]} / {subtest.maxScore}
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
              className={styles.restartButton}
              onClick={generatePDF}
            >
              <FaDownload /> Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );

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
        
        ${showStudentForm ? (
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