import React from 'react';
import styles from './Navbar.module.css';
import AuthButtons from '../authButtons/authButtons'; 

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>VolunteerConnect</div>
      <div className={styles.actions}>
        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;