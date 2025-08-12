import React from 'react';
import AuthForm from '../../components/authForm/authForm';
import styles from './Register.module.css';

const Register = () => {
  const handleRegister = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log('Register success:', result);
      // Handle auth state, redirect, etc.
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default Register;