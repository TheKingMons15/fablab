import React, { useState } from 'react';
import styles from './Header.module.css';
import DropdownMenu from './subcomponents/DropdownMenu'; // Asegúrate de que la ruta esté correcta

const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    { name: 'Inicio' },
    {
      name: 'Laboratorios',
      submenu: [
        'MediaLab',
        'Laboratorio de Electrónica',
        'Laboratorio de Diseño y Estructura',
        'Laboratorio de Realidad Virtual',
        'FabLab'
      ]
    },
    { name: 'Eventos' },
    { name: 'Clubs' },
    { name: 'Cursos' },
    {
      name: 'Herramientas',
      submenu: ['test']
    },
  ];

  return (
    <header className={styles.header}>
      <img
        src="/img/Logo_Principal.png"
        alt="Logo"
        className={styles.logo}
      />
      <nav>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`${styles.navItem} ${item.submenu ? styles.hasSubmenu : ''}`}
              onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.name}

              {item.submenu && (
                <DropdownMenu
                  items={item.submenu}
                  isOpen={activeDropdown === item.name}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
