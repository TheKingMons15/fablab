import { useState, useEffect } from 'react';
import styles from './electronica.module.css';
import { SiCncf } from 'react-icons/si';
import { VscServerEnvironment } from 'react-icons/vsc';
import { GiMicroscope, GiSolderingIron } from 'react-icons/gi';
import { FaHome, FaShip, FaTools } from 'react-icons/fa';

const LabElectronica = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'equipos' | 'proyectos'>('inicio');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Imágenes para el carrusel
  const carouselImages = [
    "/img/elec/IMG_9546.JPG",
    "/img/elec/IMG_9542.JPG",
    "/img/elec/IMG_9535.JPG",
    "/img/elec/IMG_9507.JPG",
    "/img/elec/robotica.jpeg"
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
      nombre: "CNC pequeña",
      icono: <SiCncf className={styles.equipmentIcon} />,
      imagen: "/img/CNC-pequeña.jpg",
      descripcion: "es un equipo automatizado que utiliza instrucciones programadas por computadora para realizar operaciones de mecanizado con alta precisión. Aquí te presento una descripción detallada."
    },
    {
      nombre: "Microscopios",
      icono: <GiMicroscope className={styles.equipmentIcon} />,
      imagen: "/img/Microscopios.jpg",
      descripcion: "Utilizado para examinar la microestructura de los materiales."
    },
    {
      nombre: "Estacion de soladura de infrarojos",
      icono: <GiSolderingIron className={styles.equipmentIcon} />,
      imagen: "/img/estacion-de-soladura-de-infrarojos.jpg",
      descripcion: "Se utiliza para soldar y desoldar componentes de montaje superficial, la estacion emplea radiación infraroja paa calentar los componentes y la placa de circuitos impreso (PCB)."
    },
    {
      nombre: "Estacion de soldadura",
      icono: <GiSolderingIron className={styles.equipmentIcon} />,
      imagen: "/img/Estacion-de-soladura.jpg",
      descripcion: "Equipos para soldar componentes electronicos en placas de circuito impreso."
    },
    {
      nombre: "Servidores",
      icono: <VscServerEnvironment className={styles.equipmentIcon} />,
      imagen: "/img/Servidor.jpg",
      descripcion: "Servidores dedicados para alamcenamiento de datos, virtualizacion de entornos y desarrollo web."
    }
  ];

  const proyectos = [
    {
      nombre: 'Diseño e implementación de sistemas embebidos',
      enlace: '#',
      estado: 'En desarrollo'
    },
    {
      nombre: 'Prototipado rápido con Arduino y Raspberry Pi',
      enlace: '#',
      estado: 'Activo'
    },
    {
      nombre: 'IoT para Smart Campus',
      enlace: '#',
      estado: 'Finalizado'
    },
    {
      nombre: 'Fabricación digital de componentes electrónicos',
      enlace: '#',
      estado: 'En investigación'
    },
    {
      nombre: 'Robótica educativa para escuelas locales',
      enlace: '#',
      estado: 'Activo'
    }
  ];

  return (
    <main className={styles.mediaContainer}>
      <nav className={styles.navTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'inicio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          <FaHome className={styles.tabIcon} /> Inicio
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'equipos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('equipos')}
        >
          <FaTools className={styles.tabIcon} /> Equipos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'proyectos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('proyectos')}
        >
          <FaShip className={styles.tabIcon} /> Proyectos
        </button>
      </nav>
      
      <div className={styles.contentContainer}>
        {activeTab === 'inicio' && (
          <section className={styles.homeSection}>
            <div className={styles.homeHeader}>
              <div className={styles.logoContainer}>
                <img src="/img/Electronica.png" alt="Logo de Electrónica Lab" className={styles.homeLogo} />
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
                    <img src={image} alt={`Imagen del laboratorio ${index + 1}`} className={styles.carouselImage} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.homeContent}>
              <div className={styles.homeDescription}>
                <h2>Bienvenidos al FABLAB Electrónica</h2>
                <p>
                  Nuestro Laboratorio de Fabricación Digital y Electrónica universitario es un espacio dedicado al aprendizaje, experimentación 
                  y desarrollo de proyectos tecnológicos innovadores. Equipado con herramientas de última generación para diseño, 
                  prototipado y fabricación de sistemas electrónicos.
                </p>
                <p>
                  Ofrecemos acceso a equipamiento especializado, asesoría técnica y un entorno colaborativo donde estudiantes, 
                  profesores e investigadores pueden dar vida a sus ideas y proyectos tecnológicos.
                </p>
              </div>
            </div>
          </section>
        )}
        
        {activeTab === 'equipos' && (
          <section className={styles.equipmentSection}>
            <div className={styles.sectionTitle}>
              <h2>Nuestro Equipamiento</h2>
              <p>Herramientas y tecnologías disponibles para tus proyectos</p>
            </div>
            <div className={styles.equipmentGrid}>
              {equipmentItems.map((equipo) => (
                <article key={equipo.nombre} className={styles.equipmentCard}>
                  <div className={styles.cardHeader}>
                    {equipo.icono}
                    <h3 className={styles.equipmentName}>{equipo.nombre}</h3>
                  </div>
                  <div className={styles.imageContainer}>
                    <img
                      src={equipo.imagen || "/api/placeholder/300/200"}
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
            <div className={styles.sectionTitle}>
              <h2>Proyectos del FABLAB</h2>
              <p>Investigación, desarrollo e innovación tecnológica</p>
            </div>
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
                          <span className={`${styles.status} ${styles[proyecto.estado.toLowerCase().replace(' ', '')]}`}>
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
                  <h3 className={styles.infoTitle}>Participa en el FABLAB</h3>
                  <p className={styles.infoText}>
                    Únete a nuestros proyectos de investigación, desarrollo de prototipos 
                    o propón tu propia iniciativa tecnológica. Abierto a estudiantes, 
                    docentes e investigadores.
                  </p>
                  <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>12+</span>
                      <span className={styles.statLabel}>Proyectos activos</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>45+</span>
                      <span className={styles.statLabel}>Estudiantes involucrados</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>8+</span>
                      <span className={styles.statLabel}>Publicaciones académicas</span>
                    </div>
                  </div>
                  <div className={styles.actionButtons}>
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

export default LabElectronica;