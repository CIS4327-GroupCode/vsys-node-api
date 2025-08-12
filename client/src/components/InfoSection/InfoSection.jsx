import React from 'react';
import styles from './InfoSection.module.css';

const InfoSection = () => {
  return (
    <section className={styles.info}>
      <h1>Welcome to VolunteerConnect</h1>
      <p>
        Our platform connects passionate volunteers with meaningful opportunities.
        Whether you're looking to give back to your community or manage volunteer efforts,
        we've got you covered.
      </p>
    </section>
  );
};

export default InfoSection;