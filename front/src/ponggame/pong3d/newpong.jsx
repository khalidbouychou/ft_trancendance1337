'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// table component
const Table = () => (
  <mesh position={[0, -0.25, 0]} receiveShadow>
    <boxGeometry args={[10, 0.5, 20]} />
    <meshStandardMaterial color="green" />
  </mesh>
);

// paddle component
const Paddle = ({ position, controlKeys }) => {
  const paddleRef = useRef();
  const [x, setX] = useState(position[0]);

  useFrame(() => {
    const isLeftPressed = window.keyStates?.[controlKeys.left];
    const isRightPressed = window.keyStates?.[controlKeys.right];
    const move = (isRightPressed ? 0.15 : 0) - (isLeftPressed ? 0.15 : 0);

    setX((prev) => Math.min(Math.max(prev + move, -4.5), 4.5)); // constrain x between -4.5 and 4.5
    paddleRef.current.position.x = x;
  });

  useEffect(() => {
    if (position[2] < 0) {
      window.paddle1X = x;
    } else {
      window.paddle2X = x;
    }
  }, [x, position]);

  return (
    <mesh ref={paddleRef} position={[x, position[1], position[2]]} castShadow>
      <boxGeometry args={[1.5, 0.5, 0.75]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

// ball component
const Ball = ({ velocity, setVelocity }) => {
  const ballRef = useRef();
  const [position, setPosition] = useState([0, 0.3, 0]);

  useFrame(() => {
    const newPosition = [
      position[0] + velocity.x,
      position[1],
      position[2] + velocity.z
    ];

    // ball collision with table edges
    if (newPosition[0] > 4.8 || newPosition[0] < -4.8) {
      setVelocity({ ...velocity, x: -velocity.x });
    }

    // ball collision with paddles
    if ((newPosition[2] < -9.5 && newPosition[2] > -10.5) || (newPosition[2] > 9.5 && newPosition[2] < 10.5)) {
      const paddleX = newPosition[2] < 0 ? window.paddle1X : window.paddle2X;
      if (newPosition[0] > paddleX - 0.75 && newPosition[0] < paddleX + 0.75) {
        setVelocity({ 
          x: velocity.x + (Math.random() - 0.5) * 0.04, // some randomness here and there
          z: -velocity.z * 1.05 // zid speed slightly
        });
        newPosition[2] = newPosition[2] < 0 ? -9.5 : 9.5; // prevent ball from getting stuck in paddle
      }
    }

    // ball out of bounds
    if (newPosition[2] < -10.5 || newPosition[2] > 10.5) {
      newPosition[0] = 0;
      newPosition[1] = 0.3;
      newPosition[2] = 0;
      setVelocity({ x: (Math.random() - 0.5) * 0.3, z: 0.15 });
    }

    setPosition(newPosition);
    ballRef.current.position.set(...newPosition);
  });

  return (
    <mesh ref={ballRef} position={position} castShadow>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// camera component to handle responsive positioning
const ResponsiveCamera = () => {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const cameraRef = useRef();

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.aspect = aspect;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [aspect]);

  return <perspectiveCamera ref={cameraRef} position={[0, 15, 0]} fov={60} />;
};

// main app component
const App = () => {
  const [ballVelocity, setBallVelocity] = useState({ x: 0.15, z: 0.15 });

  useEffect(() => {
    if (!window.keyStates) {
      window.keyStates = {};
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
      <Canvas shadows >
        <ResponsiveCamera />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

        <Table />
        <Paddle position={[0, 0.25, -10]} controlKeys={{ left: 'a', right: 'd' }} />
        <Paddle position={[0, 0.25, 10]} controlKeys={{ left: 'arrowleft', right: 'arrowright' }} />
        <Ball velocity={ballVelocity} setVelocity={setBallVelocity} />
      </Canvas>
  );
};

export default App;

