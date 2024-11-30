import React, { useRef, useEffect } from 'react';

const PongCanvas = ({
  canvasSize,
  ballPosition,
  playerAPaddle,
  playerBPaddle,
  onCanvasResize
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        onCanvasResize({ width, height });
      }
    };

    // Initial size
    updateCanvasSize();

    // Responsive resize
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [onCanvasResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;
    const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
    backgroundGradient.addColorStop(0, 'red'); // Start color (yellow)
    backgroundGradient.addColorStop(1, 'yellow'); // End color (lighter yellow)


    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, width, height);

    // Paddle dimensions
    const PADDLE_WIDTH = width * 0.01; // 2% of canvas width
    const PADDLE_HEIGHT = height * 0.2; // 20% of canvas height

    // Draw paddles with different colors
    ctx.fillStyle = '#ffee00'; // Green paddle for Player A
    ctx.fillRect(0, playerAPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    ctx.fillStyle = '#e30000'; // Blue paddle for Player B
    ctx.fillRect(width - PADDLE_WIDTH, playerBPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    const BALL_RADIUS = width * 0.012;
    ctx.beginPath();
    ctx.fillStyle =  '#000' // white ball
    ctx.arc(ballPosition.x, ballPosition.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }, [canvasSize, ballPosition, playerAPaddle, playerBPaddle]);

  return (
    <div 
      ref={containerRef}
      className="game-canvas-container"
    >
      <canvas 
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="game-canvas"
      />
    </div>
  );
};

export default PongCanvas;