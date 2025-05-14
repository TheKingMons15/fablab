import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaRedo, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import { RompeCabezasHuevos } from '../../Minijuego/RompeCabezas';

interface SpeechRecognitionResult {
  [key: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
}

interface SpeechRecognition extends EventTarget {
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

interface QuestionItem {
  question: string;
  answer: string | number;
  points: number;
  type: 'oral' | 'escrito' | 'opciones' | 'conteo' | 'posicionar' | 'comparacion';
  options?: string[];
  countingItems?: number;
  numberOptions?: number[];
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo8: React.FC = () => {
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(15).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>(Array(15).fill([]));
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [optionSelected, setOptionSelected] = useState<string | number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [animation, setAnimation] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [oralAnswer, setOralAnswer] = useState('');
  const [countingProgress, setCountingProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [countingFinished, setCountingFinished] = useState(false);
  const [writtenAnswerConfirmed, setWrittenAnswerConfirmed] = useState(false);
  const [oralAnswerConfirmed, setOralAnswerConfirmed] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const numberScale = Array.from({ length: 101 }, (_, i) => i); // [0, 1, 2, ..., 100]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[0];
          const transcript = result[0].transcript;
          setRecognizedText(transcript);
          setOralAnswer(transcript);
          
          const currentQuestion = subtests[currentSubtest].items[currentItem];
          
          if (currentQuestion.type === 'oral') {
            // Only update answer, don't submit automatically
          }
          
          if (currentQuestion.type === 'conteo') {
            const numbersFound = transcript.match(/\b(\d+)\b/g) || [];
            if (numbersFound.length > 0) {
              const lastNumber = parseInt(numbersFound[numbersFound.length - 1]);
              if (!isNaN(lastNumber)) {
                handleCountNumber(lastNumber);
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Error en reconocimiento de voz:', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentSubtest, currentItem]);

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
          question: "Cuenta los números en voz alta hasta 30", 
          answer: "30", 
          points: 4,
          type: "conteo",
          countingItems: 30
        },
        { 
          question: "Cuenta los números en orden ascendente nuevamente", 
          answer: "30", 
          points: 4,
          type: "conteo",
          countingItems: 30
        },
        { 
          question: "Cuenta los números en orden ascendente una vez más", 
          answer: "30", 
          points: 4,
          type: "conteo",
          countingItems: 30
        },
        { 
          question: "Cuenta los números en orden ascendente una última vez", 
          answer: "30", 
          points: 4,
          type: "conteo",
          countingItems: 30
        }
      ]
    },
    {
      name: "Contar oralmente para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Cuenta hacia atrás desde 23", 
          answer: "0", 
          points: 2,
          type: "conteo",
          countingItems: 23
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
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'treinta y ocho'", 
          answer: "38", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'mil doscientos'", 
          answer: "1200", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'trescientos cinco'", 
          answer: "305", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'catorce'", 
          answer: "14", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'seis mil doscientos ochenta y cinco'", 
          answer: "6285", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Cálculo mental oral",
      maxScore: 24,
      items: [
        { 
          question: "5 + 8", 
          answer: "13", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "12 + 6", 
          answer: "18", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "4 + 13", 
          answer: "17", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "9 + 7", 
          answer: "16", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "15 + 12", 
          answer: "27", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "13 + 19", 
          answer: "32", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "17 - 5", 
          answer: "12", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "14 - 6", 
          answer: "8", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "24 - 17", 
          answer: "7", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "19 - 6", 
          answer: "13", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "15 - 9", 
          answer: "6", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "25 - 12", 
          answer: "13", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 12,
      items: [
        { 
          question: "Lee este número: 305", 
          answer: "trescientos cinco", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 57", 
          answer: "cincuenta y siete", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 6485", 
          answer: "seis mil cuatrocientos ochenta y cinco", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 15", 
          answer: "quince", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 1900", 
          answer: "mil novecientos", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Posicionar un número en una escala",
      maxScore: 10,
      items: [
        { 
          question: "Posiciona el número 56 en la escala del 0 al 100", 
          answer: 56, 
          points: 2,
          type: "posicionar" 
        },
        { 
          question: "Posiciona el número 80 en la escala del 0 al 100", 
          answer: 80, 
          points: 2,
          type: "posicionar" 
        },
        { 
          question: "Posiciona el número 62 en la escala del 0 al 100", 
          answer: 62, 
          points: 2,
          type: "posicionar" 
        },
        { 
          question: "Posiciona el número 10 en la escala del 0 al 100", 
          answer: 10, 
          points: 2,
          type: "posicionar" 
        },
        { 
          question: "Posiciona el número 35 en la escala del 0 al 100", 
          answer: 35, 
          points: 2,
          type: "posicionar" 
        }
      ]
    },
    {
      name: "Comparación oral de dos números",
      maxScore: 16,
      items: [
        { 
          question: "¿Cuál es mayor: 49 o 51?", 
          answer: "51", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 546 o 465?", 
          answer: "546", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 2009 o 2090?", 
          answer: "2090", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 800 o 108?", 
          answer: "800", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 389 o 612?", 
          answer: "612", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 34601 o 9678?", 
          answer: "34601", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 46 o 64?", 
          answer: "64", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuál es mayor: 211 o 166?", 
          answer: "211", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Estimación perceptiva de cantidad",
      maxScore: 4,
      items: [
        { 
          question: "¿Cuántas pelotas hay en la imagen? (57 pelotas)", 
          answer: "57", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "¿Cuántos vasos hay en la imagen? (83 vasos)", 
          answer: "83", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Estimación de cantidades en contexto",
      maxScore: 10,
      items: [
        { 
          question: "¿4 profesores en la misma clase es poco, más o menos o mucho?", 
          answer: "mucho", 
          points: 2,
          type: "opciones",
          options: ["poco", "más o menos", "mucho"] 
        },
        { 
          question: "¿2 nubes en el cielo es poco, más o menos o mucho?", 
          answer: "poco", 
          points: 2,
          type: "opciones",
          options: ["poco", "más o menos", "mucho"] 
        },
        { 
          question: "¿8 niños en una familia es poco, más o menos o mucho?", 
          answer: "más o menos", 
          points: 2,
          type: "opciones",
          options: ["poco", "más o menos", "mucho"] 
        },
        { 
          question: "¿10 hojas en un árbol es poco, más o menos o mucho?", 
          answer: "poco", 
          points: 2,
          type: "opciones",
          options: ["poco", "más o menos", "mucho"] 
        },
        { 
          question: "¿8 lámparas en una habitación es poco, más o menos o mucho?", 
          answer: "mucho", 
          points: 2,
          type: "opciones",
          options: ["poco", "más o menos", "mucho"] 
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
          type: "oral" 
        },
        { 
          question: "Pedro tiene 16 bolitas. Él tiene 4 bolitas más que Ana. ¿Cuántas bolitas tiene Ana?", 
          answer: "12", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Pedro tiene muchas bolitas. Le da 6 bolitas a Ana. Sólo le quedan 7 bolitas. ¿Cuántas bolitas tenía al comienzo?", 
          answer: "13", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Pedro tiene 4 bolitas. Ana tiene 3 bolitas más que Pedro y Julio tiene 2 bolitas menos que Ana. ¿Cuántas bolitas tienen entre todos?", 
          answer: "16", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Comparación de dos números en cifras",
      maxScore: 16,
      items: [
        { 
          question: "¿Cuál es mayor: 654 o 546?", 
          answer: "654", 
          points: 2,
          type: "comparacion",
          options: ["654", "546"]
        },
        { 
          question: "¿Cuál es mayor: 79 o 81?", 
          answer: "81", 
          points: 2,
          type: "comparacion",
          options: ["79", "81"]
        },
        { 
          question: "¿Cuál es mayor: 1007 o 1070?", 
          answer: "1070", 
          points: 2,
          type: "comparacion",
          options: ["1007", "1070"]
        },
        { 
          question: "¿Cuál es mayor: 511 o 298?", 
          answer: "511", 
          points: 2,
          type: "comparacion",
          options: ["511", "298"]
        },
        { 
          question: "¿Cuál es mayor: 13 o 31?", 
          answer: "31", 
          points: 2,
          type: "comparacion",
          options: ["13", "31"]
        },
        { 
          question: "¿Cuál es mayor: 9768 o 35201?", 
          answer: "35201", 
          points: 2,
          type: "comparacion",
          options: ["9768", "35201"]
        },
        { 
          question: "¿Cuál es mayor: 96 o 69?", 
          answer: "96", 
          points: 2,
          type: "comparacion",
          options: ["96", "69"]
        },
        { 
          question: "¿Cuál es mayor: 377 o 433?", 
          answer: "433", 
          points: 2,
          type: "comparacion",
          options: ["377", "433"]
        }
      ]
    },
    {
      name: "Determinación de cantidad",
      maxScore: 21,
      items: [
        { 
          question: "Marca la cifra menor de todas: 12, 549755813888, 00000000000000, 12, 49, 50, 97", 
          answer: "12", 
          points: 1,
          type: "opciones",
          options: ["12", "549755813888", "00000000000000", "49", "50", "97"]
        },
        { 
          question: "Marca la cifra mayor de todas: 1234, 1993, 3000, 7777, 8520, 10000, 12345, 100000, 3000000, 123456, 549755813888", 
          answer: "549755813888", 
          points: 1,
          type: "opciones",
          options: ["1234", "1993", "3000", "7777", "8520", "10000", "12345", "100000", "3000000", "123456", "549755813888"]
        },
        { 
          question: "Tacha las cifras menores de 100: 1234, 1993, 3000, 7777, 8520, 10000, 12345, 100000, 3000000, 123456, 549755813888", 
          answer: "ninguna", 
          points: 5,
          type: "opciones",
          options: ["1234", "1993", "3000", "7777", "8520", "10000", "12345", "100000", "3000000", "123456", "549755813888"]
        },
        { 
          question: "Subraya las cifras más grandes que mil: 1234, 1993, 3000, 7777, 8520, 10000, 12345, 100000, 3000000, 123456, 549755813888", 
          answer: "todas", 
          points: 11,
          type: "opciones",
          options: ["1234", "1993", "3000", "7777", "8520", "10000", "12345", "100000", "3000000", "123456", "549755813888"]
        },
        { 
          question: "Traza un círculo alrededor del cien mil: 100000, 3000000, 549755813888", 
          answer: "100000", 
          points: 1,
          type: "opciones",
          options: ["100000", "3000000", "549755813888"]
        },
        { 
          question: "Marca con una X si ves una cifra más grande que un millón: 3000000, 549755813888", 
          answer: "ambas", 
          points: 2,
          type: "opciones",
          options: ["3000000", "549755813888"]
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
          type: "escrito" 
        },
        { 
          question: "Completa los números antes del 362 hacia arriba", 
          answer: "361,360,359,358,357", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Completa los números después de 362 hacia abajo", 
          answer: "363,364,365,366,367", 
          points: 1,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Escritura correcta del número",
      maxScore: 5,
      items: [
        { 
          question: "Marca el número 102 entre: 200, 1200, 102, 2100, 1102, 120", 
          answer: "102", 
          points: 1,
          type: "opciones",
          options: ["200", "1200", "102", "2100", "1102", "120"]
        },
        { 
          question: "Marca el número 5012 entre: 50012, 512000, 5121, 510012, 5012, 500102", 
          answer: "5012", 
          points: 1,
          type: "opciones",
          options: ["50012", "512000", "5121", "510012", "5012", "500102"]
        },
        { 
          question: "Marca el número 8357 entre: 80003103307, 50357, 8357, 833037, 8003067, 800030057", 
          answer: "8357", 
          points: 1,
          type: "opciones",
          options: ["80003103307", "50357", "8357", "833037", "8003067", "800030057"]
        },
        { 
          question: "Marca el número 1005 entre: 1005, 10028, 1300, 135, 1050, 10080", 
          answer: "1005", 
          points: 1,
          type: "opciones",
          options: ["1005", "10028", "1300", "135", "1050", "10080"]
        },
        { 
          question: "Marca el número 1111 entre: 10010811, 1001011, 11111, 1111, 10111, 10100", 
          answer: "1111", 
          points: 1,
          type: "opciones",
          options: ["10010811", "1001011", "11111", "1111", "10111", "10100"]
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
          type: "escrito" 
        },
        { 
          question: "Escribe 'ochocientos veintisiete' en cifra", 
          answer: "827", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe 'doscientos sesenta y nueve' en cifra", 
          answer: "269", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe 'seiscientos dos' en cifra", 
          answer: "602", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe 'cinco mil doce' en cifra", 
          answer: "5012", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe 'mil uno' en cifra", 
          answer: "1001", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe 'mil cuatrocientos cinco' en cifra", 
          answer: "1405", 
          points: 1,
          type: "escrito" 
        }
      ]
    }
  ];

  useEffect(() => {
    if (!showResult && !showFeedback && timeLeft === null && !showMiniGame) {
      setTimeLeft(30);
    }
    
    let timer: NodeJS.Timeout;
    if (timeLeft !== null && timeLeft > 0 && !showFeedback && !showMiniGame) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showFeedback && !showMiniGame) {
      handleTimeUp();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, showFeedback, currentSubtest, currentItem, showResult, showMiniGame]);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert("El reconocimiento de voz no está disponible en tu navegador. Usa el modo manual.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setRecognizedText('');
        setOralAnswer('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error al iniciar reconocimiento de voz:", e);
        alert("No se pudo iniciar el reconocimiento de voz. Asegúrate de permitir el acceso al micrófono.");
      }
    }
  };

  const handleCountNumber = (number: number) => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isCountingUp = currentSubtest === 0;
    const countingTarget = currentQuestion.countingItems ?? (isCountingUp ? 30 : 23);
    
    if (
      (isCountingUp && number === countingProgress + 1) ||
      (!isCountingUp && number === countingTarget - countingProgress)
    ) {
      setCountingProgress(prev => prev + 1);
    }

    if (
      (isCountingUp && number === countingTarget) ||
      (!isCountingUp && number === 0)
    ) {
      handleAnswer(number.toString());
    }
  };

  const handleManualCount = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    const isCountingUp = currentSubtest === 0;
    const countingTarget = currentQuestion.countingItems ?? (isCountingUp ? 30 : 23);
    
    const nextNumber = isCountingUp ? countingProgress + 1 : countingTarget - countingProgress;
    setCountingProgress(prev => prev + 1);

    if (
      (isCountingUp && nextNumber === countingTarget) ||
      (!isCountingUp && nextNumber === 0)
    ) {
      handleAnswer(nextNumber.toString());
    }
  };

  const handlePositionNumber = (position: number) => {
    setSelectedPosition(position);
  };

  const handleTimeUp = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      setCorrectAnswer(false);
      
      const newAnswers = [...userAnswers];
      newAnswers[currentSubtest] = [...newAnswers[currentSubtest], "tiempo_agotado"];
      setUserAnswers(newAnswers);
      
      setTimeout(() => {
        moveToNextItem();
      }, 2000);
    }
  };

  const handleAnswer = (selectedAnswer: string | number) => {
    if (showFeedback) return;
    
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    let isCorrect = false;
    
    if (currentQuestion.type === "escrito") {
      isCorrect = normalizeText(selectedAnswer.toString()) === 
                  normalizeText(currentQuestion.answer.toString());
    } 
    else if (currentQuestion.type === "conteo") {
      const isCountingUp = currentSubtest === 0;
      const countingTarget = currentQuestion.countingItems ?? (isCountingUp ? 30 : 23);
      
      isCorrect = (isCountingUp && selectedAnswer.toString() === countingTarget.toString()) ||
                  (!isCountingUp && selectedAnswer.toString() === "0");
    }
    else if (currentQuestion.type === "oral") {
      const answerVariations = getAnswerVariations(currentQuestion.answer.toString());
      isCorrect = answerVariations.some(variation => 
        normalizeText(selectedAnswer.toString()) === variation
      );
    }
    else if (currentQuestion.type === "posicionar") {
      const targetNumber = parseInt(currentQuestion.answer.toString());
      isCorrect = selectedPosition !== null && 
                  Math.abs(selectedPosition - targetNumber) <= 5;
    }
    else {
      isCorrect = selectedAnswer === currentQuestion.answer;
    }
    
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

  const getAnswerVariations = (answer: string): string[] => {
    const variations = [normalizeText(answer)];
    
    if (/^\d+$/.test(answer)) {
      const number = parseInt(answer);
      variations.push(normalizeText(numberToWords(number)));
    }
    
    if (answer === "13") {
      variations.push("trece");
    } else if (answer === "18") {
      variations.push("dieciocho");
    } else if (answer === "17") {
      variations.push("diecisiete");
    } else if (answer === "16") {
      variations.push("dieciséis", "dieciseis");
    } else if (answer === "27") {
      variations.push("veintisiete");
    } else if (answer === "32") {
      variations.push("treinta y dos");
    } else if (answer === "12") {
      variations.push("doce");
    } else if (answer === "8") {
      variations.push("ocho");
    } else if (answer === "7") {
      variations.push("siete");
    } else if (answer === "6") {
      variations.push("seis");
    }
    
    if (answer === "trescientos cinco") {
      variations.push("305");
    } else if (answer === "cincuenta y siete") {
      variations.push("57");
    } else if (answer === "seis mil cuatrocientos ochenta y cinco") {
      variations.push("6485");
    } else if (answer === "ciento treinta y ocho") {
      variations.push("138");
    } else if (answer === "quince") {
      variations.push("15");
    } else if (answer === "mil novecientos") {
      variations.push("1900");
    }
    
    return variations;
  };

  const numberToWords = (num: number): string => {
    const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      return tens[ten] + (unit !== 0 ? ' y ' + units[unit] : '');
    }
    if (num === 100) return 'cien';
    if (num < 200) return 'ciento ' + numberToWords(num - 100);
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      return hundreds[hundred] + (rest !== 0 ? ' ' + numberToWords(rest) : '');
    }
    if (num === 1000) return 'mil';
    if (num < 2000) return 'mil ' + numberToWords(num % 1000);
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const rest = num % 1000;
      return numberToWords(thousand) + ' mil' + (rest !== 0 ? ' ' + numberToWords(rest) : '');
    }
    return num.toString();
  };

  const moveToNextItem = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setOralAnswer('');
    setCountingProgress(0);
    setRecognizedText('');
    setCountingFinished(false);
    setWrittenAnswerConfirmed(false);
    setOralAnswerConfirmed(false);
    setSelectedPosition(null);
    
    // Verificar si es momento de mostrar el minijuego (cada 3 subtest completados)
    if (currentItem + 1 >= subtests[currentSubtest].items.length) {
      const nextSubtest = currentSubtest + 1;
      if (nextSubtest > 0 && nextSubtest % 3 === 0 && nextSubtest < subtests.length) {
        setShowMiniGame(true);
        return;
      }
    }
    
    // Lógica normal de navegación entre preguntas
    if (currentItem + 1 < subtests[currentSubtest].items.length) {
      setCurrentItem(currentItem + 1);
      setTimeLeft(30);
    } else {
      if (currentSubtest + 1 < subtests.length) {
        setCurrentSubtest(currentSubtest + 1);
        setCurrentItem(0);
        setTimeLeft(30);
      } else {
        setShowResult(true);
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
    
    // Continúa con el siguiente subtest
    if (currentSubtest + 1 < subtests.length) {
      setCurrentSubtest(currentSubtest + 1);
      setCurrentItem(0);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      const totalScore = score.reduce((a, b) => a + b, 0);
      if (totalScore > 80) {
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
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    setCurrentSubtest(0);
    setCurrentItem(0);
    setScore(Array(15).fill(0));
    setShowResult(false);
    setUserAnswers(Array(15).fill([]));
    setTimeLeft(30);
    setShowFeedback(false);
    setOptionSelected(null);
    setCorrectAnswer(null);
    setAnimation('');
    setWrittenAnswer('');
    setOralAnswer('');
    setCountingProgress(0);
    setRecognizedText('');
    setCountingFinished(false);
    setWrittenAnswerConfirmed(false);
    setOralAnswerConfirmed(false);
    setShowMiniGame(false);
    setSelectedPosition(null);
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 166) * 100;
    
    if (percentage >= 80) return "¡Excelente trabajo! 🎉";
    if (percentage >= 60) return "¡Muy bien hecho! 🌟";
    if (percentage >= 40) return "¡Buen intento! 👍";
    return "¡Sigue practicando! 💪";
  };

  const renderInputField = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if (currentQuestion.type === "escrito") {
      return (
        <div className={styles.writtenAnswerContainer}>
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
                if (e.key === 'Enter' && writtenAnswer.trim()) {
                  setWrittenAnswerConfirmed(true);
                }
              }}
            />
            <button 
              className={styles.submitButton}
              onClick={() => writtenAnswer.trim() && setWrittenAnswerConfirmed(true)}
              disabled={!writtenAnswer.trim()}
            >
              Terminar
            </button>
          </div>

          {writtenAnswerConfirmed && (
            <div className={styles.confirmationButtons}>
              <p>¿Estás seguro de tu respuesta?</p>
              <div className={styles.confirmationButtonGroup}>
                <button 
                  className={styles.confirmButton}
                  onClick={() => {
                    handleAnswer(writtenAnswer);
                    setWrittenAnswerConfirmed(false);
                  }}
                >
                  Sí, enviar
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setWrittenAnswerConfirmed(false)}
                >
                  No, corregir
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderOralInput = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if (currentQuestion.type === "oral") {
      return (
        <div className={styles.oralContainer}>
          <div className={styles.voiceControl}>
            <button
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              onClick={toggleVoiceRecognition}
              disabled={oralAnswerConfirmed}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              {isListening ? ' Escuchando...' : ' Usar micrófono'}
            </button>
            
            {recognizedText && (
              <div className={styles.recognizedText}>
                <p>Reconocido: <strong>{recognizedText}</strong></p>
              </div>
            )}
          </div>
          
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="O escribe tu respuesta aquí..."
              value={oralAnswer}
              onChange={(e) => {
                setOralAnswer(e.target.value);
                setOralAnswerConfirmed(false);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && oralAnswer.trim()) {
                  setOralAnswerConfirmed(true);
                }
              }}
              disabled={oralAnswerConfirmed}
            />
            <button 
              className={styles.submitButton}
              onClick={() => oralAnswer.trim() && setOralAnswerConfirmed(true)}
              disabled={!oralAnswer.trim() || oralAnswerConfirmed}
            >
              Terminar
            </button>
          </div>

          {oralAnswerConfirmed && (
            <div className={styles.confirmationButtons}>
              <p>¿Estás seguro de tu respuesta?</p>
              <div className={styles.confirmationButtonGroup}>
                <button 
                  className={styles.confirmButton}
                  onClick={() => {
                    handleAnswer(oralAnswer);
                    setOralAnswerConfirmed(false);
                  }}
                >
                  Sí, enviar
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => {
                    setOralAnswerConfirmed(false);
                    setRecognizedText('');
                    setOralAnswer('');
                  }}
                >
                  No, corregir
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderCountingExercise = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];

    if (currentQuestion.type === "conteo") {
      const isCountingUp = currentSubtest === 0;
      const targetNumber = currentQuestion.countingItems ?? (isCountingUp ? 30 : 23);
      
      return (
        <div className={styles.countingContainer}>
          <div className={styles.countingHeader}>
            <button
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              onClick={toggleVoiceRecognition}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              {isListening ? ' Escuchando...' : ' Usar micrófono'}
            </button>
            
            {recognizedText && (
              <div className={styles.recognizedText}>
                <p>Reconocido: <strong>{recognizedText}</strong></p>
              </div>
            )}
          </div>
          
          <div className={styles.countingProgress}>
            <p>
              {isCountingUp ? "Conteo ascendente: " : "Conteo descendente: "}
              {countingProgress > 0 ? (
                Array.from(
                  {length: isCountingUp ? countingProgress : targetNumber - countingProgress + 1}, 
                  (_, i) => isCountingUp ? i + 1 : targetNumber - i
                ).join(", ")
              ) : "..."}
            </p>
          </div>
          
          <div className={styles.countingControls}>
            <button 
              className={styles.countingButton}
              onClick={() => {
                handleManualCount();
                setCountingFinished(false);
              }}
              disabled={isCountingUp ? countingProgress >= targetNumber : countingProgress > targetNumber}
            >
              {countingProgress === 0 ? 
                `Comenzar a contar ${isCountingUp ? 'desde 1' : `desde ${targetNumber}`}` : 
                `Continuar conteo`}
            </button>
            
            <button 
              className={styles.submitButton}
              onClick={() => {
                setCountingFinished(true);
              }}
            >
              Terminar conteo
            </button>
          </div>

          {countingFinished && (
            <div className={styles.confirmationButtons}>
              <p>¿Terminaste de contar?</p>
              <div className={styles.confirmationButtonGroup}>
                <button 
                  className={styles.confirmButton}
                  onClick={() => {
                    const answer = isCountingUp ? countingProgress : targetNumber - countingProgress;
                    handleAnswer(answer.toString());
                    setCountingFinished(false);
                  }}
                >
                  Sí, continuar
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setCountingFinished(false)}
                >
                  No, seguir contando
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderNumberScale = () => {
    const currentQuestion = subtests[currentSubtest].items[currentItem];
    
    if (currentQuestion.type === "posicionar") {
      return (
        <div className={styles.numberScaleContainer}>
          <div className={styles.scale}>
            <div className={styles.scaleLine}></div>
            {[0, 25, 50, 75, 100].map(num => (
              <div key={num} className={styles.scaleMarker}>
                <div className={styles.scaleTick}></div>
                <div className={styles.scaleNumber}>{num}</div>
              </div>
            ))}
          </div>
          
          <div className={styles.scaleSelector}>
            {numberScale.map((num, index) => (
              <div 
                key={num}
                className={`${styles.scalePosition} ${selectedPosition === num ? styles.selected : ''}`}
                onClick={() => handlePositionNumber(num)}
                style={{ left: `${index}%` }}
              ></div>
            ))}
          </div>
          
          <div className={styles.scaleControls}>
            <button 
              className={styles.submitButton}
              onClick={() => selectedPosition !== null && handleAnswer(selectedPosition)}
              disabled={selectedPosition === null}
            >
              Confirmar posición
            </button>
          </div>
          
          {selectedPosition !== null && (
            <div className={styles.selectedPosition}>
              Posición seleccionada: {selectedPosition}
            </div>
          )}
        </div>
      );
    }
    return null;
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
                disabled={showFeedback}
              >
                <span className={styles.optionContent}>
                  <span className={styles.optionText}>{option}</span>
                  {showFeedback && option === currentQuestion.answer && (
                    <FaCheck className={styles.feedbackIcon} />
                  )}
                  {showFeedback && optionSelected === option && option !== currentQuestion.answer && (
                    <FaTimes className={styles.feedbackIcon} />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
        
        {currentQuestion.type === "comparacion" && currentQuestion.options && (
          <div className={styles.comparisonContainer}>
            <div className={styles.comparisonOptions}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`${styles.comparisonButton} 
                    ${optionSelected === option ? styles.selected : ''} 
                    ${showFeedback && option === currentQuestion.answer ? styles.correct : ''} 
                    ${showFeedback && optionSelected === option && option !== currentQuestion.answer ? styles.incorrect : ''}`}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                >
                  <span className={styles.comparisonContent}>
                    <span className={styles.comparisonText}>{option}</span>
                    {showFeedback && option === currentQuestion.answer && (
                      <FaCheck className={styles.feedbackIcon} />
                    )}
                    {showFeedback && optionSelected === option && option !== currentQuestion.answer && (
                      <FaTimes className={styles.feedbackIcon} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {renderCountingExercise()}
        {renderInputField()}
        {renderOralInput()}
        {renderNumberScale()}
        
        {showFeedback && (
          <div className={`${styles.feedback} ${correctAnswer ? styles.correctFeedback : styles.incorrectFeedback}`}>
            <p>
              {correctAnswer 
                ? "¡Correcto! 🎉" 
                : `La respuesta correcta es: ${subtests[currentSubtest].items[currentItem].answer}`}
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
        
        {showMiniGame ? (
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
                    Tiempo: <span className={timeLeft && timeLeft < 10 ? styles.timerWarning : ''}>{timeLeft}</span>
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