import { FaCalendarAlt, FaVideo, FaPhotoVideo, FaExternalLinkAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import styles from './eventosContent.module.css';

// Componente para renderizar videos de YouTube
const YouTubeEmbed = ({ videoId, title }: { videoId: string, title: string }) => {
  // Construir URL de inserción correcta para YouTube
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  return (
    <div className={styles.videoContainer}>
      <h3 className={styles.videoTitle}>{title}</h3>
      <iframe
        src={embedUrl}
        title={title}
        className={styles.videoFrame}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className={styles.videoCaption}>
        <a 
          href={`https://www.youtube.com/watch?v=${videoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.videoLink}
        >
          <FaExternalLinkAlt /> Ver en YouTube
        </a>
      </div>
    </div>
  );
};

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

  // Solo videos de YouTube con ID extraído
  const eventVideos = [
    {
      id: "", // Ejemplo de ID de video de YouTube
      title: "Workshop de Innovación"
    },
    {
      id: "", // Otro ejemplo
      title: "Charla sobre Fabricación Digital"
    }
  ];

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
              <YouTubeEmbed key={index} videoId={video.id} title={video.title} />
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