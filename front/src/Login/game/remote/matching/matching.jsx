import React from 'react'
import './matching.css'
const Matching = () => {
    return (
        <>
        <div className='matching-container'>
            <div className="cover">
                <div className='img-name'>
                    <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGFobWZ3cThyenBsdzR2ZXBtOTVua2U1bjBqbGttbXJpNXhodmcxNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iJmDndjwTydcPEeu3p/giphy.gif" alt="avatar" />
                    <h1>Player 2</h1>
                </div>
             <div className='vs'>
                <h1>VS</h1>
            </div>
                <div className='img-name'>
                    <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="avatar" />
                    <h1>Player 1</h1>
                </div>
            </div>
                <button className="start-match">Start Match</button>

        </div>
        </>
    )
}

export default Matching
