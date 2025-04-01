import { FaCalendarAlt, FaVideo, FaPhotoVideo } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import styles from './eventosContent.module.css';

const Eventos = () => {
  const eventImages = [
    "/img/evento1.jpg",
    "/img/evento2.jpg",
    "/img/evento3.jpg",
    "/img/evento4.jpg",
    "/img/evento5.jpg"
  ];

  const [, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % eventImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [eventImages.length]);

  const upcomingEvents = [
    {
      title: "Taller de Impresión 3D",
      date: "15 Oct 2024",
      description: "Aprende técnicas avanzadas de modelado e impresión 3D",
      location: "Aula Maker - FABLAB"
    },
    {
      title: "Expo Innovación Universitaria",
      date: "22 Nov 2024",
      description: "Muestra de proyectos tecnológicos estudiantiles",
      location: "Patio Central Universidad"
    }
  ];

  const pastEvents = [
    {
      title: "Semana de la Innovación 2024",
      description: "Concurso de proyectos tecnológicos con participación de 15 universidades",
      image: "/img/Semana de la Innovación 2024.jpg"
    },
    {
      title: "Charla con Expertos en IoT",
      description: "Conferencia magistral sobre aplicaciones de Internet de las Cosas",
      image: "/img/Charla con Expertos en IoT.jpg"
    },
    {
      title: "Workshop de Robótica",
      description: "Taller práctico de construcción y programación de robots",
      image: "/img/Workshop de robotica.webp"
    }
  ];

  const eventVideos = [
    "https://www.youtube.com/embed/ejemplo1",
    "https://www.youtube.com/embed/ejemplo2"
  ];

  return (
    <main className={styles.mainContent}>
      {/* Carrusel Principal */}
      <section className={styles.heroSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.heroContent}>
            <div className={styles.carruselContainer}>
              <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Eventos FABLAB Tulcán</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className={styles.upcomingEvents}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>
            <FaCalendarAlt className={styles.titleIcon} />
            Próximos Eventos
          </h2>
          <div className={styles.eventsGrid}>
            {upcomingEvents.map((event, index) => (
              <article key={index} className={styles.eventCard}>
                <div className={styles.eventDate}>
                  <span>{event.date}</span>
                </div>
                <div className={styles.eventInfo}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className={styles.eventLocation}>
                    <FaPhotoVideo />
                    <span>{event.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de Eventos Anteriores */}
      <section className={styles.pastEvents}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>
            <FaPhotoVideo className={styles.titleIcon} />
            Eventos Destacados
          </h2>
          <div className={styles.eventsGallery}>
            {pastEvents.map((event, index) => (
              <article key={index} className={styles.galleryCard}>
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.galleryImage}
                  loading="lazy"
                />
                <div className={styles.galleryOverlay}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Videos */}
      <section className={styles.videoSection}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.sectionTitle}>
            <FaVideo className={styles.titleIcon} />
            Lo Más Destacado
          </h2>
          <div className={styles.videoGrid}>
            {eventVideos.map((video, index) => (
              <div key={index} className={styles.videoContainer}>
                <iframe
                  src={video}
                  title={`Evento video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.newsletterCard}>
            <h2>¡No te pierdas nuestros próximos eventos!</h2>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Ingresa tu correo universitario"
                required
              />
              <button type="submit">Suscribirse</button>
            </form>
            <p>Recibe información actualizada sobre nuestros eventos y talleres</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Eventos;