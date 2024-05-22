import React from 'react'
import './wrapper.css'
import Flappy from '../flappy/Flappy'
import { store, updateFrame, birdjump, game, states, rungame } from '../store/store'
import Snowfall from 'react-snowfall';


function Wrapper() {

    const snowflake1 = document.createElement('img')
    snowflake1.src = "https://storage.googleapis.com/bittenbtcbucket/Untitled_Artwork%20(1).png"
    const snowflake2 = document.createElement('img')
    snowflake2.src = "https://storage.googleapis.com/bittenbtcbucket/Untitled_Artwork%20(1).png"

    const images = [snowflake1, snowflake2]
    return (
        <div className="wrapper">
            <div className='snow'>
                <Snowfall
                    style={{ backgroundColor: "transparent"}}
                    snowflakeCount={10}
                    images={images}
                    radius={[50, 180.0]}
                />
            </div>
            <div className='section_hero'>
                <div className='block_chara'>
                    <img src="https://storage.googleapis.com/bittenbtcbucket/COIN%20PNG%20(1).png" className='galien'></img>
                </div>
                <div className='block_logo'>
                    <div className='titleContainer'>
                        <img src="https://storage.googleapis.com/bittenbtcbucket/COIN%20PNG%20(1).png"  className='galienCoin' alt="Alien Fumeta" />
                        <span className='coinTitle'>BITcoin</span>
                    </div>
                    <div>
                        <Flappy store={store} updateFrame={updateFrame} game={game} />
                    </div>
                </div>
            </div>

        </div>
    )
}

function onpress(evt) {

    switch (game.currentstate) {
        default:
        case states.Splash:
            rungame()
            birdjump(store.bird)
            break
        case states.Game:
            birdjump(store.bird)
            break
        case states.Score:
            break
    }

}

document.addEventListener('mousedown', onpress);

export default Wrapper