import { useState, useEffect } from 'react';
import styles from './fablab.module.css';
import { Gi3dMeeple, GiVideoConference } from 'react-icons/gi';
import { FaHome, FaTools, FaProjectDiagram } from 'react-icons/fa';

const FabLab = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'equipos' | 'proyectos'>('inicio');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array de imágenes para el carrusel
  const carouselImages = [
    {
      src: "/img/fab/IMG_9552.JPG",
      alt: "Espacio principal del FabLab"
    },
    {
      src: "/img/fab/IMG_9566.JPG", // Asumiendo que existe esta imagen
      alt: "Área de trabajo del FabLab"
    },
    {
      src: "/img/fab/IMG_9610.JPG", // Asumiendo que existe esta imagen
      alt: "Equipamiento del FabLab"
    }
  ];

  // Cambia automáticamente las imágenes cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, []);
  
  const equipmentItems = [
    {
      nombre: "Impresora 3D Anycubic",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/anycubit.jpg",
      descripcion: "Estas impresoras utilizan resina líquida fotosensible que se solidifica mediante luz UV para crear objetos tridimensionales."
    },
    {
      nombre: "Impresora 3D BambuLab Carbon",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/Impresora-3D-BambuLab-Carbo.jpg",
      descripcion: "En la impresión 3D de resina, la placa de construcción es la plataforma donde se adhiere la primera capa del objeto impreso."
    },
    {
      nombre: "Impresora 3D con Resina 14K",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/Impresora-3D-con-Resina-14K.jpg",
      descripcion: "Estas resinas se utilizan en joyería y prototipos donde se desea un aspecto similar al oro."
    },
    {
      nombre: "Secadora de Filamento",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/Secadora-de-Filamento.jpg",
      descripcion: "Creality K1 Impresora 3D rápida + caja secadora de filamentos."
    },
    {
      nombre: "Lavadora de Resina",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/Lavadora-de-Resina.jpg",
      descripcion: "Equipo especializado para el proceso de limpieza y curado de piezas impresas en resina."
    },
    {
      nombre: "CNC Mediana",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/CNC-Mediana.jpg",
      descripcion: "Fresadora CNC de tamaño mediano para trabajos de precisión en madera, acrílico y más."
    },
    {
      nombre: "Grabado Láser de Escritorio Falcon 2",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/Grabado-Láser-de-Escritorio-Falcon-2.jpg",
      descripcion: "Creality Falcon 2, equipo compacto de corte y grabado láser de alta precisión."
    },
    {
      nombre: "Sublimadora",
      icono: <Gi3dMeeple className={styles.equipmentIcon} />,
      imagen: "/img/Sublimadora.jpg",
      descripcion: "Equipo para sublimación en textiles, tazas y otros materiales personalizados."
    },
    {
      nombre: "Salón de Video Conferencia",
      icono: <GiVideoConference className={styles.equipmentIcon} />,
      imagen: "/img/Salon.jpg",
      descripcion: "Espacio diseñado y equipado para facilitar la comunicación remota en tiempo real."
    }
  ];

  const proyectos = [
    {
      nombre: 'Documental "Voces Urbanas"',
      enlace: '#',
      estado: 'En producción'
    },
    {
      nombre: 'Campaña "Conserva lo Nuestro"',
      enlace: '#',
      estado: 'Postproducción'
    },
    {
      nombre: 'Serie Web "Tecnología Creativa"',
      enlace: '#',
      estado: 'Finalizado'
    }
  ];


  return (
    <main className={styles.mediaContainer}>
      {/* Navegación centrada en la parte superior */}
      <section className={styles.headerSection}>
        <nav className={styles.navTabsCenter}>
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
            <FaProjectDiagram className={styles.tabIcon} /> Proyectos
          </button>
        </nav>
      </section>
      
      <div className={styles.contentContainer}>
        {activeTab === 'inicio' && (
          <section className={styles.inicioSection}>
            {/* Nueva estructura con logo a la izquierda y carrusel a la derecha */}
            <div className={styles.inicioHeader}>
              <div className={styles.logoContainer}>
                <img src="/img/fablab.png" alt="Logo de Fab Lab" className={styles.logoLeft} />
              </div>
              <div className={styles.headerImageContainer}>
                {/* Carrusel simple sin botones ni indicadores */}
                <div className={styles.simpleCarousel}>
                  <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {carouselImages.map((image, index) => (
                      <div className={styles.carouselSlide} key={index}>
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          className={styles.carouselImage} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.inicioDescription}>
              <div className={styles.descripcionText}>
                <h2 className={styles.inicioTitle}>Bienvenidos al FabLab</h2>
                <p className={styles.inicioSubtitle}>
                  Espacio de innovación, fabricación digital y prototipado rápido
                </p>
                
                <h3>¿Qué es FabLab?</h3>
                <p>
                  Nuestro Laboratorio de Fabricación (FabLab) es un espacio de creación equipado con tecnología 
                  de vanguardia para el diseño y fabricación digital. Contamos con impresoras 3D, cortadoras láser, 
                  fresadoras CNC y más equipamiento especializado para dar vida a tus ideas.
                </p>
                <p>
                  Somos parte de la red global de FabLabs, compartiendo conocimiento y siguiendo los principios 
                  de innovación abierta, colaboración y aprendizaje práctico.
                </p>
                
                <h3>Servicios que ofrecemos</h3>
                <ul className={styles.serviciosList}>
                  <li>Impresión 3D en diversos materiales</li>
                  <li>Corte y grabado láser</li>
                  <li>Fresado CNC para materiales como madera y acrílico</li>
                  <li>Asesoría técnica en diseño para fabricación digital</li>
                  <li>Talleres y capacitaciones</li>
                  <li>Espacio de coworking para proyectos creativos</li>
                </ul>
              </div>
            </div>
          </section>
        )}
        
        {activeTab === 'equipos' && (
          <section className={styles.equipmentSection}>
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
        
        {activeTab === 'proyectos' && (
          <section className={styles.projectsSection}>
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
                  <h3 className={styles.infoTitle}>¿Cómo participar?</h3>
                  <p className={styles.infoText}>
                    Explora nuestros proyectos activos y descubre cómo puedes
                    contribuir con tu talento creativo.
                  </p>
                  <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>15+</span>
                      <span className={styles.statLabel}>Proyectos activos</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>50+</span>
                      <span className={styles.statLabel}>Colaboradores</span>
                    </div>
                  </div>
                  <button className={styles.ctaButton}>
                    Unirse a la comunidad
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default FabLab;