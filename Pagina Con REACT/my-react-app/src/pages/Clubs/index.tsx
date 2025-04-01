import { useState, useEffect } from 'react';
import styles from './ClubsContent.module.css';

const Clubs = () => {
  const areasMedialab = [
    {
      titulo: "Social Media",
      descripcion: "Creamos y gestionamos estrategias digitales innovadoras para marcas",
      imagenes: ["/img/Social1.jpg", "/img/Social2.jpg"],
      detalles: [
        "Gestión de redes sociales",
        "Creación de contenido viral",
        "Análisis de métricas",
        "Campañas publicitarias digitales"
      ]
    },
    {
      titulo: "Fotografía",
      descripcion: "Producción de imágenes profesionales para diferentes plataformas",
      imagenes: ["/img/foto1.jpg", "/img/foto2.jpg"],
      detalles: [
        "Fotografía de producto",
        "Edición profesional",
        "Sesiones creativas",
        "Retoque digital"
      ]
    },
    {
      titulo: "Diseño Web",
      descripcion: "Desarrollo de sitios web modernos y funcionales",
      imagenes: ["/img/web1.jpg", "/img/web2.jpg"],
      detalles: [
        "Diseño responsive",
        "UX/UI avanzado",
        "Desarrollo front-end",
        "Optimización SEO"
      ]
    }
  ];

  return (
    <main className={styles.mainContent}>
      {/* Sección Principal */}
      <section className={styles.heroSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.heroContent}>
            <h1>MediaLab Club</h1>
            <p className={styles.subtitulo}>Innovación digital en redes, fotografía y desarrollo web</p>
            <div className={styles.heroImages}>
              <img src="/img/Equipo.jpg" alt="Equipo MediaLab" loading="lazy" />
              <img src="/img/Trbajao en Equipo.jpg" alt="Trabajo en equipo" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Especialización */}
      {areasMedialab.map((area, index) => (
        <section key={area.titulo} className={styles.areaSection}>
          <div className={styles.contentWrapper}>
            <div className={`${styles.areaContent} ${index % 2 === 0 ? styles.reverse : ''}`}>
              <div className={styles.areaImages}>
                {area.imagenes.map((img, imgIndex) => (
                  <img 
                    key={imgIndex} 
                    src={img} 
                    alt={`${area.titulo} ${imgIndex + 1}`} 
                    loading="lazy"
                  />
                ))}
              </div>
              <div className={styles.areaInfo}>
                <h2>{area.titulo}</h2>
                <p>{area.descripcion}</p>
                <ul className={styles.areaList}>
                  {area.detalles.map((detalle, i) => (
                    <li key={i}>{detalle}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Proyectos Destacados */}
      <section className={styles.proyectosSection}>
        <div className={styles.contentWrapper}>
          <h2>Proyectos Recientes</h2>
          <div className={styles.proyectosGrid}>
            <div className={styles.proyectoCard}>
              <img src="/img/proyecto1.jpg" alt="Campaña Redes Sociales" />
              <h3>Campaña Digital para Startup</h3>
              <p>Aumento del 150% en engagement</p>
            </div>
            <div className={styles.proyectoCard}>
              <img src="/img/proyecto2.jpg" alt="Sitio Web Corporativo" />
              <h3>Rediseño Plataforma E-commerce</h3>
              <p>Mejora en conversión de ventas</p>
            </div>
            <div className={styles.proyectoCard}>
              <img src="/img/proyecto3.jpg" alt="Sesión Fotográfica" />
              <h3>Producción Book Empresarial</h3>
              <p>Imágenes profesionales para marca</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo Coordinador */}
      <section className={styles.equipoSection}>
        <div className={styles.contentWrapper}>
          <h2>Colaboradores del Club</h2>
          <div className={styles.equipoGrid}>
            <div className={styles.integrante}>
              <img src="/img/aida.jpg" alt="Coordinador Social Media" />
              <h3>Adida Solis</h3>
              <p>Especialista en Marketing Digital</p>
            </div>
            <div className={styles.integrante}>
              <img src="/img/Wladimir.jpg" alt="Coordinador Fotografía" />
              <h3>Wladimir Almeida</h3>
              <p>Fotógrafo Profesional</p>
            </div>
            <div className={styles.integrante}>
              <img src="/img/coordinador3.jpg" alt="Coordinador Desarrollo Web" />
              <h3>Kevin Mejia</h3>
              <p>Desarrollador Front-end</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Clubs;