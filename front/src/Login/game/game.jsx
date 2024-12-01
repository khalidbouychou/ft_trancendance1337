import { useState, useEffect, useRef, useCallback } from 'react';
import './style.css'
const Game = () => {
  const [isClicked, setIsClicked] = useState(false);
  let socket = new WebSocket('ws://localhost:8000/ws/game/');
  useEffect(() => {
    // socket = new WebSocket('ws://localhost:8000/ws/game/');
    socket.onopen = () => {
      console.log('WebSocket Client Connected');
      socket.send("Hi From Client");
    };
    socket.onmessage = (message) => {
      console.log("MESSAGE --------- ",message);
    }
    socket.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };
  }, [isClicked]);
 // Game state
 const [playerAScore, setPlayerAScore] = useState(0);
 const [playerBScore, setPlayerBScore] = useState(0);
 const [ballPosition, setBallPosition] = useState({ x: 250, y: 200 });
 const [ballAngle, setBallAngle] = useState(Math.PI / 4);
 const [ballSpeed, setBallSpeed] = useState(7);
 const [winner, setWinner] = useState(null);
 
 // Paddle and canvas state
 const [canvasSize, setCanvasSize] = useState({ width: 500, height: 400 });
 const [playerAPaddle, setPlayerAPaddle] = useState(150);
 const [playerBPaddle, setPlayerBPaddle] = useState(150);
 const playerATargetRef = useRef(150);
 const playerBTargetRef = useRef(150);

 // Game canvas and animation references
 const canvasRef = useRef(null);
 const animationRef = useRef(null);
 const containerRef = useRef(null);

 // Pressed keys tracking
 const keysPressed = useRef({
   w: false,
   s: false,
   ArrowUp: false,
   ArrowDown: false
 });




 // Reset game function
 const resetGame = useCallback(() => {
   setPlayerAScore(0);
   setPlayerBScore(0);
   setWinner(null);
   setBallPosition({ x: 250, y: 200 });
   setBallAngle(Math.PI / 4);
   setBallSpeed(5);
   setPlayerAPaddle(150);
   setPlayerBPaddle(150);
   playerATargetRef.current = 150;
   playerBTargetRef.current = 150;
 }, []);

 // Responsive canvas sizing
 useEffect(() => {
   const updateCanvasSize = () => {
     if (containerRef.current) {
       const container = containerRef.current;
       const width = container.clientWidth;
       const height = container.clientHeight;
       setCanvasSize({ width, height });
     }
   };

   // Initial size
   updateCanvasSize();

   // Responsive resize
   window.addEventListener('resize', updateCanvasSize);
   return () => window.removeEventListener('resize', updateCanvasSize);
 }, []);

 // Paddle movement and game logic
 const smoothMovePaddle = useCallback(() => {
   const { height } = canvasSize;
   const PADDLE_HEIGHT = height * 0.2; // 20% of canvas height
   const PADDLE_SPEED = height * 0.01; // Proportional speed

   // Player A paddle movement
   if (keysPressed.current.w && !keysPressed.current.s) {
     playerATargetRef.current = Math.max(0, playerATargetRef.current - PADDLE_SPEED);
   } else if (keysPressed.current.s && !keysPressed.current.w) {
     playerATargetRef.current = Math.min(height - PADDLE_HEIGHT, playerATargetRef.current + PADDLE_SPEED);
   }

   // Player B paddle movement
   if (keysPressed.current.ArrowUp && !keysPressed.current.ArrowDown) {
     playerBTargetRef.current = Math.max(0, playerBTargetRef.current - PADDLE_SPEED);
   } else if (keysPressed.current.ArrowDown && !keysPressed.current.ArrowUp) {
     playerBTargetRef.current = Math.min(height - PADDLE_HEIGHT, playerBTargetRef.current + PADDLE_SPEED);
   }

   // Smooth interpolation for Player A
   setPlayerAPaddle(prev => {
     if (prev < playerATargetRef.current) {
       return Math.min(prev + PADDLE_SPEED, playerATargetRef.current);
     } else if (prev > playerATargetRef.current) {
       return Math.max(prev - PADDLE_SPEED, playerATargetRef.current);
     }
     return prev;
   });

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

   const canvas = canvasRef.current;
   const ctx = canvas.getContext('2d');
   const { width, height } = canvasSize;

   const gameLoop = () => {
     // Smooth paddle movement
     smoothMovePaddle();

     // Use trigonometric functions for ball movement
     let newX = ballPosition.x + ballSpeed * Math.cos(ballAngle);
     let newY = ballPosition.y + ballSpeed * Math.sin(ballAngle);
     let newAngle = ballAngle;

     // Clear canvas
     ctx.clearRect(0, 0, width, height);

     // Paddle dimensions
     const PADDLE_WIDTH = width * 0.03;
     const PADDLE_HEIGHT = height * 0.2;

     // Draw paddles with different colors
     ctx.fillStyle = '#ffee00'; // Green paddle for Player A
     ctx.fillRect(0, playerAPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);
     
     ctx.fillStyle = '#e30000'; // Blue paddle for Player B
     ctx.fillRect(width - PADDLE_WIDTH, playerBPaddle, PADDLE_WIDTH, PADDLE_HEIGHT);

     // Wall collision (top and bottom)
     const BALL_RADIUS = width * 0.015;
     if (newY - BALL_RADIUS <= 0 || newY + BALL_RADIUS >= height) {
       newAngle = -newAngle;
     }

     // Improved paddle collision detection
     const hitLeftPaddle = 
       newX - BALL_RADIUS <= PADDLE_WIDTH && 
       newY >= playerAPaddle && 
       newY <= playerAPaddle + PADDLE_HEIGHT;
     
     const hitRightPaddle = 
       newX + BALL_RADIUS >= width - PADDLE_WIDTH && 
       newY >= playerBPaddle && 
       newY <= playerBPaddle + PADDLE_HEIGHT;

     if (hitLeftPaddle || hitRightPaddle) {
       // Calculate relative position on paddle
       const paddleCenter = hitLeftPaddle 
         ? playerAPaddle + PADDLE_HEIGHT / 2 
         : playerBPaddle + PADDLE_HEIGHT / 2;
       
       // Normalize the ball's position relative to paddle center
       const relativeIntersectY = newY - paddleCenter;
       const normalizedRelativeIntersection = Math.abs(relativeIntersectY / (PADDLE_HEIGHT / 2));

       // Check if hit is near the corner (first or last 20% of paddle)
       const isCornerHit = normalizedRelativeIntersection > 0.8;

       if (isCornerHit) {
         // For corner hits, use trigonometric calculation
         const bounceAngle = Math.PI / 3 * (relativeIntersectY < 0 ? -1 : 1);
         
         // Use cos and sin to calculate new direction
         newAngle = hitLeftPaddle
           ? bounceAngle
           : Math.PI - bounceAngle;
       } else {
         // Normal paddle hit - reflect with trigonometric precision
         const reflectionAngle = Math.PI - newAngle;
         
         // Adjust angle based on where the ball hits the paddle
         const angleModifier = Math.PI / 4 * (relativeIntersectY / (PADDLE_HEIGHT / 2));
         newAngle = reflectionAngle + angleModifier;
       }
       
       // Slightly increase speed on each paddle hit
       setBallSpeed(prev => Math.min(prev * 1.1, 10));
     }

     // Scoring
     if (newX - BALL_RADIUS <= 0) {
       const newScore = playerBScore + 1;
       setPlayerBScore(newScore);
       
       // Check for winner
       if (newScore >= 3) {
         setWinner('Player B');
         return;
       }
       
       newX = width / 2;
       newY = height / 2;
       newAngle = Math.PI / 4 * (Math.random() > 0.5 ? 1 : -1);
       setBallSpeed(5);
     }

     if (newX + BALL_RADIUS >= width) {
       const newScore = playerAScore + 1;
       setPlayerAScore(newScore);
       
       // Check for winner
       if (newScore >= 3) {
         setWinner('Player A');
         return;
       }
       
       newX = width / 2;
       newY = height / 2;
       newAngle = Math.PI / 4 * (Math.random() > 0.5 ? 1 : -1);
       setBallSpeed(5);
     }

     setBallPosition({ x: newX, y: newY });
     setBallAngle(newAngle);

     // Draw circular ball
     ctx.beginPath();
     ctx.fillStyle = '#FFFF'; // white ball
     ctx.arc(newX, newY, BALL_RADIUS, 0, Math.PI * 2);
     ctx.fill();

     // Continue the animation loop
     animationRef.current = requestAnimationFrame(gameLoop);
   };

   // Start the game loop
   animationRef.current = requestAnimationFrame(gameLoop);

   // Cleanup
   return () => {
     if (animationRef.current) {
       cancelAnimationFrame(animationRef.current);
     }
   };
 }, [ballPosition, ballAngle, ballSpeed, playerAPaddle, playerBPaddle, smoothMovePaddle, canvasSize, playerAScore, playerBScore, winner]);

 return (
   <div className="game-container">
     {winner ? (
       <div className="winner-overlay">
         <h2 className="winner-text">"{winner}" Wins!</h2>
         <p>Press SPACE to restart</p>
       </div>
     ) : (
       <>
         <div className="score-board">
           <span className="player-a-score">Player A: {playerAScore}</span>
           <span className="player-b-score">Player B: {playerBScore}</span>
         </div>
         
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

         <div className="game-controls">
           Controls: 
           <span className="player-a-controls">Player A (Left): W/S</span>
           <span className="player-b-controls">Player B (Right): Up/Down Arrows</span>
         </div>
         <div style={
            {
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundColor: 'red'
            }
         }>
          <button style={
            {
              position: 'absolute',
              width: 100,
              height: 30,
              backgroundColor: 'green',
              color: 'white'
            }
          }
          onClick={() => {
            console.log(socket);
            setIsClicked(true);
            // socket.close();
          }
          }
          >
            Logout
          </button>
         </div>
       </>
     )}
   </div>
 );
};

export default Game 
