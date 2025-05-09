import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaCheck, FaTimes, FaRedo, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import styles from './ProCalculo.module.css';
import confetti from 'canvas-confetti';
import { RompeCabezasHuevos } from '../Minijuego/RompeCabezas';

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
  type: 'oral' | 'escrito' | 'opciones' | 'conteo';
  options?: string[];
  countingItems?: number;
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo6: React.FC = () => {
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState<number[]>(Array(9).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(string | number)[][]>(Array(9).fill([]));
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
      maxScore: 12,
      items: [
        { 
          question: "Cuenta los números en voz alta hasta 20", 
          answer: "20", 
          points: 4,
          type: "conteo",
          countingItems: 20
        },
        { 
          question: "Cuenta los números en orden ascendente nuevamente", 
          answer: "20", 
          points: 4,
          type: "conteo",
          countingItems: 20
        },
        { 
          question: "Cuenta los números en orden ascendente una vez más", 
          answer: "20", 
          points: 4,
          type: "conteo",
          countingItems: 20
        }
      ]
    },
    {
      name: "Contar para atrás",
      maxScore: 2,
      items: [
        { 
          question: "Cuenta hacia atrás desde 10", 
          answer: "0", 
          points: 2,
          type: "conteo",
          countingItems: 10
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
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'veinte'", 
          answer: "20", 
          points: 2,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'trescientos cinco'", 
          answer: "305", 
          points: 2,
          type: "escrito" 
        }
      ]
    },
    {
      name: "Cálculo mental",
      maxScore: 12,
      items: [
        { 
          question: "10 + 10", 
          answer: "20", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "1 + 15", 
          answer: "16", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "2 + 7", 
          answer: "9", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "10 - 3", 
          answer: "7", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "18 - 6", 
          answer: "12", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "7 - 4", 
          answer: "3", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Lectura de números",
      maxScore: 8,
      items: [
        { 
          question: "Lee este número: 57", 
          answer: "cincuenta y siete", 
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
          question: "Lee este número: 138", 
          answer: "ciento treinta y ocho", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Lee este número: 9", 
          answer: "nueve", 
          points: 2,
          type: "oral" 
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
          type: "opciones",
          options: ["poco", "mucho"] 
        },
        { 
          question: "¿2 niños jugando en el recreo es poco o mucho?", 
          answer: "poco", 
          points: 2,
          type: "opciones",
          options: ["poco", "mucho"] 
        },
        { 
          question: "¿60 chicos en un cumpleaños es poco o mucho?", 
          answer: "mucho", 
          points: 2,
          type: "opciones",
          options: ["poco", "mucho"] 
        }
      ]
    },
    {
      name: "Resolución de problemas",
      maxScore: 4,
      items: [
        { 
          question: "Pedro tiene 8 bolitas rojas y 2 amarillas. ¿Cuántas bolitas tiene en total?", 
          answer: "10", 
          points: 2,
          type: "oral" 
        },
        { 
          question: "Pedro tiene 10 bolitas y pierde 5. ¿Cuántas bolitas le quedan?", 
          answer: "5", 
          points: 2,
          type: "oral" 
        }
      ]
    },
    {
      name: "Adaptación",
      maxScore: 8,
      items: [
        { 
          question: "¿Cuánto crees que cuesta una bicicleta?", 
          answer: "150", 
          points: 2,
          type: "opciones",
          options: ["50", "150", "300"] 
        },
        { 
          question: "¿Cuánto crees que cuesta una radio?", 
          answer: "90", 
          points: 2,
          type: "opciones",
          options: ["30", "90", "200"] 
        },
        { 
          question: "¿Cuánto crees que cuesta una pelota de cuero?", 
          answer: "50", 
          points: 2,
          type: "opciones",
          options: ["20", "50", "100"] 
        },
        { 
          question: "¿Cuánto crees que cuesta una gaseosa?", 
          answer: "1.50", 
          points: 2,
          type: "opciones",
          options: ["1.50", "5", "10"] 
        }
      ]
    },
    {
      name: "Escribir en cifra",
      maxScore: 2,
      items: [
        { 
          question: "Escribe el número 'quince'", 
          answer: "15", 
          points: 1,
          type: "escrito" 
        },
        { 
          question: "Escribe el número 'veinticinco'", 
          answer: "25", 
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
    const countingTarget = currentQuestion.countingItems ?? (isCountingUp ? 20 : 10);
    
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
    const countingTarget = currentQuestion.countingItems ?? (isCountingUp ? 20 : 10);
    
    const nextNumber = isCountingUp ? countingProgress + 1 : countingTarget - countingProgress;
    setCountingProgress(prev => prev + 1);

    if (
      (isCountingUp && nextNumber === countingTarget) ||
      (!isCountingUp && nextNumber === 0)
    ) {
      handleAnswer(nextNumber.toString());
    }
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
      const countingTarget = currentQuestion.countingItems ?? (isCountingUp ? 20 : 10);
      
      isCorrect = (isCountingUp && selectedAnswer.toString() === countingTarget.toString()) ||
                  (!isCountingUp && selectedAnswer.toString() === "0");
    }
    else if (currentQuestion.type === "oral") {
      const answerVariations = getAnswerVariations(currentQuestion.answer.toString());
      isCorrect = answerVariations.some(variation => 
        normalizeText(selectedAnswer.toString()) === variation
      );
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
    
    if (answer === "20") {
      variations.push("veinte");
    } else if (answer === "16") {
      variations.push("dieciséis", "dieciseis");
    } else if (answer === "9") {
      variations.push("nueve");
    } else if (answer === "7") {
      variations.push("siete");
    } else if (answer === "12") {
      variations.push("doce");
    } else if (answer === "3") {
      variations.push("tres");
    } else if (answer === "10") {
      variations.push("diez");
    } else if (answer === "5") {
      variations.push("cinco");
    }
    
    if (answer === "cincuenta y siete") {
      variations.push("57");
    } else if (answer === "quince") {
      variations.push("15");
    } else if (answer === "ciento treinta y ocho") {
      variations.push("138");
    } else if (answer === "nueve") {
      variations.push("9");
    }
    
    return variations;
  };

  const numberToWords = (num: number): string => {
    const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      return tens[ten] + (unit !== 0 ? ' y ' + units[unit] : '');
    }
    if (num === 100) return 'cien';
    if (num < 200) return 'ciento ' + numberToWords(num - 100);
    if (num === 200) return 'doscientos';
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      return units[hundred] + 'cientos' + (rest !== 0 ? ' ' + numberToWords(rest) : '');
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
        if (totalScore > 30) {
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
      if (totalScore > 30) {
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
    setScore(Array(9).fill(0));
    setShowResult(false);
    setUserAnswers(Array(9).fill([]));
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
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    const percentage = (totalScore / 60) * 100;
    
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
      const targetNumber = currentQuestion.countingItems ?? (isCountingUp ? 20 : 10);
      
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
        
        {renderCountingExercise()}
        {renderInputField()}
        {renderOralInput()}
        
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
                  Pro-Cálculo <span className={styles.ageBadge}>6 años</span>
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
                        <span className={styles.scoreTotal}>/60</span>
                      </div>
                    </div>
                    
                    <p className={styles.scoreText}>
                      Puntuación total: <span className={styles.scoreHighlight}>{score.reduce((a, b) => a + b, 0)}</span> de 60 puntos
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

export default ProCalculo6;
