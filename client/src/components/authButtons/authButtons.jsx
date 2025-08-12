import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './authButtons.module.css'; 

const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.authButtons}>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
};

export default AuthButtons;