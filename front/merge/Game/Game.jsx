import React, { useState } from 'react';
import styl from './Game.module.css';
import _1vs1 from './assets/1vs1.jpeg';
import tic from './assets/tictac.jpeg';
import ping from './assets/ping.jpeg';
import tournoi from './assets/tournii.jpeg';
import team from './assets/tmvstm.jpeg';
import { IoIosArrowBack } from "react-icons/io";

// Array of card images
const cardImages = [_1vs1, tic, ping, tournoi, team];

const Game = () => {
  const [currentCards, setCurrentCards] = useState([0, 1, 2, 3]); // Indexes of the cards to display

  // Function to handle the left arrow click
  const handleLeftArrowClick = () => {
    setCurrentCards(prev =>
      prev.map(index => (index - 1 + cardImages.length) % cardImages.length)
    );
  };

  // Function to handle the right arrow click
  const handleRightArrowClick = () => {
    setCurrentCards(prev =>
      prev.map(index => (index + 1) % cardImages.length)
    );
  };

  return (
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
              </div>
          {/* <div className={styl.pingPong}>
            <div className={styl.card}>
              <div className={styl.cardName}>
                <p >Local</p>
              </div>
              <div className={styl.Image}>
                <img src={_1vs1}/>
              </div>
            </div>
            <div className={styl.card}>
              <div className={styl.cardName}>
                <p >1 Vs 1</p>
              </div>
              <div className={styl.Image}>
                <img src={_1vs1}/>
              </div>
            </div>
            <div className={styl.card}>
              <div className={styl.cardName}>
                <p >Tournament</p>
              </div>
              <div className={styl.Image}>
                <img src={_1vs1}/>
              </div>
            </div>
            <div className={styl.card}>
              <div className={styl.cardName}>
                <p >Local Team</p>
              </div>
              <div className={styl.Image}>
                <img src={_1vs1}/>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
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