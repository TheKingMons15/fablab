import React from 'react';
import styles from '../Header.module.css';

interface DropdownProps {
  items: string[];
  isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownProps> = ({ items, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdown}>
      {items.map((item, index) => (
        <div key={index} className={styles.dropdownItem}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;