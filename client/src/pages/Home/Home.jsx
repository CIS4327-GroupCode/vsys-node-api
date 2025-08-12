import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import InfoSection from '../../components/InfoSection/InfoSection';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <InfoSection />
    </div>
  );
};

export default Home;