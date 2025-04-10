import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Header.module.css';

interface DropdownMenuProps {
  items: { name: string; path: string }[];
  isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, isOpen }) => {
  return (
    <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
      {items.map((item) => (
        <div key={item.name} className={styles.dropdownItem}>
          <Link to={item.path} className={styles.dropdownItemLink}>
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;