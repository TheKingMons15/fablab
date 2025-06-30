import { FaBullseye, FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import { FaRegGem} from 'react-icons/fa';
import { GiSprint, GiHeatHaze, GiCircuitry, GiTeacher, GiRolledCloth } from 'react-icons/gi';
import { FiTool, FiPrinter, FiPackage } from 'react-icons/fi';
import { MdDesignServices } from "react-icons/md";
import NeuralNetworkBackground from "./NeuralNetworkBackground.tsx";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const navigate = useNavigate();

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
      nombre: "FABLAB",
      imagen: "/img/Fablab.jpg",
      ruta: "/laboratorios/fablab"
    },
    {
      nombre: "Laboratorio de Realidad Virtual",
      imagen: "/img/labrealidad.jpg",
      ruta: "/laboratorios/realidad-virtual"
    },
    {
      nombre: "Laboratorio de Diseño y estructura",
      imagen: "/img/labdiseño.jpg",
      ruta: "/laboratorios/diseno"
    },
    {
      nombre: "MediaLab ",
      imagen: "/img/medialab.jpg",
      ruta: "/laboratorios/medialab"
    },
    {
      nombre: "Laboratorio de Electrónica",
      imagen: "/img/labelectronica.jpg",
      ruta: "/laboratorios/electronica"
    }
  ];


  return (
    <main className={styles.mainContent}>
      {/* Carrusel */}
      <section className={styles.carruselSection}>
        <div className={styles.backgroundContainer}>
          <NeuralNetworkBackground 
            color="rgba(255, 255, 255, 0.4)" 
            nodeDensity={15}
          />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.carruselContainer}>
          {/* Logo */}
    <div className={styles.logoSection}>
      <img
        src="/img/FABLOGO.png"
        alt="Logo"
        className={styles.logo}
        loading="lazy"
      />
    </div>

    {/* Carrusel */}
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

      {/* Resto del componente sin cambios */}
      <section className={styles.misionVision}>
        <div className={styles.contentWrapper}>
          <div className={styles.misionVisionGrid}>
            <div className={styles.misionCard}>
              <FaBullseye className={styles.icon} />
              <h2>Misión</h2>
              <p>Ser un referente regional en innovación, educación y emprendimiento tecnológico, impulsando la fabricación digital, 
                la creatividad y la transferencia de conocimiento, con impacto social y económico en la provincia del Carchi y la zona 
                fronteriza, integrando a la academia, la industria y la comunidad.</p>
            </div>
            <div className={styles.visionCard}>
              <FaEye className={styles.icon} />
              <h2>Visión</h2>
              <p>Fomentar el aprendizaje práctico, la investigación aplicada y el desarrollo de soluciones tecnológicas mediante el uso 
                de herramientas de fabricación digital. El FabLab UPEC ofrece un espacio abierto e inclusivo donde estudiantes, docentes, 
                emprendedores y ciudadanía colaboran para transformar ideas en prototipos funcionales, promoviendo el desarrollo sostenible, 
                la cultura maker y la innovación en la región.</p>
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
              <article key={lab.nombre} className={styles.laboratorioCard} onClick={() => navigate(lab.ruta)} style={{ cursor: 'pointer' }}>
                <img src={lab.imagen} alt={lab.nombre} className={styles.laboratorioImage} loading="lazy" />
                <div className={styles.laboratorioInfo}>
                  <h3>{lab.nombre}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className={styles.serviciosSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle} style={{ color: "#006633" }}>
            Servicios y Equipos
          </h2>   
          <div className={styles.serviciosGrid}>
            {[
              { title: 'Corte y grabado láser', icon: <FaRegGem style={{ color: "#FFFFFF" }} /> },
              { title: 'Corte de vinil', icon: <GiRolledCloth style={{ color: "#FFFFFF" }} /> },
              { title: 'Impresión 3D', icon: <GiSprint style={{ color: "#FFFFFF" }} /> },
              { title: 'Máquinado CNC', icon: <FiTool style={{ color: "#FFFFFF" }} /> },
              { title: 'Sublimación', icon: <GiHeatHaze style={{ color: "#FFFFFF" }} /> },
              { title: 'Impresión de gigantografías', icon: <FiPrinter style={{ color: "#FFFFFF" }} /> },
              { title: 'Diseño electrónico', icon: <GiCircuitry style={{ color: "#FFFFFF" }} /> },
              { title: 'Diseño Digital', icon: <MdDesignServices style={{ color: "#FFFFFF" }} /> },
              { title: 'Educación continua', icon: <GiTeacher style={{ color: "#FFFFFF" }} /> },
              { title: 'Laminado', icon: <FiPackage style={{ color: "#FFFFFF" }} /> }
            ].map((servicio) => (
              <div key={servicio.title} className={styles.servicioCard} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#FFFFFF' }}>
                  {servicio.icon}
                </div>
                <h3>{servicio.title}</h3>
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
      <article className={`${styles.directorCard} ${styles.singleDirector}`}>
        <img
          src="/img/IngJeffry.jpg"
          alt="Director del FabLab"
          loading="lazy"
        />
        <div className={styles.directorInfo}>
          <h2>Msc. Jeffry Naranjo</h2>
          <h3>Director del FabLab</h3>
          <p>Impulsando la innovación y la creatividad tecnológica.</p>
        </div>
      </article>
    </div>
  </div>
</section>
    </main>
  );
};

export default MainContent;