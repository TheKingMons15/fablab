import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock, FaUser, FaSchool, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import RompeCabezasHuevos from '../../Minijuego/RompeCabezasHuevos';

interface QuestionItem {
  question: string;
  answer: string | number;
  points: number;
  type: 'escrito' | 'opciones';
  options?: string[];
  image?: string;
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo8: React.FC = () => {
  // Estados del test
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(15).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>(Array(15).fill([]));
  const [optionSelected, setOptionSelected] = useState<string | number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [writtenAnswerConfirmed, setWrittenAnswerConfirmed] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!showStudentForm && timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult && !timeUp) {
      setTimerActive(false);
      setTimeUp(true);
      setShowResult(true);
      const totalScore = score.reduce((a, b) => a + b, 0);
      if (totalScore > 80) {
        launchConfetti();
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, timerActive, showResult, timeUp, score, showStudentForm]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const edadNum = parseInt(studentData.edad);

    if (!studentData.nombres.trim()) errors.nombres = 'Por favor ingresa los nombres';
    if (!studentData.apellidos.trim()) errors.apellidos = 'Por favor ingresa los apellidos';
    if (!studentData.edad || isNaN(edadNum)) errors.edad = 'Edad inválida';
    if (edadNum < 7 || edadNum > 9) errors.edad = 'La edad debe estar entre 7 y 9 años';
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
      // Simulamos el envío a la API con un retraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Iniciamos el test después de "guardar" los datos
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
      maxScore: 16,
      items: [
        { 
          question: "Escribe los números del 1 al 30 seprados por comas. Ejemplo (1,2,...)", 
          answer: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30", 
          points: 4,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe los números del 1 al 30 nuevamente seprados por comas. Ejemplo (1,2,...)", 
          answer: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30", 
          points: 4,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe los números del 1 al 30 una vez más seprados por comas. Ejemplo (1,2,...)", 
          answer: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30", 
          points: 4,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe los números del 1 al 30 una última vez seprados por comas. Ejemplo (1,2,...)", 
          answer: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30", 
          points: 4,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Escribe los números contando hacia atrás desde 23 hasta 0 seprados por comas. Ejemplo (1,2,...)", 
          answer: "23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Escritura de números",
      maxScore: 12,
      items: [
        { 
          question: "Escribe el número 'ciento sesenta y nueve'", 
          answer: "169", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 'treinta y ocho'", 
          answer: "38", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 'mil doscientos'", 
          answer: "1200", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 'trescientos cinco'", 
          answer: "305", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 'catorce'", 
          answer: "14", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 'seis mil doscientos ochenta y cinco'", 
          answer: "6285", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Cálculo mental",
      maxScore: 24,
      items: [
        { 
          question: "5 + 8", 
          answer: "13", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "12 + 6", 
          answer: "18", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "4 + 13", 
          answer: "17", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "9 + 7", 
          answer: "16", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "15 + 12", 
          answer: "27", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "13 + 19", 
          answer: "32", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "17 - 5", 
          answer: "12", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "14 - 6", 
          answer: "8", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "24 - 17", 
          answer: "7", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "19 - 6", 
          answer: "13", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "15 - 9", 
          answer: "6", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "25 - 12", 
          answer: "13", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 12,
      items: [
        { 
          question: "Escribe con palabras el número: 305", 
          answer: "trescientos cinco", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe con palabras el número: 57", 
          answer: "cincuenta y siete", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe con palabras el número: 6485", 
          answer: "seis mil cuatrocientos ochenta y cinco", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe con palabras el número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe con palabras el número: 15", 
          answer: "quince", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe con palabras el número: 1900", 
          answer: "mil novecientos", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Posicionar un número en una escala",
      maxScore: 10,
      items: [
        { 
          question: "Escribe dónde colocarías el número 56 en una escala del 0 al 100", 
          answer: "2", 
          points: 2,
          type: "escrito",
          image: '/img/escala_56.png'
        },
        { 
          question: "Escribe dónde colocarías el número 86 en una escala del 0 al 100", 
          answer: "3", 
          points: 2,
          type: "escrito",
          image: '/img/escala_86.png'
        },
        { 
          question: "Escribe dónde colocarías el número 48 en una escala del 0 al 100", 
          answer: "2", 
          points: 2,
          type: "escrito",
          image: '/img/escala_48.png'
        },
        { 
          question: "Escribe dónde colocarías el número 32 en una escala del 0 al 100", 
          answer: "32", 
          points: 2,
          type: "escrito",
          image: '/img/escala_32.png'
        },
        { 
          question: "Escribe dónde colocarías el número 5 en una escala del 0 al 100", 
          answer: "1", 
          points: 2,
          type: "escrito",
          image: '/img/escala_5.png'
        },
        { 
          question: "Escribe dónde colocarías el número 62 en una escala del 0 al 100", 
          answer: "2", 
          points: 2,
          type: "escrito",
          image: '/img/escala_62.png'
        }
      ]
    },
    {
      name: "Estimación perceptiva de cantidad",
      maxScore: 4,
      items: [
        { 
          question: "¿Cuántas pelotas hay en la imagen? 54", 
          answer: "54", 
          points: 2,
          type: "escrito",
          image: '/img/54_pelotas.png'
        },
        { 
          question: "¿Cuántos vasos hay en la imagen?", 
          answer: "66", 
          points: 2,
          type: "escrito",
          image: '/img/66_vasos.png'
        }
      ]
    },
    {
      name: "Estimación de cantidades en contexto",
      maxScore: 10,
      items: [
        { 
          question: "¿4 profesores en la misma clase es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", 
          answer: "mucho", 
          points: 2,
          type: "escrito",
          image: '/img/4_profesores.png'
        },
        { 
          question: "¿2 nubes en el cielo es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito",
          image: '/img/2_nubes.png'
        },
        { 
          question: "¿8 niños en una familia es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", 
          answer: "más o menos", 
          points: 2,
          type: "escrito",
          image: '/img/8_niños.png'
        },
        { 
          question: "¿10 hojas en un árbol es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", 
          answer: "poco", 
          points: 2,
          type: "escrito",
          image: '/img/10_hojas.png'
        },
        { 
          question: "¿8 lámparas en una habitación es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", 
          answer: "mucho", 
          points: 2,
          type: "escrito",
          image: '/img/8_lamparas.png'
        }
      ]
    },
    {
      name: "Resolución de problemas aritméticos",
      maxScore: 8,
      items: [
        { 
          question: "Pedro tiene 12 bolitas. Le da 5 bolitas a Ana. ¿Cuántas bolitas le quedan en total?", 
          answer: "7", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Pedro tiene 16 bolitas. Él tiene 4 bolitas más que Ana. ¿Cuántas bolitas tiene Ana?", 
          answer: "12", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Pedro tiene muchas bolitas. Le da 6 bolitas a Ana. Sólo le quedan 7 bolitas. ¿Cuántas bolitas tenía al comienzo?", 
          answer: "13", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "Pedro tiene 4 bolitas. Ana tiene 3 bolitas más que Pedro y Julio tiene 2 bolitas menos que Ana. ¿Cuántas bolitas tienen entre todos?", 
          answer: "16", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Comparación de dos números",
      maxScore: 16,
      items: [
        { 
          question: "¿Cuál es mayor: 654 o 546? (Escribe el número mayor)", 
          answer: "654", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 79 o 81? (Escribe el número mayor)", 
          answer: "81", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 1007 o 1070? (Escribe el número mayor)", 
          answer: "1070", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 511 o 298? (Escribe el número mayor)", 
          answer: "511", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 13 o 31? (Escribe el número mayor)", 
          answer: "31", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 9768 o 35201? (Escribe el número mayor)", 
          answer: "35201", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 96 o 69? (Escribe el número mayor)", 
          answer: "96", 
          points: 2,
          type: "escrito",
          image: ''
        },
        { 
          question: "¿Cuál es mayor: 377 o 433? (Escribe el número mayor)", 
          answer: "433", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Determinación de cantidad",
      maxScore: 21,
      items: [
        { 
          question: "Escribe la cifra menor de todas: 12, 549755813888, 00000000000000, 12, 49, 50, 97", 
          answer: "12", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe la cifra mayor de todas: 1234, 1993, 3000, 7777, 8520, 10000, 12345, 100000, 3000000, 123456, 549755813888", 
          answer: "549755813888", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe las cifras menores de 100: 1234, 1993, 3000, 7777, 8520, 10000, 12345, 100000, 3000000, 123456, 549755813888", 
          answer: "ninguna", 
          points: 5,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe las cifras más grandes que mil: 1234, 1993, 3000, 7777, 8520, 10000, 12345, 100000, 3000000, 123456, 549755813888", 
          answer: "todas", 
          points: 11,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el cien mil: 100000, 3000000, 549755813888", 
          answer: "100000", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe las cifras más grandes que un millón: 3000000, 549755813888", 
          answer: "ambas", 
          points: 2,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 3,
      items: [
        { 
          question: "Escribe los 5 números que vienen después de 137", 
          answer: "138,139,140,141,142", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe los 5 números antes de 362", 
          answer: "361,360,359,358,357", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe los 5 números después de 362", 
          answer: "363,364,365,366,367", 
          points: 1,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Escritura correcta del número",
      maxScore: 5,
      items: [
        { 
          question: "Escribe el número 102 entre estas opciones: 200, 1200, 102, 2100, 1102, 120", 
          answer: "102", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 5012 entre estas opciones: 50012, 512000, 5121, 510012, 5012, 500102", 
          answer: "5012", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 8357 entre estas opciones: 80003103307, 50357, 8357, 833037, 8003067, 800030057", 
          answer: "8357", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 1005 entre estas opciones: 1005, 10028, 1300, 135, 1050, 10080", 
          answer: "1005", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe el número 1111 entre estas opciones: 10010811, 1001011, 11111, 1111, 10111, 10100", 
          answer: "1111", 
          points: 1,
          type: "escrito",
          image: ''
        }
      ]
    },
    {
      name: "Lectura alfabética de números y escritura en cifras",
      maxScore: 7,
      items: [
        { 
          question: "Escribe 'trescientos' en cifra", 
          answer: "300", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe 'ochocientos veintisiete' en cifra", 
          answer: "827", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe 'doscientos sesenta y nueve' en cifra", 
          answer: "269", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe 'seiscientos dos' en cifra", 
          answer: "602", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe 'cinco mil doce' en cifra", 
          answer: "5012", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe 'mil uno' en cifra", 
          answer: "1001", 
          points: 1,
          type: "escrito",
          image: ''
        },
        { 
          question: "Escribe 'mil cuatrocientos cinco' en cifra", 
          answer: "1405", 
          points: 1,
          type: "escrito",
          image: ''
        }
      ]
    }
  ];

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback || timeUp) return;
    
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isCorrect = normalizeText(selectedAnswer.toString()) === 
                     normalizeText(currentQuestion.answer.toString());
    
    setOptionSelected(selectedAnswer);
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
    
    const newAnswers = [...userAnswers];
    newAnswers[currentSubtest] = [...newAnswers[currentSubtest], selectedAnswer];
    setUserAnswers(newAnswers);
    
    setTimeout(() => {
      moveToNextItem();
    }, 2000);
  };

  const moveToNextItem = () => {
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    
    if (currentItem + 1 >= subtests[currentSubtest].items.length) {
      const nextSubtest = currentSubtest + 1;
      if (nextSubtest > 0 && nextSubtest % 3 === 0 && nextSubtest < subtests.length) {
        setShowMiniGame(true);
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
        if (totalScore > 80) {
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
    
    setTimeout(() => {
      setAnimation('');
      if (currentSubtest + 1 < subtests.length) {
        setCurrentSubtest(currentSubtest + 1);
        setCurrentItem(0);
      } else {
        setShowResult(true);
        setTimerActive(false);
        const totalScore = score.reduce((a, b) => a + b, 0);
        if (totalScore > 80) {
          launchConfetti();
        }
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
    setScore(Array(15).fill(0));
    setShowResult(false);
    setUserAnswers(Array(15).fill([]));
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    setShowMiniGame(false);
    setTimeLeft(30 * 60);
    setTimerActive(false);
    setTimeUp(false);
    setShowStudentForm(true);
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 166) * 100;
    
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
    
    // Limpiar error si se corrige
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
            min="7"
            max="9"
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
        
        {currentQuestion.type === "opciones" && currentQuestion.options && (
          <div className={styles.optionsGrid}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} 
                  ${optionSelected === option ? styles.selected : ''} 
                  ${showFeedback && option === currentQuestion.answer ? styles.correct : ''} 
                  ${showFeedback && optionSelected === option && option !== currentQuestion.answer ? styles.incorrect : ''}`}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback || timeUp}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        {currentQuestion.type === "escrito" && renderInputField()}
        
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

  return (
    <div className={styles.pageContainer}>
      <main className={styles.testContainer}>
        <div className={styles.cloudBackground}></div>
        
        {showStudentForm ? (
          renderStudentForm()
        ) : showMiniGame ? (
          <div className={styles.miniGameContainer}>
            <RompeCabezasHuevos onComplete={handleMiniGameComplete} />
          </div>
        ) : (
          <>
            <section className={styles.testHeader}>
              <div className={styles.titleWrapper}>
                <h1 className={styles.testTitle}>
                  <img src="/img/test.png" alt="Logo de Media Lab" className={styles.logoSmall} />
                  Pro-Cálculo <span className={styles.ageBadge}>8 años</span>
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
                        <span className={styles.scoreTotal}>/166</span>
                      </div>
                      {timeUp && (
                        <div className={styles.timeUpWarning}>
                          ⏰ El tiempo ha terminado
                        </div>
                      )}
                    </div>
                    
                    <p className={styles.scoreText}>
                      Puntuación total: <span className={styles.scoreHighlight}>{score.reduce((a, b) => a + b, 0)}</span> de 166 puntos
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

export default ProCalculo8;