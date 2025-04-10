import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import DropdownMenu from './subcomponents/DropdownMenu';

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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Limpiar timeout al desmontar componente
  useEffect(() => {
    return () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [closeTimeout]);

  const menuItems: MenuItem[] = [
    { name: 'Inicio', path: '/' },
    {
      name: 'Laboratorios',
      submenu: [
        { name: 'FabLab', path: '/laboratorios/fablab' },
        { name: 'Laboratorio de Realidad Virtual', path: '/laboratorios/realidad-virtual' },
        { name: 'Laboratorio de Diseño y Estructura', path: '/laboratorios/diseno' },
        { name: 'Laboratorio de Electrónica', path: '/laboratorios/electronica' },
        { name: 'MediaLab', path: '/laboratorios/medialab' }        
      ]
    },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Cursos', path: '/cursos' },
    {
      name: 'Herramientas',
      submenu: [
        { name: 'Test', path: '/herramientas/test' },
      ]
    },
    { name: 'Club', path: '/clubs' },
  ];

  const handleMouseEnter = (itemName: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay antes de cerrar
    setCloseTimeout(timeout);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);
  
  return (
    <header className={styles.header}>
      <Link to="/">
        <img src="/img/Logo_Principal.png" alt="Logo" className={styles.logo} />
      </Link>

      <button 
        className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`${styles.navMenu} ${menuOpen ? styles.menuOpen : ''}`}>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`${styles.navItem} ${
                item.path && isActive(item.path) ? styles.active : ''
              }`}
              onMouseEnter={() => item.submenu && handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.path ? (
                <Link to={item.path} className={styles.navLink} onClick={() => setMenuOpen(false)}>
                  {item.name}
                </Link>
              ) : (
                <span className={`${styles.navLink} ${styles.hasSubmenu}`}>{item.name}</span>
              )}

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