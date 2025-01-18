import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './circle.module.css';

function CirclePercentage({ percentage }) {
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;

    // Ensure the circle element is valid
    if (circle && circle.r && circle.r.baseVal) {
      const radius = circle.r.baseVal.value || 0; // Default to 0 if radius is invalid
      const circumference = (radius * 2 * Math.PI) || 0; // Avoid NaN by ensuring radius is valid

      // Set the strokeDasharray and strokeDashoffset
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;

      // Calculate offset
      const validPercentage = Math.max(0, Math.min(percentage, 100)); // Clamp percentage between 0 and 100
      const offset = circumference - (validPercentage / 100) * circumference;
      circle.style.strokeDashoffset = `${offset}`;
    }
  }, [percentage]);

  return (
    <svg className={styles.circle} viewBox="0 0 100 100">
      <circle className={styles.circleBackground} cx="50" cy="50" r="45" />
      <circle className={styles.circleProgress} ref={circleRef} cx="50" cy="50" r="45" />
    </svg>
  );
}

CirclePercentage.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default CirclePercentage;
