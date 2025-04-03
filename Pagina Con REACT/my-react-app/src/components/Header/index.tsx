import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import DropdownMenu from './subcomponents/DropdownMenu';

// Definiendo interfaces para el menú y submenú
interface SubMenuItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  path?: string;
  submenu?: SubMenuItem[];
}

const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Menú items con rutas
  const menuItems: MenuItem[] = [
    { name: 'Inicio', path: '/' },
    {
      name: 'Laboratorios',
      submenu: [
        { name: 'MediaLab', path: '/laboratorios/medialab' },
        { name: 'Laboratorio de Electrónica', path: '/laboratorios/electronica' },
        { name: 'Laboratorio de Diseño y Estructura', path: '/laboratorios/diseno' },
        { name: 'Laboratorio de Realidad Virtual', path: '/laboratorios/realidad-virtual' },
        { name: 'FabLab', path: '/laboratorios/fablab' }
      ]
    },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Clubs', path: '/clubs' },
    {
      name: 'Herramientas', 
      submenu: [
        { name: 'Test', path: '/herramientas/test' },
        
      ]
    },
    { name: 'Cursos', path: '/cursos' },

  ];

  // Función para verificar si una ruta está activa
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <header className={styles.header}>
      <Link to="/">
        <img src="/img/Logo_Principal.png" alt="Logo" className={styles.logo} />
      </Link>
      <nav>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`
                ${styles.navItem} 
                ${item.submenu ? styles.hasSubmenu : ''} 
                ${item.path && isActive(item.path) ? styles.active : ''}
              `}
              onMouseEnter={() => item.submenu && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link to={item.path || '#'} className={styles.navLink}>
                {item.name}
              </Link>

              {item.submenu && activeDropdown === item.name && (
                <DropdownMenu items={item.submenu} isOpen={true} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
