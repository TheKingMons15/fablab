import { FaBullseye, FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import styles from './MainContent.module.css';

const MainContent = () => {
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
      nombre: "Laboratorio de Prototipado",
      descripcion: "Equipamiento de última generación para crear prototipos innovadores.",
      imagen: "/img/laboratorio1.jpg"
    },
    {
      nombre: "Laboratorio de Diseño Digital",
      descripcion: "Herramientas avanzadas para diseño y modelado 3D.",
      imagen: "/img/laboratorio2.jpg"
    },
    {
      nombre: "Laboratorio de Fabricación Digital",
      descripcion: "Tecnología de punta para fabricación asistida por computadora.",
      imagen: "/img/laboratorio3.jpg"
    },
    {
      nombre: "Laboratorio de Medios ",
      descripcion: "Un laboratorio de medios es un espacio multidisciplinario dedicado a la creación, producción y análisis de contenidos multimedia.",
      imagen: "/img/laboratorio4.jpg"
    } ,
    {
      nombre: "Laboratorio Fabricación electronica ",
      descripcion: "Un laboratorio de fabricación electrónica es un espacio equipado para el diseño, prototipado y producción de dispositivos y circuitos electrónicos.",
      imagen: "/img/laboratorio5.jpg"
    }
    ,
    {
      nombre: "Laboratorio de Realidad Aumentada",
      descripcion: "Un laboratorio de realidad aumentada (RA) es un espacio dedicado a la investigación, el desarrollo y la experimentación con tecnologías de RA.",
      imagen: "/img/laboratorio6.jpg"
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
              <h2>Misión</h2>
              <p>Formar profesionales altamente capacitados en tecnologías de fabricación digital, promoviendo la innovación y el desarrollo tecnológico.</p>
            </div>
            <div className={styles.visionCard}>
              <FaEye className={styles.icon} />
              <h2>Visión</h2>
              <p>Ser un referente nacional en educación e investigación en fabricación digital, contribuyendo al desarrollo tecnológico y la transformación industrial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratorios */}
      <section className={styles.laboratoriosSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>LABORATORIOS</h2>
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
          <h2 className={styles.sectionTitle}>Servicios y Equipos</h2>
          <div className={styles.serviciosGrid}>
            {['Impresión 3D', 'Corte Láser', 'Fresado CNC', 'Diseño Asistido'].map((servicio, index) => (
              <div key={servicio} className={styles.servicioCard}>
                <h3>{servicio}</h3>
                <p>
                  {[
                    'Materializa tus diseños en una amplia gama de materiales y acabados.',
                    'Corta y graba con alta precisión en diversos materiales.',
                    'Mecanizado de piezas en madera, metal y otros materiales.',
                    'Software y asesoría especializada en diseño 3D y modelado digital.'
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
              {['Investigación Aplicada', 'Proyectos Interdisciplinarios', 'Innovación Tecnológica'].map((proyecto) => (
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
            {['Director de Carrera', 'Director del FabLab'].map((cargo) => (
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
                      ? 'Liderando la excelencia académica y el desarrollo profesional.'
                      : 'Impulsando la innovación y la creatividad tecnológica.'}
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

export default MainContent;