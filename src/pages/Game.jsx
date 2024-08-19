import React, {useRef, useEffect, useState } from 'react';
import * as styles from './Game.module.css';
// import { useFetcher } from 'react-router-dom';

function Game() {
    

    const pressedKeys = useRef(new Set());
    const [ rightScore, setRightScore ] = useState(0);
    const [ leftScore, setLeftScore ] = useState(0);

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let centerX = 0;
        let centerY = 0;
        let ballx = 0;
        let bally = 0;
        let speed = 10;
        let ballspeed = 7.5;
        let balldirectionX = 1;
        let balldirectionY = 1;
        let racketHeight = 0;
        let racketWidth = 0;
        let leftRacketY = 0;
        let rightRacketY = 0;
        let myReq;
    
        const drawball = () => {

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            centerX = ((canvas.width / 2) + ballx);
            centerY = ((canvas.height / 2) + bally);
            
            ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0000';
            ctx.fill();

        };

        const drawLeftRacket = () => {
            ctx.fillStyle = '#00FF00';
            racketWidth = (canvas.width * 2.5 / 100);
            if (racketWidth > 16)
                racketWidth = 16;
            racketHeight = (canvas.height * 20 / 100);
            ctx.fillRect(0, leftRacketY, racketWidth, racketHeight);
        }

        const drawRightRacket = () => {
            ctx.fillStyle = '#00FF00';
            racketWidth = (canvas.width * 2.5 / 100);
            if (racketWidth > 16)
                racketWidth = 16;
            racketHeight = (canvas.height * 20 / 100);
            ctx.fillRect(canvas.width-racketWidth, rightRacketY, racketWidth, racketHeight);
        }

        const gamelogic = () => {
            ballx += ballspeed * balldirectionX;
            bally += ballspeed * balldirectionY;

            if (rightRacketY <= ((canvas.height / 2) + bally - 15) && rightRacketY+racketHeight >= ((canvas.height / 2) + bally + 15) && ((canvas.width / 2) + ballx + 15) >= (canvas.width - racketWidth)){
                balldirectionX *= -1;
            }
            else if (leftRacketY <= ((canvas.height / 2) + bally - 15) && leftRacketY+racketHeight >= ((canvas.height / 2) + bally + 15) && ((canvas.width / 2) + ballx - 15) <= (0 + racketWidth)){
                balldirectionX *= -1;
            }
            else if (((canvas.height / 2) + bally - 15) <= 0){
                balldirectionY *= -1;
            }
            else if (((canvas.height / 2) + bally + 15) >= canvas.height){
                balldirectionY *= -1;
            }
            else if ((canvas.width / 2) - 15 < ballx){
                ballx = 0;
                bally = 0;
                if (balldirectionX < 0)
                    balldirectionX *= -1;
                if (balldirectionY < 0)
                    balldirectionY *= -1;
                setRightScore(prevScore => prevScore + 1);
            }
            else if (-(canvas.width / 2) + 15 > ballx){
                ballx = 0;
                bally = 0;
                if (balldirectionX < 0)
                    balldirectionX *= -1;
                if (balldirectionY < 0)
                    balldirectionY *= -1;
                setLeftScore(prevScore => prevScore + 1);
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (pressedKeys.current.has('w')) {
                leftRacketY = Math.max(leftRacketY - speed, 0);
            }
            if (pressedKeys.current.has('s')) {
                leftRacketY = Math.min(leftRacketY + speed, canvas.height - racketHeight);
            }
            if (pressedKeys.current.has('ArrowUp')) {
                rightRacketY = Math.max(rightRacketY - speed, 0);
            }
            if (pressedKeys.current.has('ArrowDown')) {
                rightRacketY = Math.min(rightRacketY + speed, canvas.height - racketHeight);
            }

            drawball();
            drawLeftRacket();
            drawRightRacket();
            gamelogic();


            return requestAnimationFrame(draw);
        };

        const handleKeyDown = (event) => {
            pressedKeys.current.add(event.key);
        };

        const handleKeyUp = (event) => {
            pressedKeys.current.delete(event.key);
        };

        myReq = requestAnimationFrame(draw);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(myReq);
        };
    }, []);

    return (
        <>
            <div className={styles.gameContainer}>
                <div className={styles.topgame}>
                    <div className={styles.player}>
                        <img src="assets/icons/mel-jira.jpeg" className={styles.userImg}/>
                        <div className={styles.playerInfo}>
                            <h2>Mohammed</h2>
                            <p>use W to move up && S to move down</p>
                            <h3>score: {leftScore}</h3>
                        </div>
                    </div>
                    <div className={styles.player}>
                        <img src="assets/icons/mel-jira.jpeg" className={styles.userImg}/>
                        <div className={styles.playerInfo}>
                            <h2>Reda</h2>
                            <p>use ↑ to move up && ↓ to move down</p>
                            <h3>score: {rightScore}</h3>
                        </div>
                    </div>
                </div>
                <canvas id="canvas" className={styles.canvass}></canvas>
            </div>
        </>
    );
}

export default Game;