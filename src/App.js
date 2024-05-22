import React from 'react'
import Wrapper from './wrapper/Wrapper';
import Navbar from './navbar/navbar'
import Separator from './separator/separator'
import About from './about/about'
import Ranking from './ranking/ranking'
import Galienomics from './galienomics/galienomics';

import './App.css'

function App() {



  return (
    <div>
      <div className='background'>
      </div>
      <div style={{ zIndex: "10" }}>
        <Navbar />
        <Wrapper />
        <Separator/>
        <About/>
        <Separator/>
        <Ranking/>
        <Separator/>
        <Galienomics/>
        <Separator/>
      </div>
    </div>
  )
}

export default App