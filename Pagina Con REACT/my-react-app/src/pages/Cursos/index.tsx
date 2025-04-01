import styles from './CursosContent.module.css';

const CursosFabLab = () => {
  // Datos de los cursos ofrecidos en el FabLab
  const cursos = [
    {
      nombre: "Impresión 3D y Diseño Digital",
      descripcion: "Aprende a modelar e imprimir en 3D con tecnología de vanguardia para proyectos universitarios.",
      imagen: "/img/Impresión 3D y Diseño Digital.jpeg",
      video: "https://www.youtube.com/embed/videoID1"
    },
    {
      nombre: "Robótica y Automatización",
      descripcion: "Descubre el mundo de la robótica y la automatización en procesos productivos y académicos.",
      imagen: "/img/Robótica y Automatizació.png",
      video: "https://www.youtube.com/embed/videoID2"
    },
    {
      nombre: "Electrónica y Programación",
      descripcion: "Integra electrónica y programación para desarrollar proyectos innovadores.",
      imagen: "/img/Electrónica y Programación.jpeg",
      video: "https://www.youtube.com/embed/videoID3"
    }
  ];

  // Datos de los artículos y recursos
  const articulos = [
    {
      titulo: "Innovación en Diseño",
      imagen: "/img/Semana de la Innovación 2024.jpg"
    },
    {
      titulo: "Tecnología Aplicada",
      imagen: "/img/Tecnología Aplicada.jpg"
    },
    {
      titulo: "Historias de Éxito",
      imagen: "/img/Historias de Éxito.jpg"
    }
  ];

  return (
    <main className={styles.mainContent}>
      {/* Información de Cursos (Estilo Revista) */}
      <section className={styles.informacionSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>Cursos y Talleres Universitarios</h2>
          <div className={styles.cursosGrid}>
            {cursos.map(curso => (
              <article key={curso.nombre} className={styles.cursoCard}>
                <div className={styles.cursoImagen}>
                  <img
                    src={curso.imagen}
                    alt={curso.nombre}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cursoInfo}>
                  <h3>{curso.nombre}</h3>
                  <p>{curso.descripcion}</p>
                  <div className={styles.cursoMultimedia}>
                    <iframe
                      src={curso.video}
                      title={curso.nombre}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.cursoVideo}
                    ></iframe>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos y Recursos (Estilo Revista) */}
      <section className={styles.articulosSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>Artículos y Recursos</h2>
          <div className={styles.articulosGrid}>
            {articulos.map((articulo, index) => (
              <article key={index} className={styles.articuloCard}>
                <img
                  src={articulo.imagen}  // Modifica la ruta aquí para cambiar la imagen
                  alt={articulo.titulo}
                  loading="lazy"
                  className={styles.articuloImagen}
                />
                <div className={styles.articuloInfo}>
                  <h3>{articulo.titulo}</h3>
                  <p>
                    Conoce las últimas tendencias, casos de estudio y experiencias que impulsan la innovación en el FabLab.
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

export default CursosFabLab;
