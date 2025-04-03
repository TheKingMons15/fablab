import styles from './CursosContent.module.css';

const CursosFabLab = () => {
  // Datos de los cursos ofrecidos en el FabLab
  const cursos = [
    {
      nombre: "Programación",
      descripcion: "Aprende los fundamentos de la programación y desarrolla aplicaciones innovadoras.",
      imagen: "/img/programacion.jpeg"
    },
    {
      nombre: "Impresión 3D",
      descripcion: "Descubre el mundo de la impresión 3D y crea tus propios prototipos.",
      imagen: "/img/impresion3d.jpeg"
    },
    {
      nombre: "Corte y Grabado Láser",
      descripcion: "Domina el uso de máquinas de corte y grabado láser para proyectos creativos.",
      imagen: "/img/corte_laser.jpeg"
    },
    {
      nombre: "Diseño Gráfico",
      descripcion: "Desarrolla tus habilidades en diseño gráfico con herramientas digitales avanzadas.",
      imagen: "/img/diseno_grafico.jpeg"
    },
    {
      nombre: "Robótica",
      descripcion: "Explora el mundo de la robótica y aprende a construir y programar robots.",
      imagen: "/img/robotica.jpeg"
    },
    {
      nombre: "Vacacionales 'Fabricación Digital'",
      descripcion: "Un curso especial para aprender sobre fabricación digital en vacaciones.",
      imagen: "/img/vacacionales_fabricacion.jpeg"
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
