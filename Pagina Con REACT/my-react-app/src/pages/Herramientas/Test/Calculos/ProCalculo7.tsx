import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock, FaUser, FaSchool, FaBirthdayCake, FaVenusMars, FaPlay, FaFlagCheckered } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import RompeCabezasHuevos from '../../Minijuego/RompeCabezasHuevos';
import SnakeGame from '../../Minijuego/SnakeGame';
import jsPDF from 'jspdf';

interface QuestionItem {
  question: string;
  answer: string | number;
  providedAnswer?: string | number;
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

const ProCalculo7: React.FC = () => {
  const navigate = useNavigate();
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
  const [testStartTime, setTestStartTime] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false);

  const [subtests, setSubtests] = useState<Subtest[]>([
    {
      name: "Enumeración",
      maxScore: 12,
      items: [
        { question: "¿Cuántos animales hay en la imagen?", answer: 5, points: 4, type: "escrito", image: "/img/Test_6 Enumeración_5.png"},
        { question: "¿Cuántos animales hay en la imagen?", answer: 8, points: 4, type: "escrito", image: "/img/Test_6 Enumeración_8.png", isNumeric: true },
        { question: "¿Cuántos animales hay en la imagen?", answer: 10, points: 4, type: "escrito", image: "/img/Test_6 Enumeración_10.png", isNumeric: true }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { question: "Escribe los números del 10 al 0 en orden descendente, separados por comas y sin espacios", answer: "10,9,8,7,6,5,4,3,2,1,0", points: 2, type: "escrito", image: "/img/Test_6 Contar para atrás.png" }
      ]
    },
    {
      name: "Escritura de números",
      maxScore: 6,
      items: [
        { question: "Escribe el número 'siete'", answer: 7, points: 2, type: "escrito", image: "/img/Test_6 Escritura_7.png", isNumeric: true },
        { question: "Escribe el número 'veinte'", answer: 20, points: 2, type: "escrito", image: "/img/Test_6 Escritura_20.png", isNumeric: true },
        { question: "Escribe el número 'trescientos cinco'", answer: 305, points: 2, type: "escrito", image: "/img/Test_6 Escritura_305.png", isNumeric: true }
      ]
    },
    {
      name: "Cálculo mental oral",
      maxScore: 12,
      items: [
        { question: "10 + 10", answer: 20, points: 2, type: "escrito", image: "/img/Test_6 Calculo_20.png", isNumeric: true },
        { question: "1 + 15", answer: 16, points: 2, type: "escrito", image: "/img/Test_6 Calculo_16.png", isNumeric: true },
        { question: "2 + 7", answer: 9, points: 2, type: "escrito", image: "/img/Test_6 Calculo_9.png", isNumeric: true },
        { question: "10 - 3", answer: 7, points: 2, type: "escrito", image: "/img/Test_6 Calculo_7.png", isNumeric: true },
        { question: "18 - 6", answer: 12, points: 2, type: "escrito", image: "/img/Test_6 Calculo_12.png", isNumeric: true },
        { question: "7 - 4", answer: 3, points: 2, type: "escrito", image: "/img/Test_6 Calculo_3.png", isNumeric: true }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 8,
      items: [
        { question: "Lee y escribe con palabras minúsculas el número: 57", answer: "cincuenta y siete", points: 2, type: "escrito", image: "/img/Test_6 Lectura_57.png" },
        { question: "Lee y escribe con palabras minúsculas el número: 15", answer: "quince", points: 2, type: "escrito", image: "/img/Test_6 Lectura_15.png" },
        { question: "Lee y escribe con palabras minúsculas el número: 138", answer: "ciento treinta y ocho", points: 2, type: "escrito", image: "/img/Test_6 Lectura_138.png" },
        { question: "Lee y escribe con palabras minúsculas el número: 9", answer: "nueve", points: 2, type: "escrito", image: "/img/Test_6 Lectura_9.png" }
      ]
    },
    {
      name: "Estimación",
      maxScore: 6,
      items: [
        { question: "¿2 nubes en el cielo es poco o mucho?", answer: "poco", points: 2, type: "escrito", image: "/img/Test_6 Estimación_nubes.png" },
        { question: "¿2 niños jugando en el recreo es poco o mucho?", answer: "poco", points: 2, type: "escrito", image: "/img/Test_6 Estimación_niños.png" },
        { question: "¿60 chicos en un cumpleaños es poco o mucho?", answer: "mucho", points: 2, type: "escrito", image: "/img/Test_6 Estimación_cumpleaños.png" }
      ]
    },
    {
      name: "Resolución de problemas",
      maxScore: 4,
      items: [
        { question: "Pedro tiene 8 bolitas rojas y 2 amarillas. ¿Cuántas bolitas tiene en total?", answer: 10, points: 2, type: "escrito", image: "/img/Test_6 Resolución_10.png", isNumeric: true },
        { question: "Pedro tiene 10 bolitas y pierde 5. ¿Cuántas bolitas le quedan?", answer: 5, points: 2, type: "escrito", image: "/img/Test_6 Resolución_5.png", isNumeric: true }
      ]
    },
    {
      name: "Adaptación",
      maxScore: 8,
      items: [
        { question: "¿Cuánto crees que cuesta una bicicleta?", answer: 150, points: 2, type: "escrito", image: "/img/Test_6 Adaptación_150.png", isNumeric: true },
        { question: "¿Cuánto crees que cuesta una radio?", answer: 90, points: 2, type: "escrito", image: "/img/Test_6 Adaptación_90.png", isNumeric: true },
        { question: "¿Cuánto crees que cuesta una pelota de cuero?", answer: 50, points: 2, type: "escrito", image: "/img/Test_6 Adaptación_50.png", isNumeric: true },
        { question: "¿Cuánto crees que cuesta una gaseosa?", answer: 1.5, points: 2, type: "escrito", image: "/img/Test_6 Adaptación_1.50.png", isNumeric: true }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 2,
      items: [
        { question: "Escribe el número 'quince'", answer: 15, points: 1, type: "escrito", image: "/img/Test_6 Escribir_15.png", isNumeric: true },
        { question: "Escribe el número 'veinticinco'", answer: 25, points: 1, type: "escrito", image: "/img/Test_6 Escribir_25.png", isNumeric: true }
      ]
    }
  ]);

  const minigameSubtests = [3, 6];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timerActive && timeLeft > 0 && !showMiniGame && !showFinishScreen) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult && !timeUp) {
      setTimerActive(false);
      setTimeUp(true);
      setShowFinishScreen(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, timerActive, showResult, timeUp, showMiniGame, showFinishScreen, testStarted]);

  useEffect(() => {
    if (testStarted && timerActive) {
      const now = new Date();
      setTestStartTime(now.toLocaleString('es-ES', { 
        dateStyle: 'long', 
        timeStyle: 'short', 
        timeZone: 'America/Guayaquil' 
      }));
    }
  }, [testStarted, timerActive]);

  const normalizeAnswer = (answer: string | number, isNumericQuestion: boolean = false): string | number => {
    if (typeof answer === 'number') return answer;
    
    const commaToDot = answer.toString().replace(',', '.');
    if (!isNaN(Number(commaToDot))) {
      const num = Number(commaToDot);
      return isNumericQuestion ? num : num;
    }
    return answer.toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const compareAnswers = (userAnswer: string | number, correctAnswer: string | number, isNumericQuestion: boolean = false): boolean => {
    console.log('Comparando respuestas:', {
      userAnswer,
      correctAnswer,
      isNumericQuestion
    });

    const normalizedUser = normalizeAnswer(userAnswer, isNumericQuestion);
    const normalizedCorrect = normalizeAnswer(correctAnswer, isNumericQuestion);

    if (typeof normalizedCorrect === 'number') {
      const userNum = typeof normalizedUser === 'number' 
        ? normalizedUser 
        : Number(normalizedUser);
      
      if (isNaN(userNum)) return false;
      
      if (isNumericQuestion) {
        return userNum === normalizedCorrect;
      }
      return Math.abs(userNum - normalizedCorrect) < 0.1;
    }
    
    return normalizedUser.toString() === normalizedCorrect.toString();
  };

  const calculateTotalScore = (): number => {
    let total = 0;
    subtests.forEach((subtest, index) => {
      const subtestScore = Math.min(score[index], subtest.maxScore);
      console.log(Subtest ${index} (${subtest.name}): ${subtestScore} / ${subtest.maxScore});
      total += subtestScore;
    });
    console.log('Total calculado:', total);
    return total;
  };

  const finishTest = async () => {
    const totalScore = calculateTotalScore();
    setIsSubmitting(true);
    setSaveError(false);
    
    console.log('Verificación Subtest 9 - Escribir en cifra:', {
      respuestas: subtests[8].items.map(item => item.providedAnswer),
      puntuacion: score[8],
      maxScore: subtests[8].maxScore
    });

    try {
      const edadNum = parseInt(studentData.edad) || 0;
      const testData = {
        nombres: studentData.nombres.trim(),
        apellidos: studentData.apellidos.trim(),
        edad: edadNum,
        genero: studentData.genero,
        curso: studentData.curso.trim(),
        institucion: studentData.institucion.trim(),
        test_tipo: "ProCálculo7",
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

  const saveStudentData = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowStudentForm(false);
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Ocurrió un error al guardar los datos. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setTimerActive(true);
    const now = new Date();
    setTestStartTime(now.toLocaleString('es-ES', { 
      dateStyle: 'long', 
      timeStyle: 'short', 
      timeZone: 'America/Guayaquil' 
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')};
  };

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback || timeUp) return;
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isNumericQuestion = currentQuestion.isNumeric || false;
    const isCorrect = compareAnswers(selectedAnswer, currentQuestion.answer, isNumericQuestion);

    console.log('Respuesta evaluada:', {
      selectedAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      isNumericQuestion
    });

    setSubtests(prevSubtests => {
      const newSubtests = [...prevSubtests];
      newSubtests[currentSubtest].items[currentItem] = {
        ...newSubtests[currentSubtest].items[currentItem],
        providedAnswer: selectedAnswer
      };
      return newSubtests;
    });

    setCorrectAnswer(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(prevScore => {
        const newScore = [...prevScore];
        newScore[currentSubtest] += currentQuestion.points;
        console.log(Pregunta correcta! Puntos añadidos: ${currentQuestion.points}. Subtest ${currentSubtest} ahora tiene: ${newScore[currentSubtest]});
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
        setShowFinishScreen(true);
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
        setShowFinishScreen(true);
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
    setTestStartTime('');
    setTestStarted(false);
    setShowFinishScreen(false);
    setSubtests(prevSubtests =>
      prevSubtests.map(subtest => ({
        ...subtest,
        items: subtest.items.map(item => ({
          ...item,
          providedAnswer: undefined
        }))
      }))
    );
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = 190 - (2 * margin);
    let yPos = 20;

    // Page 1: Student Data and Total Score
    doc.setFontSize(30);
    doc.text('RESULTADO DEL TEST - 7', 105, yPos, { align: 'center' });
    yPos += 20;

    doc.setFontSize(14);
    doc.text('Datos del Estudiante', margin, yPos);
    yPos += 10;
    doc.setLineWidth(0.5);
    yPos -= 5;
    doc.line(margin, yPos, 190 - margin, yPos);
    yPos += 10;

    doc.setFontSize(12);
    const studentDataLines = [
      Nombre: ${studentData.nombres || 'No especificado'},
      Apellido: ${studentData.apellidos || 'No especificado'},
      Edad: ${studentData.edad || 'No especificado'},
      Género: ${studentData.genero === 'M' ? 'Masculino' : studentData.genero === 'F' ? 'Femenino' : 'No especificado'},
      Curso/Grado: ${studentData.curso || 'No especificado'},
      Institución: ${studentData.institucion || 'No especificado'},
      Fecha y hora de inicio: ${testStartTime || 'No especificado'},
    ];
    studentDataLines.forEach(line => {
      const textLines = doc.splitTextToSize(line, maxWidth);
      textLines.forEach((textLine: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(textLine, margin, yPos);
        yPos += 8;
      });
    });
    yPos += 15;

    doc.setFontSize(14);
    yPos += 10;
    doc.setLineWidth(0.5);
    yPos -= 5;
    doc.line(margin, yPos, 190 - margin, yPos);
    yPos += 10;

    doc.setFontSize(20);
    const totalScoreText = Puntuación total: ${calculateTotalScore()}/60 Puntos;
    doc.setFont('helvetica', 'bold');
    const totalScoreLines = doc.splitTextToSize(totalScoreText, maxWidth);
    totalScoreLines.forEach((textLine: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(textLine, margin, yPos);
      yPos += 8;
    });
    doc.setFont('helvetica', 'normal');
    yPos += 15;

    subtests.forEach((subtest, idx) => {
      if (subtest.items.length === 0) return;

      doc.addPage();
      yPos = 20;

      doc.setFontSize(14);
      const subtestTitle = Sección: ${subtest.name};
      const subtestTitleLines = doc.splitTextToSize(subtestTitle, maxWidth);
      subtestTitleLines.forEach((textLine: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(textLine, margin, yPos);
        yPos += 10;
      });
      yPos += 5;
      doc.setLineWidth(0.5);
      yPos -= 5;
      doc.line(margin, yPos, 190 - margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      const subtestScoreText = Puntuación: ${score[idx]} / ${subtest.maxScore};
      const subtestScoreLines = doc.splitTextToSize(subtestScoreText, maxWidth);
      subtestScoreLines.forEach((textLine: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(textLine, margin, yPos);
        yPos += 8;
      });
      yPos += 15;

      subtest.items.forEach((item, itemIdx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        const questionText = Pregunta ${itemIdx + 1}: ${item.question};
        const questionLines = doc.splitTextToSize(questionText, maxWidth);
        questionLines.forEach((textLine: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(textLine, margin, yPos);
          yPos += 8;
        });

        const correctAnswerText = Respuesta esperada: ${item.answer};
        const correctAnswerLines = doc.splitTextToSize(correctAnswerText, maxWidth);
        correctAnswerLines.forEach((textLine: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(textLine, margin, yPos);
          yPos += 8;
        });

        const providedAnswer = item.providedAnswer !== undefined && item.providedAnswer !== null
          ? item.providedAnswer
          : 'No proporcionada';
        const providedAnswerText = Respuesta proporcionada: ${providedAnswer};
        const providedAnswerLines = doc.splitTextToSize(providedAnswerText, maxWidth);
        providedAnswerLines.forEach((textLine: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(textLine, margin, yPos);
          yPos += 8;
        });

        const pointsObtained = item.providedAnswer !== undefined && item.providedAnswer !== null
          ? (compareAnswers(item.providedAnswer, item.answer, item.isNumeric || false) ? item.points : 0)
          : 0;
        const pointsText = Puntos obtenidos: ${pointsObtained} / ${item.points};
        const pointsLines = doc.splitTextToSize(pointsText, maxWidth);
        pointsLines.forEach((textLine: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(textLine, margin, yPos);
          yPos += 15;
        });
      });
    });

    doc.save(Resultado_Test_7_${studentData.nombres || 'Usuario'}_${studentData.apellidos || 'Desconocido'}.pdf);
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
            min="5"
            max="12"
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
          <div className={${styles.feedback} ${correctAnswer ? styles.correctFeedback : styles.incorrectFeedback}}>
            <p>
              {correctAnswer
                ? "¡Correcto! 🎉"
                : La respuesta correcta es: ${currentQuestion.answer}}
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
              <button
                className={styles.downloadButton}
                onClick={generatePDF}
                disabled={isSubmitting}
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderStartTestScreen = () => (
    <div className={styles.startTestContainer}>
      <div className={styles.startTestCard}>
        <h2>¡Todo listo para comenzar!</h2>
        <p>El test tiene una duración máxima de 20 minutos.</p>
        <p>Por favor, asegúrate de estar en un lugar tranquilo y sin distracciones.</p>
        
        <button 
          className={styles.startTestButton}
          onClick={startTest}
        >
          <FaPlay /> Iniciar Test
        </button>
      </div>
    </div>
  );

  const renderFinishScreen = () => (
    <div className={styles.finishTestContainer}>
      <div className={styles.finishTestCard}>
        <h2>¡Has completado todas las preguntas!</h2>
        <p>Tiempo restante: {formatTime(timeLeft)}</p>
        <p>¿Deseas finalizar el test ahora y ver tus resultados?</p>
        
        <button 
          className={styles.finishTestButton}
          onClick={finishTest}
          disabled={isSubmitting}
        >
          <FaFlagCheckered /> {isSubmitting ? 'Finalizando...' : 'Finalizar Test'}
        </button>
      </div>
    </div>
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
      <section className={${styles.questionSection} ${animation ? styles[animation] : ''}}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: ${((currentSubtest + currentItem / subtests[currentSubtest].items.length) / subtests.length) * 100}%
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
        ) : showFinishScreen ? (
          renderFinishScreen()
        ) : !testStarted ? (
          renderStartTestScreen()
        ) : (
          renderTestInProgress()
        )}
      </main>
    </div>
  );
};

export default ProCalculo7;