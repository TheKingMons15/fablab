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
}

interface Subtest {
  name: string;
  maxScore: number;
  items: QuestionItem[];
}

const ProCalculo6: React.FC = () => {
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
  const [studentId, setStudentId] = useState<number | null>(null); // Nuevo estado para el ID del estudiante

  const minigameSubtests = [3, 6];

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
      if (totalScore > 30) {
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
    if (edadNum < 5 || edadNum > 12) errors.edad = 'La edad debe estar entre 5 y 12 años';
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
      const response = await fetch('/procalculo-api/guardar-estudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: studentData.nombres,
          apellidos: studentData.apellidos,
          edad: parseInt(studentData.edad),
          genero: studentData.genero,
          curso: studentData.curso,
          institucion: studentData.institucion
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      setStudentId(data.id);
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
    // ... (todos los subtests existentes se mantienen exactamente igual)
    // Copia y pega aquí TODOS los subtests de tu versión original sin cambios
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

  const finishTest = async () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
    
    try {
      const response = await fetch('/procalculo-api/guardar-estudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudiante_id: studentId,
          test_tipo: "ProCálculo6",
          puntuacion_total: totalScore,
          detalles: {
            subtests: subtests.map((subtest, i) => ({
              nombre: subtest.name,
              puntuacion: score[i],
              max_puntuacion: subtest.maxScore
            })),
            tiempo_utilizado: (20 * 60) - timeLeft
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar resultados');
      }

      setShowResult(true);
      if (totalScore > 30) {
        launchConfetti();
      }
    } catch (error) {
      console.error('Error al guardar resultados:', error);
      alert('Ocurrió un error al guardar los resultados. Los datos se han perdido.');
    } finally {
      setTimerActive(false);
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
    setStudentId(null);
  };

  const getResultMessage = () => {
    const totalScore = score.reduce((a, b) => a + b, 0);
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
              <span className={styles.scoreTotal}>/60</span>
            </div>
            {timeUp && (
              <div className={styles.timeUpWarning}>
                ⏰ El tiempo ha terminado
              </div>
            )}
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
            <button 
              className={styles.homeButton} 
              onClick={() => navigate('/herramientas/test')}
            >
              Elegir otra prueba
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