import React, { JSX } from 'react';
import { FaBrain, FaRegEye, FaLightbulb, FaStar, FaPlay, FaArrowRight, FaChild, FaCalculator, FaClock, FaSmile, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import styles from './Test.module.css';

// Interface definitions
interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface PruebasNinos {
  id: number;
  nombre: string;
  descripcion: string;
  enlace: string;
  icon: React.ReactNode;
  color: string;
  nivel: string;
  tiempo: string;
  preguntas: number;
}

const Test: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = React.useState<'indicaciones' | 'pruebas' | 'reportes'>('indicaciones');

  // Data for tests
  const pruebasNinos: PruebasNinos[] = [
    {
      id: 1,
      nombre: 'Pro-Cálculo para 6 años',
      descripcion: 'Ejercicios básicos de sumas y restas con apoyo visual para primeros aprendizajes.',
      enlace: '/test/Calculos/ProCalculo6',
      icon: <FaChild size={32} />,
      color: '#006633',
      nivel: 'Inicial',
      tiempo: '20 minutos',
      preguntas: 10
    },
    {
      id: 2,
      nombre: 'Pro-Cálculo para 7 años',
      descripcion: 'Operaciones matemáticas con lógica sencilla y problemas cotidianos.',
      enlace: '/test/Calculos/pro-calculo-7',
      icon: <FaCalculator size={32} />,
      color: '#009955',
      nivel: 'Intermedio',
      tiempo: '25 minutos',
      preguntas: 15
    },
    {
      id: 3,
      nombre: 'Pro-Cálculo para 8 años',
      descripcion: 'Desafíos matemáticos con múltiples pasos y ejercicios interactivos avanzados.',
      enlace: '/test/Calculos/pro-calculo-8',
      icon: <FaGraduationCap size={32} />,
      color: '#007744',
      nivel: 'Avanzado',
      tiempo: '30 minutos',
      preguntas: 20
    },
  ];

  // Data for features
  const features: Feature[] = [
    {
      title: "Aprendizaje Adaptativo",
      description: "Dificultad que se ajusta al ritmo del niño",
      icon: <FaLightbulb className={styles.featureIcon} />,
      color: "#006633"
    },
    {
      title: "Retroalimentación Inmediata",
      description: "Explicaciones claras para cada respuesta",
      icon: <FaStar className={styles.featureIcon} />,
      color: "#009955"
    },
    {
      title: "Diseño Motivacional",
      description: "Sistema de recompensas y logros",
      icon: <FaSmile className={styles.featureIcon} />,
      color: "#FFCE00"
    }
  ];

  // Header Section Component
  const HeaderSection = React.memo(() => (
    <section className={styles.titleSection} style={{ width: '100%' }}>
      <div className={styles.logoContainer}>
        <img 
          src="/img/test.png" 
          alt="Logo de Media Lab" 
          className={styles.logo}
        />
      </div>
      <p className={styles.subtitle}>
        Transformando el aprendizaje matemático en una aventura
      </p>
    </section>
  ));

  // Navigation Tabs Component
  const NavigationTabs = React.memo(() => (
    <nav className={styles.navTabs}>
      <button
        className={`${styles.tab} ${activeTab === 'indicaciones' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('indicaciones')}
      >
        <span className={styles.tabContent}>
          <FaLightbulb className={styles.tabIcon} />
          Indicaciones
        </span>
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'pruebas' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('pruebas')}
      >
        <span className={styles.tabContent}>
          <FaBrain className={styles.tabIcon} />
          Pruebas para niños
        </span>
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'reportes' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('reportes')}
      >
        <span className={styles.tabContent}>
          <FaChartLine className={styles.tabIcon} />
          Reportes
        </span>
      </button>
    </nav>
  ));

  // Indicaciones Section Component
  const IndicacionesSection = React.memo(() => (
    <section className={styles.indicacionesSection}>
      <div className={styles.heroBanner}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>🌟</span> Descubre el poder de las matemáticas
        </h2>
        <p className={styles.introText}>
          ¡Bienvenido a <b>Pro-Cálculo</b>! Una experiencia interactiva diseñada para hacer del aprendizaje matemático 
          una aventura llena de diversión y descubrimientos.
        </p>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div
            key={index}
            className={styles.featureCard}
            style={{ borderTopColor: feature.color }}
          >
            <div className={styles.featureIconContainer} style={{ color: feature.color }}>
              {feature.icon}
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.instructionsGrid}>
        <div className={styles.instructionCard}>
          <div className={styles.instructionHeader}>
            <FaRegEye className={styles.instructionIcon} style={{ color: "#006633" }} />
            <h3>Observa con atención</h3>
          </div>
          <p className={styles.instructionText}>
            Cada pregunta es una oportunidad para aprender. Lee cuidadosamente y analiza antes de responder.
          </p>
          <div className={styles.instructionImageContainer}>
            <img src="/img/Observa.jpg" alt="Niño observando" className={styles.instructionImage} />
          </div>
        </div>

        <div className={styles.instructionCard}>
          <div className={styles.instructionHeader}>
            <FaBrain className={styles.instructionIcon} style={{ color: "#009955" }} />
            <h3>Desarrolla tu pensamiento</h3>
          </div>
          <p className={styles.instructionText}>
            Intenta resolver los problemas por ti mismo. El error es parte del aprendizaje.
          </p>
          <div className={styles.instructionImageContainer}>
            <img src="/img/Piensa.jpg" alt="Niño pensando" className={styles.instructionImage} />
          </div>
        </div>

        <div className={styles.instructionCard}>
          <div className={styles.instructionHeader}>
            <FaStar className={styles.instructionIcon} style={{ color: "#FFCE00" }} />
            <h3>Disfruta el proceso</h3>
          </div>
          <p className={styles.instructionText}>
            Celebra cada acierto y aprende de cada desafío. ¡La diversión está garantizada!
          </p>
          <div className={styles.instructionImageContainer}>
            <img src="/img/Disfruta.jpg" alt="Niños celebrando" className={styles.instructionImage} />
          </div>
        </div>
      </div>

      <div className={styles.ctaContainer}>
        <button
          className={styles.startTestButton}
          onClick={() => setActiveTab('pruebas')}
        >
          <FaPlay className={styles.buttonIcon} />
          <span>¡Comienza tu aventura matemática!</span>
          <FaArrowRight className={styles.buttonArrow} />
        </button>
      </div>
    </section>
  ));

  // Pruebas Section Component
  const PruebasSection = React.memo(() => (
    <section className={styles.pruebasSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>📚</span> Elige tu desafío matemático
        </h2>
        <p className={styles.sectionSubtitle}>
          Selecciona una prueba acorde a tu edad o nivel de conocimiento
        </p>
      </div>

      <div className={styles.pruebasGrid}>
        {pruebasNinos.map((prueba) => (
          <article
            key={prueba.id}
            className={styles.pruebaCard}
            style={{ borderTop: `5px solid ${prueba.color}` }}
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

            <a
              href={prueba.enlace}
              className={styles.startTestButton}
              style={{ backgroundColor: prueba.color }}
            >
              Comenzar
              <FaArrowRight className={styles.buttonArrow} />
            </a>
          </article>
        ))}
      </div>
    </section>
  ));

  // Reports Section Component - ahora vacío para tu implementación
  const ReportsSection = React.memo(() => (
    <section className={styles.reportsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>📊</span> Reportes
        </h2>
        <p className={styles.sectionSubtitle}>
          Aquí puedes ver y gestionar los reportes generados
        </p>
      </div>

      <div className={styles.reportsContent}>
        {/* Espacio reservado para tu implementación de base de datos */}
        <div className={styles.databasePlaceholder}>
          <p>Conecta tu base de datos aquí para mostrar los reportes</p>
          {/* Puedes reemplazar este contenido con tu implementación real */}
        </div>
      </div>
    </section>
  ));

  // Main Component Rendering
  return (
    <main className={styles.mediaContainer} style={{ width: '100vw', overflowX: 'hidden' }}>
      <HeaderSection />
      <NavigationTabs />
      
      <div className={styles.contentContainer} style={{ maxWidth: '100%', padding: '1rem', boxSizing: 'border-box' }}>
        {activeTab === 'indicaciones' && <IndicacionesSection />}
        {activeTab === 'pruebas' && <PruebasSection />}
        {activeTab === 'reportes' && <ReportsSection />}
      </div>
    </main>
  );
};

export default Test;