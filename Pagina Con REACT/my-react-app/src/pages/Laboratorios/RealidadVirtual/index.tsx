import { useState } from 'react';
import styles from './realidad.module.css';
import {MdScanner } from 'react-icons/md';
import { PiVirtualRealityBold } from 'react-icons/pi';
import { FaLaptopCode } from 'react-icons/fa';

const RealidadVirtual = () => {
  const [activeTab, setActiveTab] = useState<'equipos' | 'proyectos'>('equipos');

  const equipmentItems = [
    {
      nombre: "Visores de realidad virtual META WEST",
      icono: <PiVirtualRealityBold className={styles.equipmentIcon} />,
      imagen: "/img/Visores.jpg",
      descripcion: "Visualiza un entorno virtual manejable por el usuario."
    },
    {
      nombre: "Scanner 3D",
      icono: <MdScanner className={styles.equipmentIcon} />,
      imagen: "/img/3dScanner.jpg",
      descripcion: "Dispositivo que captura la forma , el color de onjetos fisicos para crear modelos digitales tridimensionales."
    },
    {
      nombre: "Computadoras de alto rendimiento",
      icono: <FaLaptopCode className={styles.equipmentIcon} />,
      imagen: "/img/Computadoras .jpg",
      descripcion: "La realidad virtual requiere una gran potencia de procesamiento gráfico y de CPU para renderizar los entornos virtuales en tiempo real."
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
      <section className={styles.titleSection}>
        <h1 className={styles.mediaTitle}>
          <img src="/img/Laboratorio de Realidad Virtual.png" alt="Logo de Media Lab" className={styles.logo} />
        </h1>
      </section>
      <nav className={styles.navTabs}>
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

export default RealidadVirtual;