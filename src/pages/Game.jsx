import React, {useRef, useEffect, useState } from 'react';
import * as styles from './Game.module.css';
// import { useFetcher } from 'react-router-dom';

function Game() {
    const rightScore = 0;
    const leftScore = 0;

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let centerX = 0;
        let centerY = 0;
        let ballx = 0;
        let bally = 0;
        const ballspeed = 1;
        let width = 0;
        let racketHeight = 0;
        let racketWidth = 0;
        let leftRacketY = 0;
        let rightRacketY = 0;
    
        const drawball = () => {

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            centerX = ((canvas.width / 2) + ballx);
            centerY = ((canvas.height / 2) + bally);
            
            ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0000';
            ctx.fill();

        };

        const gamelogic = () => {
            ballx += ballspeed;
            if ((canvas.width / 2) + ballx + 15 >= canvas.width)
                ballx = 0;

        };

        const drawLeftRacket = () => {
            ctx.fillStyle = '#00FF00';
            width = (canvas.width * 2.5 / 100);
            if (width > 16)
                width = 16;
            ctx.fillRect(0, leftRacketY, width, (canvas.height * 20 / 100));
        }

        const drawRightRacket = () => {
            ctx.fillStyle = '#00FF00';
            width = (canvas.width * 2.5 / 100);
            if (width > 16)
                width = 16;
            ctx.fillRect(canvas.width-width, rightRacketY, width, (canvas.height * 20 / 100));
        }

        
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawball();
            drawLeftRacket();
            drawRightRacket();
            gamelogic();

            
            requestAnimationFrame(draw);
        };

        // const pressedKeys = useRef(new Set());

        // const checkDirection = (keys) => {
        //     console.log("before",leftRacketY, rightRacketY);
        //     const speed = 25;
        //     for (let i = 0; i < keys.length;i++){
        //         if (keys.includes('w')){
        //             leftRacketY = Math.max(leftRacketY - speed, 0);
        //         }
        //         else if (keys.includes('s')){
        //             leftRacketY = Math.min(rightRacketY + speed, canvas.height - racketHeight);
        //         }
        //         if (keys.includes('ArrowUp')){
        //             rightRacketY = Math.max(rightRacketY - speed, 0);
        //         }
        //         else if (keys.includes('ArrowDown')){
        //             rightRacketY = Math.min(rightRacketY + speed, canvas.height - racketHeight);
        //         }
        //     }
        //     console.log("after", leftRacketY, rightRacketY);
        // };

        // const handleKeyDown = (event) => {
        //     pressedKeys.current.add(event.key);
        //     // console.log(`Keys pressed: ${Array.from(pressedKeys.current).join(', ')}`);
        //     checkDirection(Array.from(pressedKeys.current));
        // };

        // const handleKeyUp = (event) => {
        //     pressedKeys.current.delete(event.key); 
        //     // console.log(`Keys pressed: ${Array.from(pressedKeys.current).join(', ')}`);
        //     checkDirection(Array.from(pressedKeys.current));
        // };

        requestAnimationFrame(draw);

        // window.addEventListener('keydown', handleKeyDown);
        // window.addEventListener('keyup', handleKeyUp);
        // return () => {
        //     window.removeEventListener('keydown', handleKeyDown);
        //     window.removeEventListener('keyup', handleKeyUp);
        // };

    }, []);
    
    // const pressedKeys = useRef(new Set());

    // const checkDirection = (keys) => {
    //     const speed = 25;
    //     for (let i = 0; i < keys.length;i++){
    //         if (keys.includes('w')){
    //             leftRacketY = (prevY => Math.max(prevY - speed, 0));
    //         }
    //         else if (keys.includes('s')){
    //             leftRacketY = (prevY => Math.min(prevY + speed, canvas.height - racketHeight));
    //         }
    //         if (keys.includes('ArrowUp')){
    //             rightRacketY = (prevY => Math.max(prevY - speed, 0));
    //         }
    //         else if (keys.includes('ArrowDown')){
    //             rightRacketY = (prevY => Math.min(prevY + speed, canvas.height - racketHeight));
    //         }
    //     }
    // };

    // useEffect(() => {
        
    //     const handleKeyDown = (event) => {
    //         pressedKeys.current.add(event.key);
    //         // console.log(`Keys pressed: ${Array.from(pressedKeys.current).join(', ')}`);
    //         checkDirection(Array.from(pressedKeys.current));
    //     };

    //     const handleKeyUp = (event) => {
    //         pressedKeys.current.delete(event.key); 
    //         // console.log(`Keys pressed: ${Array.from(pressedKeys.current).join(', ')}`);
    //         checkDirection(Array.from(pressedKeys.current));
    //     };

    //     window.addEventListener('keydown', handleKeyDown);
    //     window.addEventListener('keyup', handleKeyUp);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //         window.removeEventListener('keyup', handleKeyUp);
    //     };
    // }, []);

    // useEffect(() => {
    //     draw();
    // }, []);

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