import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Table component
const Table = () => (
  <mesh position={[0, -1, 0]} receiveShadow>
    <boxGeometry args={[10, 0.5, 5]} />
    <meshStandardMaterial color="green" />
  </mesh>
);

// Paddle component
const Paddle = ({ position, controlKeys }) => {
  const paddleRef = useRef();
  const [x, setX] = useState(position[0]);

  useFrame(() => {
    // Check if the assigned control keys are pressed
    const isLeftPressed = window.keyStates?.[controlKeys.left];
    const isRightPressed = window.keyStates?.[controlKeys.right];
    const move = (isRightPressed ? 0.1 : 0) - (isLeftPressed ? 0.1 : 0);

    // Update the x position with constraints
    setX((prev) => Math.min(Math.max(prev + move, -4), 4)); // Constrain x between -4 and 4
    paddleRef.current.position.x = x; // Update the mesh position
  });

  return (
    <mesh ref={paddleRef} position={[x, position[1], position[2]]} castShadow>
      <boxGeometry args={[2, 0.5, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

// Ball component
const Ball = ({ velocity, setVelocity }) => {
  const ballRef = useRef();

  useFrame(() => {
    const pos = ballRef.current.position;

    // Update the ball's position (x and z only)
    pos.x += velocity.x;
    pos.z += velocity.z;

    // Ball collision with table edges
    if (pos.z > 2.4 || pos.z < -2.4) setVelocity({ ...velocity, z: -velocity.z }); // Reflect on z-axis
    if (pos.x > 4.5 || pos.x < -4.5) setVelocity({ ...velocity, x: -velocity.x }); // Reflect on x-axis
  });

  return (
    <mesh ref={ballRef} position={[0, 0, 0]} castShadow>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Main App component
const App = () => {
  const [ballVelocity, setBallVelocity] = useState({ x: 0.1, z: 0.1 }); // Ball moves in x-z plane

  // Initialize keyStates and add event listeners
  useEffect(() => {
    if (!window.keyStates) {
      window.keyStates = {}; // Initialize keyStates if it doesn't exist
    }

    const handleKeyDown = (e) => {
      window.keyStates[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      window.keyStates[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Canvas shadows>
      <ambientLight intensity={1} />
      <spotLight position={[15, 20, 5]} angle={0.3} castShadow />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      <Table />
      <Paddle position={[0, 0, -2.2]} controlKeys={{ left: 'w', right: 's' }} />
      <Paddle position={[0, 0, 2.2]} controlKeys={{ left: 'arrowleft', right: 'arrowright' }} />
      <Ball velocity={ballVelocity} setVelocity={setBallVelocity} />
    </Canvas>
  );
};

export default App;
