import React from 'react';
import AuthForm from '../../components/authForm/authForm';
import styles from './Login.module.css';

const Login = () => {
  const handleLogin = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };

  try {
    const res = await fetch('http://localhost:'+process.env.PORT+'/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    console.log('Login success:', result);
    //redirect after successful login, handle auth state, etc.
  } catch (err) {
    console.error('Login error:', err);
  }
};


  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;