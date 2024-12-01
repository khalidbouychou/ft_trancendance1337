import React, { useState, useEffect, useRef, useCallback } from 'react';
import ScoreBoard from './scoreboard/scoreboard';
import GameControls from './gamecontrols/gamecontrols';
import WinnerOverlay from './winnerdisplay/winnerdisplay';
import PongCanvas from './canvaspong/canvaspong';
import './style.css';

const PongGame = () => {
  // Game state
  const [playerAScore, setPlayerAScore] = useState(0);
  const [playerBScore, setPlayerBScore] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 250, y: 200 }); // Initial ball position (default 250x200) 
  const [ballAngle, setBallAngle] = useState(Math.PI / 4); // 45 degrees in radians
  const [ballSpeed, setBallSpeed] = useState(5);
  const [winner, setWinner] = useState(null);
  const [Aavatar, setAAvatar] = useState("https://cdn3.vectorstock.com/i/1000x1000/84/02/creative-of-default-avatar-vector-21118402.jpg");
  const [Bavatar, setBAvatar] = useState("https://emle.kz/images/default_avatar.jpg");
 
  // Paddle and canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 300 }); // Initial canvas size (default 500x400) 
  const [playerAPaddle, setPlayerAPaddle] = useState(180); // Initial paddle position (default 150) 
  const [playerBPaddle, setPlayerBPaddle] = useState(180); // Initial paddle position (default 150) 
  const playerATargetRef = useRef(180); // Refs for smooth paddle movement
  const playerBTargetRef = useRef(180); // Refs for smooth paddle movement
 
  // Pressed keys tracking
  const keysPressed = useRef({
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false 
  });

  const animationRef = useRef(null); // Animation reference for game loop

  // Reset game function
  const resetGame = useCallback(() => { // useCallback to prevent unnecessary re-renders
    setPlayerAScore(0);
    setPlayerBScore(0);
    setWinner(null);
    setBallPosition({ x: 250, y: 200 }); // Reset ball position to center of canvas 
    setBallAngle(Math.PI / 4); // 45 degrees in radians
    setBallSpeed(5);
    setPlayerAPaddle(150); // Reset paddles to center of canvas 
    setPlayerBPaddle(150);  // Reset paddles to center of canvas
    playerATargetRef.current = 150; // Reset target positions for smooth movement
    playerBTargetRef.current = 150; // Reset target positions for smooth movement
  }, []);

  // Paddle movement and game logic
  const smoothMovePaddle = useCallback(() => { // useCallback to prevent unnecessary re-renders
    const { height } = canvasSize;
    const PADDLE_HEIGHT = height * 0.2; // 20% of canvas height for paddles to fit nicely on the screen
    const PADDLE_SPEED = height * 0.02 ;   // 2% of canvas height per frame (60fps) for smooth movement 0.02 * 60 = 1.2  pixels per frame (60fps)

    // Player A paddle movement
    if (keysPressed.current.w && !keysPressed.current.s) {
      playerATargetRef.current = Math.max(0, playerATargetRef.current - PADDLE_SPEED); // Move up by PADDLE_SPEED pixels (or less if at the top)
      console.log('------ W PAT', playerATargetRef.current);
    } else if (keysPressed.current.s && !keysPressed.current.w) {
      playerATargetRef.current = Math.min(height - PADDLE_HEIGHT, playerATargetRef.current + PADDLE_SPEED); // Move down by PADDLE_SPEED pixels (or less if at the bottom)
      console.log('------ S PAT', playerATargetRef.current);
    }
    // Smooth interpolation for Player A
    setPlayerAPaddle(prev => {
      if (prev < playerATargetRef.current) {
        return Math.min(prev + PADDLE_SPEED, playerATargetRef.current);// Move towards the target position by PADDLE_SPEED pixels | Math.min to prevent overshooting
      } else if (prev > playerATargetRef.current) {
        return Math.max(prev - PADDLE_SPEED, playerATargetRef.current);// Move towards the target position by PADDLE_SPEED pixels | Math.max to prevent overshooting
      }
      return prev;// If no change is needed, return the previous value
    });

    // Player B paddle movement
    if (keysPressed.current.ArrowUp && !keysPressed.current.ArrowDown) {
      playerBTargetRef.current = Math.max(0, playerBTargetRef.current - PADDLE_SPEED);
    } else if (keysPressed.current.ArrowDown && !keysPressed.current.ArrowUp) {
      playerBTargetRef.current = Math.min(height - PADDLE_HEIGHT, playerBTargetRef.current + PADDLE_SPEED);
    }
    // Smooth interpolation for Player B
    setPlayerBPaddle(prev => {
      if (prev < playerBTargetRef.current) {
        return Math.min(prev + PADDLE_SPEED, playerBTargetRef.current);
      } else if (prev > playerBTargetRef.current) {
        return Math.max(prev - PADDLE_SPEED, playerBTargetRef.current);
      }
      return prev;
    });
  }, [canvasSize]);

  // Key event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If game is over, reset on spacebar
      if (winner && e.key === ' ') {
        resetGame();
        return;
      }

      switch(e.key) {
        case 'w': keysPressed.current.w = true; break;
        case 's': keysPressed.current.s = true; break;
        case 'ArrowUp': keysPressed.current.ArrowUp = true; break;
        case 'ArrowDown': keysPressed.current.ArrowDown = true; break;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.key) {
        case 'w': keysPressed.current.w = false; break;
        case 's': keysPressed.current.s = false; break;
        case 'ArrowUp': keysPressed.current.ArrowUp = false; break;
        case 'ArrowDown': keysPressed.current.ArrowDown = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [winner, resetGame]);

  // Game loop with smooth rendering
  useEffect(() => {
    // If there's a winner, stop the game loop
    if (winner) return;

    const gameLoop = () => {
      // Smooth paddle movement
      smoothMovePaddle();

      // Use trigonometric functions for ball movement
      let newX = ballPosition.x + ballSpeed * Math.cos(ballAngle); // Move ball by ballSpeed pixels in the direction of ballAngle
      let newY = ballPosition.y + ballSpeed * Math.sin(ballAngle);// Move ball by ballSpeed pixels in the direction of ballAngle
      let newAngle = ballAngle; // Default to the same angle as before (no change) 

      const { width, height } = canvasSize; // Destructure width and height from canvasSize
      
      // Paddle dimensions
      const PADDLE_WIDTH = width * 0.01; // 2% of canvas width for paddles to fit nicely on the screen
      const PADDLE_HEIGHT = height * 0.2; // 20% of canvas height for paddles to fit nicely on the screen
      const BALL_RADIUS = width * 0.012 // 1.8% of canvas width for the ball to fit nicely on the screen

      // Wall collision (top and bottom)
      if (newY - BALL_RADIUS <= 0 || newY + BALL_RADIUS >= height) { // If the ball hits the top or bottom wall
        newAngle = -newAngle; // Reverse the angle
      }

      // Improved paddle collision detection
      const hitLeftPaddle = newX - BALL_RADIUS <= PADDLE_WIDTH &&  newY >= playerAPaddle && newY <= playerAPaddle + PADDLE_HEIGHT; // If the ball hits the left paddle
      const hitRightPaddle = newX + BALL_RADIUS >= width - PADDLE_WIDTH && newY >= playerBPaddle && newY <= playerBPaddle + PADDLE_HEIGHT; // If the ball hits the right paddle
      if (hitLeftPaddle || hitRightPaddle) {
        // Calculate relative position on paddle
        const paddleCenter = hitLeftPaddle ? playerAPaddle + PADDLE_HEIGHT / 2 : playerBPaddle + PADDLE_HEIGHT / 2; // Center of the paddle (left or right)  
        // Normalize the ball's position relative to paddle center
        const relativeIntersectY = newY - paddleCenter; // Calculate the relative intersection of the ball on the paddle
        const normalizedRelativeIntersection = Math.abs(relativeIntersectY / (PADDLE_HEIGHT / 2)); // Normalize the intersection to -1 to 1
        // Check if hit is near the corner (first or last 20% of paddle)
        const isCornerHit = normalizedRelativeIntersection > 0.8;// If the ball hits the first or last 20% of the paddle
        if (isCornerHit) {
          // For corner hits, use trigonometric calculation
          const bounceAngle = Math.PI / 4 * (relativeIntersectY < 0 ? -1 : 1); // 45 degrees in radians (up or down) 
          // Use cos and sin to calculate new direction
          newAngle = hitLeftPaddle ? bounceAngle : Math.PI - bounceAngle; // If hitLeftPaddle, bounceAngle, else Math.PI - bounceAngle
        } else {
          // Normal paddle hit - reflect with trigonometric precision
          const reflectionAngle = Math.PI - newAngle; // Reflect the angle by 180 degrees (pi radians) 
          
          // Adjust angle based on where the ball hits the paddle
          const angleModifier = Math.PI / 4 * (relativeIntersectY / (PADDLE_HEIGHT / 2)); // 45 degrees in radians (up or down) 
          newAngle = reflectionAngle + angleModifier;
        } 
        // Slightly increase speed on each paddle hit
        setBallSpeed(prev => Math.min(prev * 1.5, 10));// Increase speed by 50% but cap at 10  
      }
      // Scoring
      if (newX - BALL_RADIUS <= 0) { // If the ball hits the left wall
        const BnewScore = playerBScore + 1;
        setPlayerBScore(BnewScore);
        // Check for winner
        if (BnewScore >= 3) {
          setWinner('Player B');
          return;
        }
        newX = width / 2;// Reset ball position to center of canvas
        newY = height / 2;// Reset ball position to center of canvas
        newAngle = Math.PI / 4 * (Math.random() > 0.5 ? 1 : -1); // 45 degrees in radians (random direction) 
        setBallSpeed(5); // Reset ball speed
      }

      if (newX + BALL_RADIUS >= width) { // If the ball hits the right wall
        const AnewScore = playerAScore + 1;
        setPlayerAScore(AnewScore);
        // Check for winner
        if (AnewScore >= 3) {
          setWinner('Player A');
          return;
        }
        
        newX = width / 2;
        newY = height / 2;
        newAngle = Math.PI / 4 * (Math.random() > 0.5 ? 1 : -1);// 45 degrees in radians (random direction) 
        setBallSpeed(5);
      }

      setBallPosition({ x: newX, y: newY });
      setBallAngle(newAngle);

      // Continue the animation loop
      animationRef.current = requestAnimationFrame(gameLoop);// Recursively call gameLoop to create a game loop (60fps)
    };
    // Start the game loop
    animationRef.current = requestAnimationFrame(gameLoop); // Start the game loop with the first frame (60fps)

    // Cleanup
    return () => {
      if (animationRef.current) {// If the animation reference exists (game loop is running) 
        cancelAnimationFrame(animationRef.current);// Stop the game loop when the component unmounts or changes (cleanup) 
      }
    };
  }, [ballPosition, ballAngle, ballSpeed, playerAPaddle, playerBPaddle, smoothMovePaddle, canvasSize, playerAScore, playerBScore, winner]);

  return (
    <div className="game-container">
      {winner ? (
        <WinnerOverlay 
          winner={winner}
          BnewScore={playerBScore}
          AnewScore={playerAScore}
          Aa = {Aavatar}
          Ba = {Bavatar}
          // onRestart={resetGame} 
        />
      ) : (
        <>
          <ScoreBoard
            Aa = {Aavatar}
            Ba = {Bavatar}
            playerAScore={playerAScore} 
            playerBScore={playerBScore} 
          />
          
          <PongCanvas 
            canvasSize={canvasSize}
            ballPosition={ballPosition}
            playerAPaddle={playerAPaddle}
            playerBPaddle={playerBPaddle}
            onCanvasResize={setCanvasSize} 
          />

          <GameControls />
        </>
      )}
    </div>
  );
};

export default PongGame;