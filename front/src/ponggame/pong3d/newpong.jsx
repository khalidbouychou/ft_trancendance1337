import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
import * as styles from './newpong.module.css';
import { useNavigate } from 'react-router-dom';
import * as THREE from "three";
import { use } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



export default function LocalNewGame() {
  const [rightScore, setRightScore] = useState(0);
  const [leftScore, setLeftScore] = useState(0);
  const [condition, setCondition] = useState('R');
  const [winner, setWinner] = useState('jow shmo');
  const [winner_score, setScore] = useState(-1);
  let myReq;
  let left_score = 0;
  let right_score = 0;
  let bonus = 0;
  let speed = 0.2;
  const pressedKeys = useRef(new Set());
  let mycondition = 'R';


  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.x = -9.5;
    camera.position.y = 14;
    camera.position.z = 0;
    const controls = new OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.BoxGeometry(10, 0.25, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0x4AC112 });
    const table = new THREE.Mesh(geometry, material);
    scene.add(table);

    const geometry2 = new THREE.SphereGeometry(0.2, 32, 32);
    const material2 = new THREE.MeshBasicMaterial({ color: 'red' });
    const ball = new THREE.Mesh(geometry2, material2);
    scene.add(ball);
    ball.position.x = 0;
    ball.position.y = 0.3;
    ball.position.z = 0;

    const geometry3 = new THREE.BoxGeometry(1.5, 0.5, 0.75);
    const material3 = new THREE.MeshBasicMaterial({ color: 'blue' });
    const rightpaddle = new THREE.Mesh(geometry3, material3);
    scene.add(rightpaddle);
    rightpaddle.position.x = 0;
    rightpaddle.position.y = 0.3;
    rightpaddle.position.z = 10;

    const geometry4 = new THREE.BoxGeometry(1.5, 0.5, 0.75);
    const material4 = new THREE.MeshBasicMaterial({ color: 'purple' });
    const leftpaddle = new THREE.Mesh(geometry4, material4);
    scene.add(leftpaddle);
    leftpaddle.position.x = 0;
    leftpaddle.position.y = 0.3;
    leftpaddle.position.z = -10;

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const ballspeed = 0.1;
    let balldirectionX = 1;
    let balldirectionZ = 1;
    const numbers = [-1, 1];
    const gamelogic = () => {
      ball.position.x += (ballspeed+bonus) * balldirectionX;
      ball.position.z += (ballspeed+bonus) * balldirectionZ;
      if (ball.position.x >= 5 && ball.position.x <= 10) {
        balldirectionX *= -1;
      } else if (ball.position.x <= -5 && ball.position.x >= -10) {
        balldirectionX *= -1;
      }
      else if (ball.position.z >= 9.5 && ball.position.z <= 10 && ball.position.x >= rightpaddle.position.x - 0.75 && ball.position.x <= rightpaddle.position.x + 0.75) {
        balldirectionZ *= -1;
        bonus += 0.01;
      }
      else if (ball.position.z <= -9.5 && ball.position.z >= -10 && ball.position.x >= leftpaddle.position.x - 0.75 && ball.position.x <= leftpaddle.position.x + 0.75) {
        balldirectionZ *= -1;
        bonus += 0.01;
      }
      else if (ball.position.z >= 10) {
        setLeftScore(prevScore => prevScore + 1);
        left_score++;
        ball.position.x = 0;
        ball.position.z = 0;
        balldirectionZ = numbers[Math.floor(Math.random() * numbers.length)];
        bonus = 0;
        if (left_score >= 5){
          setCondition('S');
          mycondition = 'S';
          document.getElementById('result').style.display = "block";
          setWinner("Left Player");
          setScore(3);
        }
      }
      else if (ball.position.z <= -10) {
        setRightScore(prevScore => prevScore + 1);
        ball.position.x = 0;
        ball.position.z = 0;
        balldirectionZ = numbers[Math.floor(Math.random() * numbers.length)];
        right_score++;
        bonus = 0;
        if (right_score >= 5){
          setCondition('S');
          mycondition = 'S';
          document.getElementById('result').style.display = "block";
          setWinner("Right Player");
          setScore(3);
        }
      }
    }

    const animate = () => {
      if (mycondition === 'S') {
        cancelAnimationFrame(myReq);
        return;
      }

      if (pressedKeys.current.has('w')) {
        if (leftpaddle.position.x + speed <= 4.25) {
          leftpaddle.position.x += speed;
        }
      }
      else if (pressedKeys.current.has('s')) {
        if (leftpaddle.position.x - speed >= -4.25) {
          leftpaddle.position.x -= speed;
        }
        // leftpaddle.position.x = Math.max(leftpaddle.position.x + speed, -5);
      }
      if (pressedKeys.current.has('ArrowUp')) {
        if (rightpaddle.position.x + speed <= 4.25) {
          rightpaddle.position.x += speed;
        }
        // rightpaddle.position.x = Math.max(rightpaddle.position.x - speed, 0);
      }
      else if (pressedKeys.current.has('ArrowDown')) {
        if (rightpaddle.position.x - speed >= -4.25) {
          rightpaddle.position.x -= speed;
        }
        // rightpaddle.position.x = Math.min(rightpaddle.position.x + speed, -4.25);
      }

      renderer.render(scene, camera);
      controls.update();
      gamelogic();
      // console.log("ballX", ball.position.x, "ballZ", ball.position.z);
      const currentPath = window.location.pathname;
      if (currentPath === '/games/pong3d' && condition === 'R')
      {
          return requestAnimationFrame(animate);
      }else
      {
          return cancelAnimationFrame(myReq);
      }
    };
    const handleKeyDown = (event) => {
      pressedKeys.current.add(event.key);
    };

    const handleKeyUp = (event) => {
        pressedKeys.current.delete(event.key);
    };

    myReq = requestAnimationFrame(animate);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose(); // Dispose the renderer
      controls.dispose(); // Dispose the controls
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(myReq);
    };
  }, []);

  const navigate = useNavigate();

  const handleExitClick = () => {
      navigate('/games');
  };

  return (
    <>
      <div id="result" className={styles.result}>
        <div className={styles.centered}>
          <div className={styles.holderx}>
            <div className={styles.holderx}>
              <h4>Winner {winner} by {winner_score}</h4>
              <div className={styles.buttoncontainer}>
                <div className={styles.Button}>
                  <button onClick={handleExitClick}>Exit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gameContainer}>
        <div className={styles.topgame}>
          <div className={styles.side}>
            <img src="/assets/superior.png" className={styles.Img} alt="Left Player" />
            <p>Left Player</p>
          </div>
          <div className={styles.side} style={{justifyContent: 'end'}}>
            <p>Right Player</p>
            <img src="/assets/battlebeast.png" className={styles.Img} alt="Right Player" />
          </div>
          <div className={styles.score}>
            <p>{leftScore}</p>
            <p>:</p>
            <p>{rightScore}</p>
          </div>
        </div>
        <canvas ref={canvasRef} className={styles.canvass}/>
      </div>
    </>
  );
}
