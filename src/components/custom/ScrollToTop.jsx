import { useState, useEffect } from 'react';
import CustomButton from './CustomButton';
import styles from './ScrollToTop.module.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.scrollToTop}>
      <CustomButton
        floating
        large
        className="green darken-1 white-text"
        onClick={scrollToTop}
        icon="arrow_upward"
        tooltip="Volver arriba"
        aria-label="Volver al inicio de la página"
      />
    </div>
  );
};

export default ScrollToTop;
