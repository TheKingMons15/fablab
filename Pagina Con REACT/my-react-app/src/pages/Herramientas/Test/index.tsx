import React, { JSX, useEffect, useState } from 'react';
import { FaBrain, FaRegEye, FaLightbulb, FaStar, FaPlay, FaArrowRight, FaChild, FaCalculator, FaClock, FaSmile, FaGraduationCap, FaChartLine, FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
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
  nombres: string;
  apellidos: string;
  edad: number;
  genero: string;
  curso: string;
  institucion: string;
  test_tipo: string;
  puntuacion_total: number;
  fecha_registro: string;
  fecha_test: string;
}

const Test: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'indicaciones' | 'pruebas' | 'reportes'>('indicaciones');

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

  // Reports Section Component - Implementación completa
  const ReportsSection = React.memo(() => {
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
      search: '',
      testType: '',
      gender: '',
      minAge: '',
      maxAge: '',
      sortBy: 'fecha_test',
      sortOrder: 'desc'
    });
    const [stats, setStats] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const fetchReportes = async () => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.testType) queryParams.append('testType', filters.testType);
    if (filters.gender) queryParams.append('gender', filters.gender);
    if (filters.minAge) queryParams.append('minAge', filters.minAge);
    if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const response = await fetch(`https://fablab.upec.edu.ec/procalculo-api/reportes?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener los reportes');
    }

    const data = await response.json();
    
    // Mapear los datos para que coincidan con lo que espera tu frontend
    const mappedData = data.data.map((item: any) => ({
      id: item.id,
      nombres: item.nombres,
      apellidos: item.apellidos,
      edad: item.edad,
      genero: item.genero,
      curso: item.curso,
      institucion: item.institucion,
      test_tipo: item.test_tipo, // Usamos el valor directamente de la BD
      puntuacion_total: item.puntuacion_total,
      fecha_registro: item.fecha_registro,
      fecha_test: item.fecha_test
    }));
    
    setReportes(mappedData);
    setError(null);
  } catch (err) {
    const error = err as Error;
    setError(error.message || 'Error al cargar los reportes');
    console.error('Error fetching reportes:', error);
  } finally {
    setLoading(false);
  }
};

    const fetchStats = async () => {
  try {
    const response = await fetch('https://fablab.upec.edu.ec/procalculo-api/estadisticas');
    
    if (!response.ok) {
      throw new Error('Error al obtener las estadísticas');
    }

    const data = await response.json();
    setStats(data.data);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching stats:', error);
  }
};

    useEffect(() => {
      if (activeTab === 'reportes') {
        fetchReportes();
        fetchStats();
      }
    }, [activeTab, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSort = (column: string) => {
      setFilters(prev => ({
        ...prev,
        sortBy: column,
        sortOrder: prev.sortBy === column ? (prev.sortOrder === 'asc' ? 'desc' : 'asc') : 'desc'
      }));
    };

    const renderSortIcon = (column: string) => {
      if (filters.sortBy !== column) return <FaSort />;
      return filters.sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const resetFilters = () => {
      setFilters({
        search: '',
        testType: '',
        gender: '',
        minAge: '',
        maxAge: '',
        sortBy: 'fecha_test',
        sortOrder: 'desc'
      });
    };

    return (
      <section className={styles.reportsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleHighlight}>📊</span> Reportes de Resultados
          </h2>
          <p className={styles.sectionSubtitle}>
            Visualiza y filtra los resultados de las pruebas realizadas
          </p>
        </div>

        <div className={styles.reportsControls}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              name="search"
              placeholder="Buscar por nombre, apellido o institución..."
              value={filters.search}
              onChange={handleFilterChange}
              className={styles.searchInput}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterButton}
          >
            <FaFilter /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>

          {showFilters && (
            <div className={styles.filtersContainer}>
              <div className={styles.filterGroup}>
                <label>Tipo de Test:</label>
                <select
                  name="testType"
                  value={filters.testType}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">Todos</option>
                  <option value="ProCálculo6">ProCálculo6</option>
                  <option value="ProCálculo7">ProCálculo7</option>
                  <option value="ProCálculo8">ProCálculo8</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Género:</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">Todos</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Edad:</label>
                <div className={styles.ageRange}>
                  <input
                    type="number"
                    name="minAge"
                    placeholder="Mín"
                    value={filters.minAge}
                    onChange={handleFilterChange}
                    className={styles.ageInput}
                  />
                  <span>a</span>
                  <input
                    type="number"
                    name="maxAge"
                    placeholder="Máx"
                    value={filters.maxAge}
                    onChange={handleFilterChange}
                    className={styles.ageInput}
                  />
                </div>
              </div>

              <button onClick={resetFilters} className={styles.resetButton}>
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Cargando reportes...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={fetchReportes} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className={styles.statsContainer}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <h3>{stat.test_tipo} ({stat.genero === 'M' ? '♂' : '♀'})</h3>
                  <p>Total: {stat.total}</p>
                  <p>Promedio: {Math.round(stat.promedio)}</p>
                  <p>Mín: {stat.minima}</p>
                  <p>Máx: {stat.maxima}</p>
                </div>
              ))}
            </div>

            <div className={styles.reportsTableContainer}>
              <table className={styles.reportsTable}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('nombres')}>
                      <div className={styles.sortableHeader}>
                        Nombre {renderSortIcon('nombres')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('apellidos')}>
                      <div className={styles.sortableHeader}>
                        Apellido {renderSortIcon('apellidos')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('edad')}>
                      <div className={styles.sortableHeader}>
                        Edad {renderSortIcon('edad')}
                      </div>
                    </th>
                    <th>Género</th>
                    <th>Curso</th>
                    <th>Institución</th>
                    <th onClick={() => handleSort('test_tipo')}>
                      <div className={styles.sortableHeader}>
                        Test {renderSortIcon('test_tipo')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('puntuacion_total')}>
                      <div className={styles.sortableHeader}>
                        Puntaje {renderSortIcon('puntuacion_total')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('fecha_test')}>
                      <div className={styles.sortableHeader}>
                        Fecha {renderSortIcon('fecha_test')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.length > 0 ? (
                    reportes.map((reporte) => (
                      <tr key={reporte.id}>
                        <td>{reporte.nombres}</td>
                        <td>{reporte.apellidos}</td>
                        <td>{reporte.edad}</td>
                        <td>{reporte.genero === 'M' ? '♂' : '♀'}</td>
                        <td>{reporte.curso}</td>
                        <td>{reporte.institucion}</td>
                        <td>{reporte.test_tipo}</td>
                        <td>{reporte.puntuacion_total}</td>
                        <td>{new Date(reporte.fecha_test).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className={styles.noResults}>
                        No se encontraron resultados con los filtros actuales
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    );
  });

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