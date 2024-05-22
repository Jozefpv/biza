import React from 'react'
import './about.css'

function About() {
    return (
        <div className="section_about" id='about'>
            {/*<img src={Galien} className='cloud_right'></img>*/}
            <img src="https://storage.googleapis.com/bittenbtcbucket/Untitled_Artwork%20(1).png" className='cloud_right'></img>
            <div className='section_block_about_wrapper'>
                <div className='block_about'>
                    <div className='title_paragraph'><span>About</span></div>
                    <div className='block_paragraph'>
                        <p className='para'>
                            <p style={{ display: 'block', paddingRight:"10px" }}>
                            I'm just a bitten coin
                            </p>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About