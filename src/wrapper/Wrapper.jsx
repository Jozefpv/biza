import React from 'react'
import './wrapper.css'
import Flappy from '../flappy/Flappy'
import { store, updateFrame, birdjump, game, states, rungame } from '../store/store'
import Snowfall from 'react-snowfall';


function Wrapper() {

    const snowflake1 = document.createElement('img')
    snowflake1.src = "https://storage.googleapis.com/bittenbtcbucket/Pizza%20Day.png"
    const snowflake2 = document.createElement('img')
    snowflake2.src = "https://storage.googleapis.com/bittenbtcbucket/Pizza%20Day.png"

    const images = [snowflake1, snowflake2]
    return (
        <div className="wrapper">
            <div className='snow'>
                <Snowfall
                    style={{ backgroundColor: "transparent" }}
                    snowflakeCount={10}
                    images={images}
                    radius={[50, 180.0]}
                />
            </div>

            <div className='block_logo'>
                <div className='titleContainer'>
                    <div>
                        <span className='coinTitle'>BIZA</span>
                    </div>
                    <div className='coinBlock'>
                        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                            <span>Good pizza</span>
                            <span>for just</span>
                            <span>10,000 BTC</span>
                        </div>
                        <img src="https://storage.googleapis.com/bittenbtcbucket/Pizza%20Day.png" className='galienCoin' alt="Alien Fumeta" />
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