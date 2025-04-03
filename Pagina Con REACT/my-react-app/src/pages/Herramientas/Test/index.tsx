import React, { useState, useEffect } from 'react';
import { FaBrain, FaLightbulb, FaStar, FaPlay, FaArrowRight, FaChild, FaCalculator, FaTrophy, FaClock, FaSmile, FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Test.module.css';

const Test: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'indicaciones' | 'pruebas'>('indicaciones');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'pruebas') {
      const interval = setInterval(() => {
        const newParticle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 2,
          color: `hsl(${Math.random() * 30 + 100}, 70%, 60%)` // Tonos verdes
        };
        setParticles(prev => [...prev.slice(-20), newParticle]);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const pruebasNinos = [
    {
      id: 1,
      nombre: 'Pro-Cálculo para 6 años',
      descripcion: 'Ejercicios básicos de sumas y restas con apoyo visual para primeros aprendizajes.',
      enlace: '/test/ProCalculo6',
      icon: <FaChild size={32} />,
      color: '#006633', // Verde primario
      nivel: 'Inicial',
      tiempo: '5-10 min',
      preguntas: 10
    },
    {
      id: 2,
      nombre: 'Pro-Cálculo para 7 años',
      descripcion: 'Operaciones matemáticas con lógica sencilla y problemas cotidianos.',
      enlace: '/test/pro-calculo-7',
      icon: <FaCalculator size={32} />,
      color: '#009955', // Verde secundario
      nivel: 'Intermedio',
      tiempo: '10-15 min',
      preguntas: 15
    },
    {
      id: 3,
      nombre: 'Pro-Cálculo para 8 años',
      descripcion: 'Desafíos matemáticos con múltiples pasos y ejercicios interactivos avanzados.',
      enlace: '/test/pro-calculo-8',
      icon: <FaGraduationCap size={32} />,
      color: '#007744', // Verde intermedio
      nivel: 'Avanzado',
      tiempo: '15-20 min',
      preguntas: 20
    },
    {
      id: 4,
      nombre: 'Reto Matemático Especial',
      descripcion: 'Problemas desafiantes para mentes curiosas que quieren ir más allá.',
      enlace: '/test/reto-matematico',
      icon: <FaTrophy size={32} />,
      color: '#FFCE00', // Amarillo acento
      nivel: 'Experto',
      tiempo: '20-25 min',
      preguntas: 25
    }
  ];

  const features = [
    {
      title: "Aprendizaje Adaptativo",
      description: "Dificultad que se ajusta al ritmo del niño",
      icon: <FaLightbulb className={styles.featureIcon} />,
      color: "#006633" // Verde primario
    },
    {
      title: "Retroalimentación Inmediata",
      description: "Explicaciones claras para cada respuesta",
      icon: <FaStar className={styles.featureIcon} />,
      color: "#009955" // Verde secundario
    },
    {
      title: "Diseño Motivacional",
      description: "Sistema de recompensas y logros",
      icon: <FaSmile className={styles.featureIcon} />,
      color: "#FFCE00" // Amarillo acento
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={styles.loadingSpinner}
        >
          <FaBrain size={48} color="#006633" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.loadingText}
        >
          Cargando Pro-Cálculo...
        </motion.h1>
      </div>
    );
  }

  return (
    <main className={styles.mediaContainer} style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Fondo animado */}
      <div className={styles.animatedBackground} style={{ width: '100vw' }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.mathSymbol}
            initial={{ y: -10, opacity: 0 }}
            animate={{
              y: [0, 15, 0],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              color: `hsl(${Math.random() * 30 + 100}, 70%, 40%)` // Símbolos en verde
            }}
          >
            {['+', '-', '×', '÷', '=', 'π', '√'][Math.floor(Math.random() * 7)]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.section 
          className={styles.titleSection}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%' }}
      >
        <div className={styles.logoContainer}>
          <motion.img 
            src="/img/Medialab.png" 
            alt="Logo de Media Lab" 
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          />
          <motion.h1 
            className={styles.mediaTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Pro-Cálculo
          </motion.h1>
        </div>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Transformando el aprendizaje matemático en una aventura
        </motion.p>
      </motion.section>

      {/* Pestañas de navegación */}
      <motion.nav 
        className={styles.navTabs}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          className={`${styles.tab} ${activeTab === 'indicaciones' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('indicaciones')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.tabContent}>
            <FaLightbulb className={styles.tabIcon} />
            Indicaciones
          </span>
        </motion.button>
        <motion.button
          className={`${styles.tab} ${activeTab === 'pruebas' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('pruebas')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.tabContent}>
            <FaBrain className={styles.tabIcon} />
            Pruebas para niños
          </span>
        </motion.button>
      </motion.nav>

      {/* Contenido principal */}
      <div className={styles.contentContainer} style={{ maxWidth: '100%', padding: '1rem', boxSizing: 'border-box' }}>
        <AnimatePresence mode='wait'>
          {activeTab === 'indicaciones' && (
            <motion.section
              key="indicaciones"
              className={styles.indicacionesSection}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className={styles.heroBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleHighlight}>🌟</span> Descubre el poder de las matemáticas
                </h2>
                <p className={styles.introText}>
                  ¡Bienvenido a <b>Pro-Cálculo</b>! Una experiencia interactiva diseñada para hacer del aprendizaje matemático 
                  una aventura llena de diversión y descubrimientos.
                </p>
              </motion.div>

              <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={styles.featureCard}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 * index }}
                    whileHover={{ y: -5 }}
                    style={{ borderTopColor: feature.color }}
                  >
                    <div className={styles.featureIconContainer} style={{ color: feature.color }}>
                      {feature.icon}
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className={styles.instructionsGrid}>
                <motion.div
                  className={styles.instructionCard}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.instructionHeader}>
                    <FaLightbulb className={styles.instructionIcon} style={{ color: "#006633" }} />
                    <h3>🧐 Observa con atención</h3>
                  </div>
                  <p className={styles.instructionText}>
                    Cada pregunta es una oportunidad para aprender. Lee cuidadosamente y analiza antes de responder.
                  </p>
                  <div className={styles.instructionImageContainer}>
                    <img src="/img/Observa.png" alt="Niño observando" className={styles.instructionImage} />
                  </div>
                </motion.div>

                <motion.div
                  className={styles.instructionCard}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.instructionHeader}>
                    <FaBrain className={styles.instructionIcon} style={{ color: "#009955" }} />
                    <h3>🧠 Desarrolla tu pensamiento</h3>
                  </div>
                  <p className={styles.instructionText}>
                    Intenta resolver los problemas por ti mismo. El error es parte del aprendizaje.
                  </p>
                  <div className={styles.instructionImageContainer}>
                    <img src="/img/Piensa.png" alt="Niño pensando" className={styles.instructionImage} />
                  </div>
                </motion.div>

                <motion.div
                  className={styles.instructionCard}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.instructionHeader}>
                    <FaStar className={styles.instructionIcon} style={{ color: "#FFCE00" }} />
                    <h3>🏆 Disfruta el proceso</h3>
                  </div>
                  <p className={styles.instructionText}>
                    Celebra cada acierto y aprende de cada desafío. ¡La diversión está garantizada!
                  </p>
                  <div className={styles.instructionImageContainer}>
                    <img src="/img/Disfruta.png" alt="Niños celebrando" className={styles.instructionImage} />
                  </div>
                </motion.div>
              </div>

              <motion.div
                className={styles.ctaContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  className={styles.startTestButton}
                  onClick={() => setActiveTab('pruebas')}
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 102, 51, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className={styles.buttonIcon} />
                  <span>¡Comienza tu aventura matemática!</span>
                  <FaArrowRight className={styles.buttonArrow} />
                </motion.button>
              </motion.div>
            </motion.section>
          )}

          {activeTab === 'pruebas' && (
            <motion.section
              key="pruebas"
              className={styles.pruebasSection}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.particlesContainer}>
                {particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    className={styles.particle}
                    initial={{ x: particle.x + 'vw', y: particle.y + 'vh', opacity: 0 }}
                    animate={{ 
                      y: particle.y + 20 + 'vh',
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 5
                    }}
                    style={{
                      width: particle.size + 'px',
                      height: particle.size + 'px',
                      background: particle.color,
                      left: particle.x + 'vw',
                      top: particle.y + 'vh'
                    }}
                  />
                ))}
              </div>

              <motion.div 
                className={styles.sectionHeader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleHighlight}>📚</span> Elige tu desafío matemático
                </h2>
                <p className={styles.sectionSubtitle}>
                  Selecciona una prueba acorde a tu edad o nivel de conocimiento
                </p>
              </motion.div>

              <div className={styles.pruebasGrid}>
                {pruebasNinos.map((prueba, index) => (
                  <motion.article
                    key={prueba.id}
                    className={styles.pruebaCard}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    onMouseEnter={() => setHoveredCard(prueba.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ 
                      borderTop: `5px solid ${prueba.color}`,
                      transform: hoveredCard === prueba.id ? 'translateY(-5px)' : 'none'
                    }}
                  >
                    <div className={styles.pruebaIcon} style={{ color: prueba.color }}>
                      {prueba.icon}
                    </div>
                    <div className={styles.pruebaContent}>
                      <h3 className={styles.pruebaName}>{prueba.nombre}</h3>
                      <p className={styles.pruebaDescription}>{prueba.descripcion}</p>
                      
                      <div className={styles.pruebaMeta}>
                        <span className={styles.pruebaMetaItem}>
                          <FaGraduationCap className={styles.metaIcon} />
                          {prueba.nivel}
                        </span>
                        <span className={styles.pruebaMetaItem}>
                          <FaClock className={styles.metaIcon} />
                          {prueba.tiempo}
                        </span>
                        <span className={styles.pruebaMetaItem}>
                          <FaStar className={styles.metaIcon} />
                          {prueba.preguntas} preguntas
                        </span>
                      </div>
                    </div>

                    <motion.a
                      href={prueba.enlace}
                      className={styles.startTestButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ backgroundColor: prueba.color }}
                    >
                      Comenzar
                      <FaArrowRight className={styles.buttonArrow} />
                    </motion.a>

                    {hoveredCard === prueba.id && (
                      <motion.div 
                        className={styles.cardHoverEffect}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ background: prueba.color }}
                      />
                    )}
                  </motion.article>
                ))}
              </div>

              <motion.div 
                className={styles.testimonials}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className={styles.testimonialsTitle}>Lo que dicen nuestros pequeños matemáticos</h3>
                <div className={styles.testimonialsGrid}>
                  <div className={styles.testimonialCard}>
                    <div className={styles.testimonialContent}>
                      "¡Me encantan los problemas! Son como juegos y gano estrellas."
                    </div>
                    <div className={styles.testimonialAuthor}>- Ana, 7 años</div>
                  </div>
                  <div className={styles.testimonialCard}>
                    <div className={styles.testimonialContent}>
                      "Ahora las matemáticas son mi materia favorita gracias a Pro-Cálculo."
                    </div>
                    <div className={styles.testimonialAuthor}>- Javier, 8 años</div>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer 
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className={styles.footerContent}>
          <img src="/img/Medialab.png" alt="Media Lab" className={styles.footerLogo} />
          <p className={styles.footerText}>
            Pro-Cálculo es un proyecto educativo de Media Lab diseñado para transformar el aprendizaje de las matemáticas.
          </p>
          <div className={styles.footerLinks}>
            <a href="/about">Acerca de</a>
            <a href="/contact">Contacto</a>
            <a href="/privacy">Privacidad</a>
          </div>
        </div>
      </motion.footer>
    </main>
  );
};

export default Test;