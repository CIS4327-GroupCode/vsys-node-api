import React from 'react';
import AuthForm from '../../components/authForm/authForm';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const handleLogin = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };

  const navigate = useNavigate();

  try {
    const res = await fetch('http://localhost:'+process.env.PORT+'/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    console.log('Login success:', result);
    // Save the token to localStorage
    if (result.token) {
    localStorage.setItem('token', result.token);
    }
    // Use navigate to pass the token to the dashboard
    navigate('/dashboard', {state: result.token});
  } catch (err) {
    console.error('Login error:', err);
    window.alert('Login failed. Please check your credentials.');
    window.location.reload();
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