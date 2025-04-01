import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Header.module.css';

const DropdownMenu: React.FC<{ items: any[], isOpen: boolean }> = ({ items, isOpen }) => {
  return (
    <ul className={`${styles.dropdown} ${isOpen ? styles.active : ''}`}>
      {items.map((subItem) => (
        <li key={subItem.name} className={styles.dropdownItem}>
          <Link to={subItem.path} className={styles.dropdownItemLink}>
            {subItem.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;