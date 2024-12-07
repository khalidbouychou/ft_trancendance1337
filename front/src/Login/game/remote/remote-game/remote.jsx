import React, { useEffect } from 'react'
import ScoreBoard from '../scoreboard/scoreboard';
import GameControls from '../gamecontrols/gamecontrols';
import WinnerOverlay from '../winnerdisplay/winnerdisplay';
import PongCanvas from '../canvaspong/canvaspong';
import { useNavigate } from 'react-router-dom';
const Remote = ({
    socket,
    winner,
    playerAScore,
    playerBScore,
    Aavatar,
    Bavatar,
    canvasSize,
    ballPosition,
    playerAPaddle,
    playerBPaddle,
    setCanvasSize,
    // resetGame
}) => {
    const navigate = useNavigate();
    return (
        <div className="game-container">
        {winner ? (
            <WinnerOverlay 
            winner={winner}
            BnewScore={playerBScore}
            AnewScore={playerAScore}
            Aa = {Aavatar}
            Ba = {Bavatar}
            socket={socket}
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
                navigate('/game');
                console.log(socket);
                socket.current.close();
            }
            }
            >
                Logout
            </button>
         </div>
        </>
      )}
    </div>
    )
}

export default Remote
