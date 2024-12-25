import React from "react";

const cleanPercentage = (percentage) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Text = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.5em"}
      fill="white" // Set text color to white
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

const Circle = ({ color, pct, radius = 90, strokeWidth = 10 }) => {
  const circumference = 2 * Math.PI * radius;
  const offset = pct ? ((100 - pct) / 100) * circumference : 0;

  return (
    <circle
      r={radius}
      cx="125" // Center the circle horizontally (width / 2)
      cy="125" // Center the circle vertically (height / 2)
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={offset}
    />
  );
};

const CurveLevel = ({ percentage, color, width = 250, height = 250 }) => {
  const pct = cleanPercentage(percentage);
  const radius = (Math.min(width, height) - 40) / 2; // Adjust radius based on width/height
  const strokeWidth = 20;

  return (
    <svg width={width} height={height}>
      <g transform={`rotate(-90 ${width / 2} ${height / 2})`}>
        <Circle color="lightgrey" radius={radius} strokeWidth={strokeWidth} />
        <Circle color={color} pct={pct} radius={radius} strokeWidth={strokeWidth} />
      </g>
      <Text percentage={pct} />
    </svg>
  );
};

export default CurveLevel;
