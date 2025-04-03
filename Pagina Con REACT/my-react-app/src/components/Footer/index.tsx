import React from 'react';
import styles from './Footer.module.css';

const socialMedia = [
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'YouTube', url: 'https://youtube.com' }
];

const quickLinks = [
  { text: 'Políticas de uso', path: '/politicas' },
  { text: 'Preguntas frecuentes', path: '/faq' },
  { text: 'Documentación técnica', path: '/documentacion' }
];

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo principal alineado a la izquierda */}
        <div className={styles.logoContainer}>
          <img 
            src="/img/Logo_Principal.png" 
            alt="Logo del FabLab"
            className={styles.logo}
            loading="lazy"
          />
        </div>

        {/* Contacto */}
        <div className={styles.footerSection}>
          <h3>Contacto</h3>
          <address className={styles.contactInfo}>
            <p>Teléfono: <a href="tel:+51123456789">+59300000000</a></p>
            <p>Email: <a href="mailto:contacto@fablab.com">contacto@fablab.com</a></p>
            <p>Dirección: Av. Innovación 123</p>
          </address>
        </div>

        {/* Enlaces Rápidos */}
        <div className={styles.footerSection}>
          <h3>Enlaces Rápidos</h3>
          <nav aria-label="Enlaces rápidos">
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.path} className={styles.link}>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Redes Sociales */}
        <div className={styles.footerSection}>
          <h3>Redes Sociales</h3>
          <div className={styles.socialMediaContainer}>
            <nav aria-label="Redes sociales">
              <ul className={styles.socialLinks}>
                {socialMedia.map((platform, index) => (
                  <li key={index}>
                    <a 
                      href={platform.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;