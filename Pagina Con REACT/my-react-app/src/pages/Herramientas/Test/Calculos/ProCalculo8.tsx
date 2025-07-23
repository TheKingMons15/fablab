import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaRedo, FaClock, FaUser, FaSchool, FaBirthdayCake, FaVenusMars, FaPlay, FaFlagCheckered } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import RompeCabezasHuevos from '../../Minijuego/RompeCabezasHuevos';
import SnakeGame from '../../Minijuego/SnakeGame';
import jsPDF from 'jspdf';

// Lista de instituciones educativas predefinidas
const institucionesEducativas = [
  "Unidad Educativa Particular Bilingüe Jefferson",
  "Unidad Educativa Particular Bilingüe Ecomundo",
  "Unidad Educativa Particular Bilingüe Nuevo Mundo",
  "Unidad Educativa Particular Bilingüe Delta",
  "Unidad Educativa Particular Bilingüe Tomás Moro",
  "Unidad Educativa Particular Bilingüe Academia Almirante Nelson",
  "Unidad Educativa Particular Bilingüe American School",
  "Unidad Educativa Particular Bilingüe Torremar",
  "Unidad Educativa Fiscal",
  "Otra institución"
];

// Interfaces
interface QuestionItem {
  question: string;
  answer: string | number;
  points: number;
  type: 'escrito' | 'opciones';
  options?: string[];
  image?: string;
  providedAnswer?: string | number;
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

interface StudentData {
  nombres: string;
  apellidos: string;
  edad: string;
  genero: string;
  curso: string;
  institucion: string;
}

const ProCalculo8: React.FC = () => {
  const navigate = useNavigate();
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(15).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [optionSelected, setOptionSelected] = useState<string | number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [writtenAnswerConfirmed, setWrittenAnswerConfirmed] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameType, setMiniGameType] = useState<'egg' | 'snake'>('egg');
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [studentData, setStudentData] = useState<StudentData>({
    nombres: '',
    apellidos: '',
    edad: '',
    genero: '',
    curso: '',
    institucion: '',
  });
  const [showStudentForm, setShowStudentForm] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStartTime, setTestStartTime] = useState<string>('');
  const [testStarted, setTestStarted] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false);

  const minigameSubtests = [3, 6, 9, 12];

  const [subtests, setSubtests] = useState<Subtest[]>([
    {
      name: "Contar para adelante",
      maxScore: 16,
      items: [
        { question: "Escribe los números del 1 al 13 separados solo por comas. Ejemplo (1,2,...)", answer: "1,2,3,4,5,6,7,8,9,10,11,12,13", points: 4, type: "escrito", image: '/img/Test_8 Contar_13A.png' },
        { question: "Escribe los números del 1 al 8 separados solo por comas. Ejemplo (1,2,...)", answer: "1,2,3,4,5,6,7,8", points: 4, type: "escrito", image: '/img/Test_8 Contar_8.png' },
        { question: "Escribe los números del 1 al 10 una vez más separados solo por comas. Ejemplo (1,2,...)", answer: "1,2,3,4,5,6,7,8,9,10", points: 4, type: "escrito", image: '/img/Test_8 Contar_10.png' },
        { question: "Escribe los números del 1 al 18 por última vez separados solo por comas. Ejemplo (1,2,...)", answer: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18", points: 4, type: "escrito", image: '/img/Test_8 Contar_18.png' }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { question: "Escribe los números contando hacia atrás desde 23 hasta 0 separados solo por comas. Ejemplo (23,22,...)", answer: "23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0", points: 2, type: "escrito", image: '/img/Test_8 Contar para atrás.png' }
      ]
    },
    {
      name: "Escritura de números",
      maxScore: 12,
      items: [
        { question: "Escribe el número 'ciento sesenta y nueve'", answer: "169", points: 2, type: "escrito", image: '/img/Test_8 Escritura_169.png' },
        { question: "Escribe el número 'treinta y ocho'", answer: "38", points: 2, type: "escrito", image: '/img/Test_8 Escritura_38.png' },
        { question: "Escribe el número 'mil doscientos'", answer: "1200", points: 2, type: "escrito", image: '/img/Test_8 Escritura_1200.png' },
        { question: "Escribe el número 'trescientos cinco'", answer: "305", points: 2, type: "escrito", image: '/img/Test_8 Escritura_305.png' },
        { question: "Escribe el número 'catorce'", answer: "14", points: 2, type: "escrito", image: '/img/Test_8 Escritura_14.png' },
        { question: "Escribe el número 'seis mil doscientos ochenta y cinco'", answer: "6285", points: 2, type: "escrito", image: '/img/Test_8 Escritura_6285.png' }
      ]
    },
    {
      name: "Cálculo mental",
      maxScore: 24,
      items: [
        { question: "5 + 8", answer: "13", points: 2, type: "escrito", image: '/img/Test_8 Cálculo_13.png'},
        { question: "12 + 6", answer: "18", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_18.png" },
        { question: "4 + 13", answer: "17", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_17.png" },
        { question: "9 + 7", answer: "16", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_16.png" },
        { question: "15 + 12", answer: "27", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_27.png" },
        { question: "13 + 19", answer: "32", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_32.png" },
        { question: "17 - 5", answer: "12", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_12.png" },
        { question: "14 - 6", answer: "8", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_8.png" },
        { question: "24 - 17", answer: "7", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_7.png" },
        { question: "19 - 6", answer: "13", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_13B.png" },
        { question: "15 - 9", answer: "6", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_6.png" },
        { question: "25 - 12", answer: "13", points: 2, type: "escrito", image: "/img/Test_8 Cálculo_13C.png" }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 12,
      items: [
        { question: "Escribe con palabras el número: 305", answer: "trescientos cinco", points: 2, type: "escrito", image: "/img/Test_8 Lectura_305.png" },
        { question: "Escribe con palabras el número: 57", answer: "cincuenta y siete", points: 2, type: "escrito", image: "/img/Test_8 Lectura_57.png" },
        { question: "Escribe con palabras el número: 6485", answer: "seis mil cuatrocientos ochenta y cinco", points: 2, type: "escrito", image: "/img/Test_8 Lectura_6485.png" },
        { question: "Escribe con palabras el número: 138", answer: "ciento treinta y ocho", points: 2, type: "escrito", image: "/img/Test_8 Lectura_138.png" },
        { question: "Escribe con palabras el número: 15", answer: "quince", points: 2, type: "escrito", image: "/img/Test_8 Lectura_15.png" },
        { question: "Escribe con palabras el número: 1900", answer: "mil novecientos", points: 2, type: "escrito", image: "/img/Test_8 Lectura_1900.png" }
      ]
    },
    {
      name: "Posicionar un número en una escala",
      maxScore: 10,
      items: [
        { question: "Escribe dónde colocarías el número 56 en una escala del 0 al 100", answer: "2", points: 2, type: "escrito", image: "/img/Test_8 Escala_56.png" },
        { question: "Escribe dónde colocarías el número 86 en una escala del 0 al 100", answer: "3", points: 2, type: "escrito", image: "/img/Test_8 Escala_86.png" },
        { question: "Escribe dónde colocarías el número 48 en una escala del 0 al 100", answer: "2", points: 2, type: "escrito", image: "/img/Test_8 Escala_48.png" },
        { question: "Escribe dónde colocarías el número 32 en una escala del 0 al 100", answer: "32", points: 2, type: "escrito", image: "/img/Test_8 Escala_32.png" },
        { question: "Escribe dónde colocarías el número 5 en una escala del 0 al 100", answer: "1", points: 2, type: "escrito", image: "/img/Test_8 Escala_5.png" },
        { question: "Escribe dónde colocarías el número 62 en una escala del 0 al 100", answer: "2", points: 2, type: "escrito", image: "/img/Test_8 Escala_62.png" }
      ]
    },
    {
      name: "Estimación perceptiva de cantidad",
      maxScore: 4,
      items: [
        { question: "¿Cuántas pelotas hay en la imagen?", answer: "54", points: 2, type: "escrito", image: "/img/Test_8 Estimación_54.png" },
        { question: "¿Cuántos vasos hay en la imagen?", answer: "66", points: 2, type: "escrito", image: "/img/Test_8 Estimación_66.png" }
      ]
    },
    {
      name: "Estimación de cantidades en contexto",
      maxScore: 10,
      items: [
        { question: "¿4 profesores en la misma clase es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", answer: "mucho", points: 2, type: "escrito", image: "/img/Test_8 Estimación_4.png" },
        { question: "¿2 nubes en el cielo es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", answer: "poco", points: 2, type: "escrito", image: "/img/Test_8 Estimación_2.png" },
        { question: "¿8 niños en una familia es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", answer: "más o menos", points: 2, type: "escrito", image: "/img/Test_8 Estimación_8A.png" },
        { question: "¿10 hojas en un árbol es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", answer: "poco", points: 2, type: "escrito", image: "/img/Test_8 Estimación_10.png" },
        { question: "¿8 lámparas en una habitación es poco, más o menos o mucho? (Escribe 'poco', 'más o menos' o 'mucho')", answer: "mucho", points: 2, type: "escrito", image: "/img/Test_8 Estimación_8B.png" }
      ]
    },
    {
      name: "Resolución de problemas aritméticos",
      maxScore: 8,
      items: [
        { question: "Pedro tiene 12 bolitas. Le da 5 bolitas a Ana. ¿Cuántas bolitas le quedan a Pedro en total?", answer: "7", points: 2, type: "escrito", image: "/img/Test_8 Resolución_7.png" },
        { question: "Pedro tiene 16 bolitas. Él tiene 4 bolitas más que Maria. ¿Cuántas bolitas tiene Maria?", answer: "12", points: 2, type: "escrito", image: "/img/Test_8 Resolución_12.png" },
        { question: "Pedro tiene muchas bolitas. Le da 6 bolitas a Deicy. Sólo le quedan 7 bolitas. ¿Cuántas bolitas tenía al comienzo Pedro?", answer: "13", points: 2, type: "escrito", image: "/img/Test_8 Resolución_13.png" },
        { question: "Pedro tiene 4 bolitas. Camila tiene 3 bolitas más que Pedro y Julio tiene 2 bolitas menos que Camila. ¿Cuántas bolitas tienen entre todos?", answer: "16", points: 2, type: "escrito", image: "/img/Test_8 Resolución_16.png" }
      ]
    },
    {
      name: "Comparación de dos números",
      maxScore: 16,
      items: [
        { question: "¿Cuál es mayor: 654 o 546? (Escribe el número mayor)", answer: "654", points: 2, type: "escrito", image: "/img/Test_8 Comparación_654.png" },
        { question: "¿Cuál es mayor: 79 o 81? (Escribe el número mayor)", answer: "81", points: 2, type: "escrito", image: "/img/Test_8 Comparación_81.png" },
        { question: "¿Cuál es mayor: 1007 o 1070? (Escribe el número mayor)", answer: "1070", points: 2, type: "escrito", image: "/img/Test_8 Comparación_1070.png" },
        { question: "¿Cuál es mayor: 511 o 298? (Escribe el número mayor)", answer: "511", points: 2, type: "escrito", image: "/img/Test_8 Comparación_511.png" },
        { question: "¿Cuál es mayor: 13 o 31? (Escribe el número mayor)", answer: "31", points: 2, type: "escrito", image: "/img/Test_8 Comparación_31.png" },
        { question: "¿Cuál es mayor: 9768 o 35201? (Escribe el número mayor)", answer: "35201", points: 2, type: "escrito", image: "/img/Test_8 Comparación_35201.png" },
        { question: "¿Cuál es mayor: 96 o 69? (Escribe el número mayor)", answer: "96", points: 2, type: "escrito", image: "/img/Test_8 Comparación_96.png" },
        { question: "¿Cuál es mayor: 377 o 433? (Escribe el número mayor)", answer: "433", points: 2, type: "escrito", image: "/img/Test_8 Comparación_433.png" }
      ]
    },
    {
      name: "Determinación de cantidad",
      maxScore: 21,
      items: [
        { question: "Escribe la cifra menor de todas.", answer: "12", points: 1, type: "escrito", image: "/img/Test_8 Determinación_12.png" },
        { question: "Escribe la cifra mayor de todas.", answer: "549755813888", points: 1, type: "escrito", image: "/img/Test_8 Determinación_549755813888.png" },
        { question: "Escribe las cifras menores de 100.", answer: "ninguna", points: 5, type: "escrito", image: "/img/Test_8 Determinación_ningunaA.png" },
        { question: "Escribe las cifras más grandes que mil.", answer: "todas", points: 11, type: "escrito", image: "/img/Test_8 Determinación_todasA.png" },
        { question: "Escribe el cien mil.", answer: "100000", points: 1, type: "escrito", image: "/img/Test_8 Determinación_100000.png" },
        { question: "Escribe las cifras más grandes que un millón.", answer: "todas", points: 2, type: "escrito", image: "/img/Test_8 Determinación_todasB.png" }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 3,
      items: [
        { question: "Escribe los 5 números que vienen después de 137", answer: "138,139,140,141,142", points: 1, type: "escrito", image: "/img/Test_8 Escribir_137.png" },
        { question: "Escribe los 5 números antes de 362", answer: "361,360,359,358,357", points: 1, type: "escrito", image: "/img/Test_8 Escribir_362A.png" },
        { question: "Escribe los 5 números después de 362", answer: "363,364,365,366,367", points: 1, type: "escrito", image: "/img/Test_8 Escribir_362D.png" }
      ]
    },
    {
      name: "Escritura correcta del número",
      maxScore: 5,
      items: [
        { question: "Escribe el número 'ciento dos' entre estas opciones.", answer: "102", points: 1, type: "escrito", image: "/img/Test_8 Escritura correcta_102.png" },
        { question: "Escribe el número cinco mil doce entre estas opciones.", answer: "5012", points: 1, type: "escrito", image: "/img/Test_8 Escritura correcta_5012.png" },
        { question: "Escribe el número ocho mil trescientos cincuenta y siete entre estas opciones.", answer: "8357", points: 1, type: "escrito", image: "/img/Test_8 Escritura correcta_8357.png" },
        { question: "Escribe el número mil cinco entre estas opciones.", answer: "1005", points: 1, type: "escrito", image: "/img/Test_8 Escritura correcta_1005.png" },
        { question: "Escribe el número mil ciento once entre estas opciones.", answer: "1111", points: 1, type: "escrito", image: "/img/Test_8 Escritura correcta_1111.png" }
      ]
    },
    {
      name: "Lectura alfabética de números y escritura en cifras",
      maxScore: 7,
      items: [
        { question: "Escribe 'trescientos' en cifra", answer: "300", points: 1, type: "escrito", image: "/img/Test_8 Lectura_300.png" },
        { question: "Escribe 'ochocientos veintisiete' en cifra", answer: "827", points: 1, type: "escrito", image: "/img/Test_8 Lectura_827.png" },
        { question: "Escribe 'doscientos sesenta y nueve' en cifra", answer: "269", points: 1, type: "escrito", image: "/img/Test_8 Lectura_269.png" },
        { question: "Escribe 'seiscientos dos' en cifra", answer: "602", points: 1, type: "escrito", image: "/img/Test_8 Lectura_602.png" },
        { question: "Escribe 'cinco mil doce' en cifra", answer: "5012", points: 1, type: "escrito", image: "/img/Test_8 Lectura_5012.png" },
        { question: "Escribe 'mil uno' en cifra", answer: "1001", points: 1, type: "escrito", image: "/img/Test_8 Lectura_1001.png" },
        { question: "Escribe 'mil cuatrocientos cinco' en cifra", answer: "1405", points: 1, type: "escrito", image: "/img/Test_8 Lectura_1405.png" }
      ]
    }
  ]);

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
      setTestStartTime(now.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Guayaquil' }));
    }
  }, [testStarted, timerActive]);

  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const edadNum = parseInt(studentData.edad);
    if (!studentData.nombres.trim()) errors.nombres = 'Por favor ingresa los nombres';
    if (!studentData.apellidos.trim()) errors.apellidos = 'Por favor ingresa los apellidos';
    if (!studentData.edad || isNaN(edadNum)) errors.edad = 'Edad inválida';
    if (edadNum < 7 || edadNum > 9) errors.edad = 'La edad debe estar entre 7 y 9 años';
    if (!studentData.genero) errors.genero = 'Selecciona un género';
    if (!studentData.curso.trim()) errors.curso = 'Ingresa el curso/grado';
    if (!studentData.institucion.trim()) errors.institucion = 'Selecciona la institución educativa';
    setFormErrors(errors);
    if (!errors.edad) {
      setStudentData(prev => ({
        ...prev,
        edad: edadNum.toString(),
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
    setTestStartTime(now.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Guayaquil' }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback || timeUp) return;
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isCorrect = normalizeText(selectedAnswer.toString()) === normalizeText(currentQuestion.answer.toString());

    setSubtests(prevSubtests => {
      const newSubtests = [...prevSubtests];
      newSubtests[currentSubtest].items[currentItem] = {
        ...newSubtests[currentSubtest].items[currentItem],
        providedAnswer: selectedAnswer,
      };
      return newSubtests;
    });

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
      if (minigameSubtests.includes(currentSubtest)) {
        setShowMiniGame(true);
        setMiniGameType(currentSubtest === 3 || currentSubtest === 9 ? 'egg' : 'snake');
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

  const finishTest = () => {
    setShowFinishScreen(false);
    setShowResult(true);
    setTimerActive(false);
    const totalScore = score.reduce((a, b) => a + b, 0);
    if (totalScore > 80) {
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
    setScore(Array(15).fill(0));
    setShowResult(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setWrittenAnswerConfirmed(false);
    setShowMiniGame(false);
    setMiniGameType('egg');
    setTimeLeft(30 * 60);
    setTimerActive(false);
    setTimeUp(false);
    setShowStudentForm(true);
    setTestStartTime('');
    setTestStarted(false);
    setShowFinishScreen(false);
    setSubtests(prevSubtests =>
      prevSubtests.map(subtest => ({
        ...subtest,
        items: subtest.items.map(item => ({
          ...item,
          providedAnswer: undefined,
        })),
      }))
    );
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 166) * 100;
    if (timeUp) return "¡Tiempo terminado! ⏰";
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

  const calculateTotalScore = (): number => {
    return score.reduce((a, b) => a + b, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = 190 - (2 * margin);
    let yPos = 20;

    // Page 1: Student Data and Total Score
    doc.setFontSize(30);
    doc.text('RESULTADO DEL TEST - 8', 105, yPos, { align: 'center' });
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
      `Nombre: ${studentData.nombres || 'No especificado'}`,
      `Apellido: ${studentData.apellidos || 'No especificado'}`,
      `Edad: ${studentData.edad || 'No especificado'}`,
      `Género: ${studentData.genero === 'M' ? 'Masculino' : studentData.genero === 'F' ? 'Femenino' : 'No especificado'}`,
      `Curso/Grado: ${studentData.curso || 'No especificado'}`,
      `Institución: ${studentData.institucion || 'No especificado'}`,
      `Fecha y hora de inicio: ${testStartTime || 'No especificado'}`,
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
    const totalScoreText = `Puntuación total: ${calculateTotalScore()}/166 Puntos`;
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
      const subtestTitle = `Sección: ${subtest.name}`;
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
      const subtestScoreText = `Puntuación: ${score[idx]} / ${subtest.maxScore}`;
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

        const questionText = `Pregunta ${itemIdx + 1}: ${item.question}`;
        const questionLines = doc.splitTextToSize(questionText, maxWidth);
        questionLines.forEach((textLine: string) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(textLine, margin, yPos);
          yPos += 8;
        });

        const correctAnswerText = `Respuesta esperada: ${item.answer}`;
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
        const providedAnswerText = `Respuesta proporcionada: ${providedAnswer}`;
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
          ? (normalizeText(item.providedAnswer.toString()) === normalizeText(item.answer.toString()) ? item.points : 0)
          : 0;
        const pointsText = `Puntos obtenidos: ${pointsObtained} / ${item.points}`;
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

    doc.save(`Resultado_Test_8_${studentData.nombres || 'Usuario'}_${studentData.apellidos || 'Desconocido'}.pdf`);
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
            placeholder="Ejemplo: 3ro de Educación Básica"
          />
          {formErrors.curso && <span className={styles.errorMessage}>{formErrors.curso}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="institucion">
            <FaSchool /> Institución Educativa:
          </label>
          <select
            id="institucion"
            name="institucion"
            value={studentData.institucion}
            onChange={handleInputChange}
            className={formErrors.institucion ? styles.inputError : ''}
            disabled={isSubmitting}
          >
            <option value="">Selecciona tu institución...</option>
            {institucionesEducativas.map((institucion, index) => (
              <option key={index} value={institucion}>
                {institucion}
              </option>
            ))}
          </select>
          {formErrors.institucion && <span className={styles.errorMessage}>{formErrors.institucion}</span>}
        </div>
        <div className={styles.formActions}>
          <button
            className={styles.startTestButton}
            onClick={saveStudentData}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cargando...' : <><FaPlay /> Comenzar Test</>}
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

  const renderMiniGame = () => (
    <div className={styles.miniGameContainer}>
      {miniGameType === 'egg' ? (
        <RompeCabezasHuevos onComplete={handleMiniGameComplete} />
      ) : (
        <SnakeGame onComplete={handleMiniGameComplete} />
      )}
    </div>
  );

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

  const renderStartTestScreen = () => (
    <div className={styles.startTestContainer}>
      <div className={styles.startTestCard}>
        <h2>¡Todo listo para comenzar!</h2>
        <p>El test tiene una duración máxima de 30 minutos.</p>
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
            <button 
              className={styles.restartButton}
              onClick={restartTest}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : <><FaRedo /> Intentar de nuevo</>}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generando...' : <><FaRedo /> Descargar PDF</>}
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
            Pro-Cálculo <span className={styles.ageBadge}>8 años</span>
          </h1>
        </div>
        <div className={styles.controlButtons}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/herramientas/test')}
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
      </section>
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

export default ProCalculo8;