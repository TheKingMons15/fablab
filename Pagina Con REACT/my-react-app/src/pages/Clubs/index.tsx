import { FaBullseye, FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import styles from './ClubsContent.module.css';

const Clubs = () => {
  const images = [
    "/img/IMG_9656.JPG",
    "/img/IMG_9650.JPG",
    "/img/IMG_9640.JPG",
    "/img/IMG_9533.JPG",
    "/img/IMG_9497.JPG"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const laboratorios = [
    {
      nombre: "...",
      descripcion: "...",
      imagen: "..."
    },
    {
      nombre: "...",
      descripcion: "...",
      imagen: "..."
    },
    {
      nombre: "...",
      descripcion: "...",
      imagen: "..."
    },
    {
      nombre: "...",
      descripcion: "...",
      imagen: "..."
    } ,
    {
      nombre: "...",
      descripcion: "...",
      imagen: "..."
    }
    ,
    {
      nombre: "...",
      descripcion: "...",
      imagen: "..."
    }
  ];

  return (
    <main className={styles.mainContent}>
      {/* Carrusel */}
      <section className={styles.carruselSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.carruselContainer}>
            <div className={styles.logoSection}>
              <img
                src="/img/FABLOGO.png"
                alt="Logo"
                className={styles.logo}
                loading="lazy"
              />
            </div>
            <div className={styles.imageSlider}>
              {images.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className={`${styles.slide} ${index === currentImageIndex ? styles.active : ''}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className={styles.misionVision}>
        <div className={styles.contentWrapper}>
          <div className={styles.misionVisionGrid}>
            <div className={styles.misionCard}>
              <FaBullseye className={styles.icon} />
              <h2>...</h2>
              <p>...</p>
            </div>
            <div className={styles.visionCard}>
              <FaEye className={styles.icon} />
              <h2>...</h2>
              <p>...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratorios */}
      <section className={styles.laboratoriosSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>CLUBS</h2>
          <div className={styles.laboratoriosGrid}>
            {laboratorios.map((lab) => (
              <article key={lab.nombre} className={styles.laboratorioCard}>
                <img
                  src={lab.imagen}
                  alt={lab.nombre}
                  className={styles.laboratorioImage}
                  loading="lazy"
                />
                <div className={styles.laboratorioInfo}>
                  <h3>{lab.nombre}</h3>
                  <p>{lab.descripcion}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className={styles.serviciosSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>....</h2>
          <div className={styles.serviciosGrid}>
            {['I....', '....', '....', '....'].map((servicio, index) => (
              <div key={servicio} className={styles.servicioCard}>
                <h3>{servicio}</h3>
                <p>
                  {[
                    '....',
                    '....',
                    '....',
                    '.....'
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oportunidades Académicas */}
      <section className={styles.oportunidadesSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>Oportunidades Académicas</h2>
          <div className={styles.oportunidadesGrid}>
            <div className={styles.oportunidadesImage}>
              <img
                src="/img/IMG_9584.JPG"
                alt="Oportunidades académicas"
                loading="lazy"
              />
            </div>
            <div className={styles.proyectosList}>
              {['....', '....', '....'].map((proyecto) => (
                <div key={proyecto} className={styles.proyectoItem}>
                  {proyecto}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directores */}
      <section className={styles.directoresSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.directoresGrid}>
            {['....', '....'].map((cargo) => (
              <article key={cargo} className={styles.directorCard}>
                <img
                  src="/img/direc.png"
                  alt={cargo}
                  loading="lazy"
                />
                <div className={styles.directorInfo}>
                  <h3>{cargo}</h3>
                  <p>
                    {cargo.includes('Carrera')
                      ? '....'
                      : '....'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Clubs;