import React, { JSX, useState } from 'react';
import { FaBrain, FaRegEye, FaLightbulb, FaStar, FaPlay, FaArrowRight, FaChild, FaCalculator, FaClock, FaSmile, FaGraduationCap, FaChartLine, FaLock } from 'react-icons/fa';
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

interface Reporte {
  id: number;
  estudiante: string;
  prueba: string;
  fecha: string;
  puntaje: number;
  nivel: string;
}

const Test: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'indicaciones' | 'pruebas' | 'reportes'>('indicaciones');
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lista de correos autorizados
  const authorizedEmails = [
    'admin@procalculo.com',
    'profesor@escuela.com',
    'director@educacion.com'
  ];

  // Datos de ejemplo para reportes
  const reportes: Reporte[] = [
    {
      id: 1,
      estudiante: 'Juan Pérez',
      prueba: 'Pro-Cálculo para 6 años',
      fecha: '2023-05-15',
      puntaje: 85,
      nivel: 'Avanzado'
    },
    {
      id: 2,
      estudiante: 'María Gómez',
      prueba: 'Pro-Cálculo para 7 años',
      fecha: '2023-05-16',
      puntaje: 72,
      nivel: 'Intermedio'
    },
    {
      id: 3,
      estudiante: 'Carlos Ruiz',
      prueba: 'Pro-Cálculo para 8 años',
      fecha: '2023-05-17',
      puntaje: 90,
      nivel: 'Avanzado'
    },
  ];

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

  // Función para verificar acceso
  const checkAccess = () => {
    setLoading(true);
    // Simulación de verificación asíncrona
    setTimeout(() => {
      const authorized = authorizedEmails.includes(email.toLowerCase().trim());
      setIsAuthorized(authorized);
      setLoading(false);
    }, 1000);
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthorized(false);
    setEmail('');
    setActiveTab('indicaciones');
  };

  // Header Section Component
  const HeaderSection = () => (
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
  );

  // Navigation Tabs Component
  const NavigationTabs = () => (
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
  );

  // Indicaciones Section Component
  const IndicacionesSection = () => (
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
  );

  // Pruebas Section Component
  const PruebasSection = () => (
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
  );

  // Reportes Section Component
  const ReportesSection = () => {
    if (!isAuthorized) {
      return (
        <section className={styles.reportesSection}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authHeader}>
                <FaLock size={32} className={styles.authIcon} />
                <h2>Acceso restringido</h2>
                <p>Ingrese su correo electrónico autorizado para ver los reportes</p>
              </div>
              
              <div className={styles.authForm}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@autorizado.com"
                  className={styles.authInput}
                />
                <button
                  onClick={checkAccess}
                  disabled={loading}
                  className={styles.authButton}
                >
                  {loading ? 'Verificando...' : 'Acceder'}
                </button>
              </div>
              
              {loading && <div className={styles.loadingSpinner}></div>}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className={styles.reportesSection}>
        <div className={styles.reportesHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleHighlight}>📊</span> Reportes de Resultados
            </h2>
            <p className={styles.sectionSubtitle}>
              Visualiza el desempeño de los estudiantes en las pruebas
            </p>
          </div>
          <button onClick={logout} className={styles.logoutButton}>
            Cerrar sesión
          </button>
        </div>
        
        <div className={styles.reportesTableContainer}>
          <table className={styles.reportesTable}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Prueba</th>
                <th>Fecha</th>
                <th>Puntaje</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.id}>
                  <td>{reporte.estudiante}</td>
                  <td>{reporte.prueba}</td>
                  <td>{reporte.fecha}</td>
                  <td>
                    <div className={styles.scoreBar} style={{ width: `${reporte.puntaje}%` }}>
                      {reporte.puntaje}%
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.nivelBadge} ${
                      reporte.nivel === 'Avanzado' ? styles.avanzado :
                      reporte.nivel === 'Intermedio' ? styles.intermedio : styles.basico
                    }`}>
                      {reporte.nivel}
                    </span>
                  </td>
                  <td>
                    <button className={styles.detailsButton}>
                      Ver detalles <FaArrowRight />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={styles.reportesActions}>
          <button className={styles.exportButton}>
            Exportar a Excel
          </button>
          <button className={styles.filterButton}>
            Filtrar resultados
          </button>
        </div>
      </section>
    );
  };

  // Main Component Rendering
  return (
    <main className={styles.mediaContainer} style={{ width: '100vw', overflowX: 'hidden' }}>
      <HeaderSection />
      <NavigationTabs />
      
      <div className={styles.contentContainer} style={{ maxWidth: '100%', padding: '1rem', boxSizing: 'border-box' }}>
        {activeTab === 'indicaciones' && <IndicacionesSection />}
        {activeTab === 'pruebas' && <PruebasSection />}
        {activeTab === 'reportes' && <ReportesSection />}
      </div>
    </main>
  );
};

export default Test;