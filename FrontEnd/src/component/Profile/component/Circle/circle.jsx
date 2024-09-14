import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './circle.module.css';

function CirclePercentage({ percentage, width, height }) {
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }, [percentage]);

  return (
    <svg className={styles.circle} width={width} height={height} viewBox="0 0 100 100">
      <circle className={styles.circleBackground} cx="50" cy="50" r="45" />
      <circle className={styles.circleProgress} ref={circleRef} cx="50" cy="50" r="45" />
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className={styles.circleText}>
          <tspan x="50%" textAnchor="middle" dy="-0.4em" className={styles.circleText}>
            {`${percentage}%`}
          </tspan>
          <tspan x="50%" textAnchor="middle" dy="1.4em" className={styles.circleText}>
            RATIO
          </tspan>
        </text>
    </svg>
  );
}

CirclePercentage.propTypes = {
  percentage: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default CirclePercentage;
