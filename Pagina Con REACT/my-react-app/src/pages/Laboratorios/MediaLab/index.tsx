import React, { useState } from 'react';
import { FaCamera, FaVideo, FaMicrophoneAlt, FaHome, FaTools, FaCode, FaCubes } from 'react-icons/fa';
import styles from './MediaLab.module.css';

const MediaLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'equipos' | 'laboratorios'>('inicio');

  const equipmentItems = [
    {
      nombre: "Cámara Canon T5",
      icono: <FaCamera className={styles.equipmentIcon} />,
      imagen: "/img/Canon-T5.jpg",
      descripcion: "Cámara réflex digital con sensor APS-C de 18MP"
    },
    {
      nombre: "Cámara Canon 80D",
      icono: <FaVideo className={styles.equipmentIcon} />,
      imagen: "/img/CANON_80D.jpg",
      descripcion: "Cámara DSLR con grabación 4K y pantalla táctil articulada"
    },
    {
      nombre: "Mezcladora de Audio",
      icono: <FaMicrophoneAlt className={styles.equipmentIcon} />,
      imagen: "/img/Mezclaora.jpg",
      descripcion: "Consola de mezclas profesional de 12 canales"
    },
    {
      nombre: "Dron DJI Phantom",
      icono: <FaCamera className={styles.equipmentIcon} />,
      imagen: "/img/DRON.jpg",
      descripcion: "Dron 4K con estabilización triple eje y control remoto"
    }
  ];

  const laboratorios = [
    {
      nombre: 'Laboratorio de Impresión 3D',
      icono: <FaCubes size={24} />,
      descripcion: 'Espacio equipado con impresoras 3D de última generación para prototipado rápido y fabricación digital.',
      enlace: '#',
      estado: 'Abierto'
    },
    {
      nombre: 'Laboratorio de Electrónica',
      icono: <FaTools size={24} />,
      descripcion: 'Herramientas y componentes para desarrollo de circuitos electrónicos y proyectos IoT.',
      enlace: '#',
      estado: 'Abierto'
    },
    {
      nombre: 'Laboratorio de Programación',
      icono: <FaCode size={24} />,
      descripcion: 'Estaciones de trabajo equipadas para desarrollo de software y aplicaciones interactivas.',
      enlace: '#',
      estado: 'En mantenimiento'
    }
  ];

  return (
    <main className={styles.mediaContainer}>
      <nav className={styles.navTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'inicio' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          <FaHome size={16} />
          <span>Inicio</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'equipos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('equipos')}
        >
          <FaCamera size={16} />
          <span>Equipos</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'laboratorios' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('laboratorios')}
        >
          <FaTools size={16} />
          <span>Laboratorios</span>
        </button>
      </nav>
      
      <div className={styles.contentContainer}>
        {activeTab === 'inicio' && (
          <section className={styles.homeSection}>
            <div className={styles.homeHeader}>
              <div className={styles.logoContainer}>
                <img src="/img/Medialab.png" alt="Logo de Media Lab" className={styles.homeLogo} />
              </div>
              <div className={styles.heroImageContainer}>
                <img src="/img/IMG_9648.JPG" alt="FabLab en acción" className={styles.heroImage} />
              </div>
            </div>
            
            <div className={styles.homeContent}>
              <h1 className={styles.mainTitle}>MEDIALAB</h1>
              <h2 className={styles.subtitle}>Centro de Fabricación Digital Universitario</h2>
              
              <div className={styles.infoBlocks}>
                <div className={styles.infoBlock}>
                  <h3>¿Qué es MEDIALAB?</h3>
                  <p>
                    MEDIALAB es un espacio de innovación y creatividad que combina tecnología multimedia y fabricación digital. 
                    Nuestro FabLab universitario ofrece acceso a herramientas avanzadas de prototipado, impresión 3D, 
                    producción audiovisual y desarrollo de proyectos multidisciplinarios.
                  </p>
                </div>
                
                <div className={styles.infoBlock}>
                  <h3>Nuestra Misión</h3>
                  <p>
                    Fomentar la innovación tecnológica, el aprendizaje colaborativo y el desarrollo de proyectos 
                    que respondan a necesidades reales de nuestra comunidad, equipando a los estudiantes con las 
                    herramientas y conocimientos necesarios para afrontar los retos del futuro.
                  </p>
                </div>
              </div>
              
              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>15+</span>
                  <span className={styles.statLabel}>Equipos disponibles</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>3</span>
                  <span className={styles.statLabel}>Laboratorios especializados</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>50+</span>
                  <span className={styles.statLabel}>Proyectos realizados</span>
                </div>
              </div>
              
              <button className={styles.ctaButton}>
                Reservar espacio
              </button>
            </div>
          </section>
        )}
        
        {activeTab === 'equipos' && (
          <section className={styles.equipmentSection}>
            <h2 className={styles.sectionTitle}>Nuestro Equipo Multimedia</h2>
            <div className={styles.equipmentGrid}>
              {equipmentItems.map((equipo) => (
                <article key={equipo.nombre} className={styles.equipmentCard}>
                  <div className={styles.cardHeader}>
                    {equipo.icono}
                    <h3 className={styles.equipmentName}>{equipo.nombre}</h3>
                  </div>
                  <div className={styles.imageContainer}>
                    <img
                      src={equipo.imagen}
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
        
        {activeTab === 'laboratorios' && (
          <section className={styles.labsSection}>
            <h2 className={styles.sectionTitle}>Laboratorios Especializados</h2>
            <p className={styles.labsIntro}>
              Nuestros laboratorios están equipados con tecnología de punta para apoyar proyectos de investigación,
              desarrollo e innovación en diversas áreas del conocimiento.
            </p>
            
            <div className={styles.labsGrid}>
              {laboratorios.map((lab) => (
                <article key={lab.nombre} className={styles.labCard}>
                  <div className={styles.labHeader}>
                    <div className={styles.labIcon}>{lab.icono}</div>
                    <h3 className={styles.labName}>{lab.nombre}</h3>
                    <span className={`${styles.labStatus} ${styles[lab.estado.toLowerCase().replace(' ', '')]}`}>
                      {lab.estado}
                    </span>
                  </div>
                  
                  <p className={styles.labDescription}>{lab.descripcion}</p>
                  
                  <div className={styles.labFooter}>
                    <button className={styles.reserveButton}>
                      Reservar horario
                    </button>
                    <a href={lab.enlace} className={styles.labLink}>
                      Ver equipamiento
                    </a>
                  </div>
                </article>
              ))}
            </div>
            
            <div className={styles.labsInfo}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>¿Cómo utilizar nuestros laboratorios?</h3>
                <p className={styles.infoText}>
                  Los laboratorios del MEDIALAB están disponibles para estudiantes, docentes e investigadores 
                  de nuestra universidad. Para utilizarlos, debes contar con una capacitación básica y reservar 
                  con anticipación.
                </p>
                <div className={styles.scheduleInfo}>
                  <h4>Horarios de atención:</h4>
                  <ul className={styles.scheduleList}>
                    <li>Lunes a Viernes: 9:00 - 18:00</li>
                    <li>Sábados: 10:00 - 14:00</li>
                  </ul>
                </div>
                <button className={styles.ctaButton}>
                  Solicitar capacitación
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default MediaLab;