import React, { useState, useEffect } from 'react';
import styles from './Diseno.module.css';
import { GiLaserPrecision } from 'react-icons/gi';
import { RiComputerFill } from 'react-icons/ri';
import { SiCncf } from 'react-icons/si';
import { AiOutlineBoxPlot } from 'react-icons/ai';
import { AiFillHome } from 'react-icons/ai';

const LabDiseno: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'equipos' | 'proyectos'>('inicio');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Imágenes para el carrusel
  const carouselImages = [
    "/img/diseño/IMG_9497.JPG",
    "/img/diseño/IMG_9622.JPG",
    "/img/diseño/IMG_9627.JPG",
    "/img/diseño/IMG_9605.JPG"
  ];
  
  // Efecto para el carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000); // Cambio de imagen cada 3 segundos
    
    return () => clearInterval(interval);
  }, []);

  const equipmentItems = [
    {
      nombre: "CNC Formato Completo",
      icono: <SiCncf className={styles.equipmentIcon} />,
      imagen: "/img/CNC-Formato-Completo.jpg",
      descripcion: "Es un equipo automatizado que utiliza instrucciones programadas por computadora para realizar operaciones de mecanizado con alta precisión. Aquí te presento una descripción detallada."
    },
    {
      nombre: "Corte Laser Mediana",
      icono: <GiLaserPrecision className={styles.equipmentIcon} />,
      imagen: "/img/Corte-Laser-Mediana.jpg",
      descripcion: " Utiliza un láser para cortar y grabar materiales como madera, acrilico, cartón y tela."
    },
    {
      nombre: "Plotters",
      icono: <AiOutlineBoxPlot className={styles.equipmentIcon} />,
      imagen: "/img/Plotters.jpg",
      descripcion: "Dispositivos de salida que utilizan para imprimir gráficos vectoriales y dibujos lineales con alta precisión"
    },
    {
      nombre: "Laminadura de vinilo",
      icono: <RiComputerFill className={styles.equipmentIcon} />,
      imagen: "/img/Laminadura-de-vinilo.jpg",
      descripcion: "Aplica una capa protectora de vinilo sobre una superficie impresa."
    }
  ];

  const proyectos = [
    {
      nombre: 'Prototipo Sistemas de Riego Sostenible',
      enlace: '#',
      estado: 'En desarrollo'
    },
    {
      nombre: 'Dispositivos IoT para Campus Inteligente',
      enlace: '#',
      estado: 'Fase de pruebas'
    },
    {
      nombre: 'Mobiliario Ergonómico para Bibliotecas',
      enlace: '#',
      estado: 'Finalizado'
    },
    {
      nombre: 'Maquetas Arquitectónicas Sustentables',
      enlace: '#',
      estado: 'En planificación'
    }
  ];

  return (
    <main className={styles.mediaContainer}>
      <nav className={styles.navTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'inicio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          <AiFillHome className={styles.homeIcon} /> Inicio
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'equipos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('equipos')}
        >
          Equipos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'proyectos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('proyectos')}
        >
          Proyectos
        </button>
      </nav>
      
      <div className={styles.contentContainer}>
        {activeTab === 'inicio' && (
          <section className={styles.homeSection}>
            <div className={styles.homeHeader}>
              <div className={styles.logoContainer}>
                <img src="/img/Diseñoyestructura.png" alt="Logo de FabLab" className={styles.homeLogo} />
              </div>
              <div className={styles.carouselContainer}>
                {carouselImages.map((image, index) => (
                  <div 
                    key={index}
                    className={styles.carouselSlide}
                    style={{
                      opacity: currentSlide === index ? 1 : 0,
                      transition: 'opacity 0.8s ease-in-out'
                    }}
                  >
                    <img src={image} alt={`Imagen del FabLab ${index + 1}`} className={styles.carouselImage} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.homeContent}>
              <h1 className={styles.homeTitle}>Diseño y Estructura</h1>
              <p className={styles.homeDescription}>
                Bienvenido al FabLab Universitario, un espacio de fabricación digital donde convergen la tecnología, 
                la innovación y el aprendizaje colaborativo. Nuestro laboratorio está equipado con herramientas de 
                vanguardia para dar vida a tus ideas y proyectos académicos.
              </p>
              <p className={styles.homeDescription}>
                Como parte integral de la universidad, nuestro FabLab ofrece recursos y conocimientos técnicos 
                para estudiantes de todas las disciplinas, promoviendo la experimentación, el prototipado rápido 
                y el desarrollo de soluciones creativas a problemas reales.
              </p>
            </div>
          </section>
        )}
        
        {activeTab === 'equipos' && (
          <section className={styles.equipmentSection}>
            <h2 className={styles.sectionTitle}>Equipamiento del FabLab</h2>
            <div className={styles.equipmentGrid}>
              {equipmentItems.map((equipo) => (
                <article key={equipo.nombre} className={styles.equipmentCard}>
                  <div className={styles.cardHeader}>
                    {equipo.icono}
                    <h3 className={styles.equipmentName}>{equipo.nombre}</h3>
                  </div>
                  <div className={styles.imageContainer}>
                    <img
                      src={equipo.imagen || "/img/equipment-placeholder.jpg"}
                      alt={equipo.nombre}
                      className={styles.equipmentImage}
                      loading="lazy"
                    />
                  </div>
                  <p className={styles.equipmentDescription}>{equipo.descripcion}</p>
                  <button className={styles.detailsButton}>
                    Ver especificaciones técnicas
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        
        {activeTab === 'proyectos' && (
          <section className={styles.projectsSection}>
            <h2 className={styles.sectionTitle}>Proyectos Académicos</h2>
            <div className={styles.projectsContainer}>
              <div className={styles.projectsTable}>
                <table className={styles.responsiveTable}>
                  <thead>
                    <tr>
                      <th>Proyecto</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.map((proyecto) => (
                      <tr key={proyecto.nombre}>
                        <td>{proyecto.nombre}</td>
                        <td>
                          <span className={`${styles.status} ${styles[proyecto.estado.toLowerCase().replace(/\s+/g, '')]}`}>
                            {proyecto.estado}
                          </span>
                        </td>
                        <td>
                          <a href={proyecto.enlace} className={styles.projectLink}>
                            Ver detalles
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.projectsInfo}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Participa en el FabLab</h3>
                  <p className={styles.infoText}>
                    Nuestro FabLab universitario está abierto a estudiantes, docentes e investigadores
                    que deseen desarrollar proyectos innovadores utilizando nuestras instalaciones.
                  </p>
                  <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>20+</span>
                      <span className={styles.statLabel}>Facultades participantes</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>75+</span>
                      <span className={styles.statLabel}>Proyectos académicos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default LabDiseno;