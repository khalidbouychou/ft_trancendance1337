import React, { useEffect, useState } from 'react';
import styl from './Game.module.css';
import _1vs1 from './assets/1vs1.jpeg';
import tic from './assets/tictac.jpeg';
import ping from './assets/ping.jpeg';
import tournoi from './assets/tournii.jpeg';
import team from './assets/tmvstm.jpeg';
import local from './assets/local.jpeg';
import { IoIosArrowBack } from "react-icons/io";
import PingGame from './components/PingGame/PingGame';
import TicTac from './components/TicTac/TicTac';

const Game = () => {
  const [pingpong, setPingPong] = useState(false);
  const [tictac, setTicTac] = useState(false);

  useEffect(() =>{
    console.log("set to false again");
    setPingPong(false);
    setTicTac(false);
  },[]);

  const showpong = () => {
    setPingPong(true);
  }

  const showtic = () => {
    setTicTac(true);
  }

  return (
    !pingpong && !tictac ? (
      <div className={styl.Game}>
        <div className={styl.content}>
          <div className={styl.head}>
            <h1>GAME</h1>
          </div>
          <div className={styl.cont}>
            <div className={styl.chouseGame}>
              <div className={styl.cardGame}>
                <div className={styl.game}>
                  <div className={styl.gameName}>
                    <p>Tic Tac Toe</p>
                  </div>
                  <button className={styl.image} onClick={showtic}>
                    <img src={tic} alt="Tic Tac Toe" />
                  </button>
                </div>
              </div>
              <div className={styl.cardGame}>
                <div className={styl.game}>
                  <div className={styl.gameName}>
                    <p>Ping Pong</p>
                  </div>
                  <button className={styl.image} onClick={showpong}>
                    <img src={ping} alt="Ping Pong" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <>
        {pingpong && <PingGame />}
        {tictac && <TicTac />}
      </>
    )
  );
};

export default Game;

              {/* <div className={styl.chouseGame}>
                <div className={styl.cardGame}>
                  <div className={styl.game}>
                    <div className={styl.gameName}>
                      <p >Tic Tac Toe</p>
                    </div>
                    <div className={styl.image}>
                      <img src={tic}/>
                    </div>
                  </div>
                </div>
                <div className={styl.cardGame}>
                <div className={styl.game}>
                    <div className={styl.gameName}>
                      <p >Ping Pong</p>
                    </div>
                    <div className={styl.image}>
                      <img src={ping}/>
                    </div>
                  </div>
                </div>
              </div> */}