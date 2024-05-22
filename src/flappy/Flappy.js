import React, { Component } from 'react';
//import logo from './logo.svg';
import './Flappy.css';
import { bg, fg, bird0, bird1, bird2, pipeN, pipeS, gameover, _ok_, splash, ready } from '../common/Sprite';
import { width, height } from '../common/common';
import { observer } from 'mobx-react';
import { rungame, states } from '../store/store';
import { CopyToClipboard } from 'react-copy-to-clipboard';



const SpriteWrapper = observer(
  class SpriteWrapper extends Component {
    render() {
      const gameSprite = this.props.gameSprite;
      const rotate = 'rotate(' + gameSprite.rotation + 'rad)';
      const translate = 'translate(' + gameSprite.cx + 'px,' + gameSprite.cy + 'px)';
      const ctrans = gameSprite.rotation == null ? translate : translate + ' ' + rotate;
      const onClickHandler = this.props.onClickHandler || null;
      const style = {
        transform: ctrans,
        position: 'absolute'
      };

      return (
        <div style={style} onClick={onClickHandler}>
          {this.props.children}
        </div>
      );
    }
  }
);

const Bg = observer(
  class Bg extends Component {
    render() {
      return <SpriteWrapper gameSprite={this.props.bg}> {bg} </SpriteWrapper>;
    }
  }
);


const Fg = observer(
  class Fg extends Component {
    render() {
      return <SpriteWrapper gameSprite={this.props.fg}> {fg} </SpriteWrapper>;
    }
  }
);

export const Bird = observer(
  class Bird extends Component {
    render() {
      let wbird;
      switch (this.props.bird.frame) {
        case 1:
        case 3:
          wbird = bird1;
          break;
        case 2:
          wbird = bird2;
          break;
        case 0:
        default:
          wbird = bird0;
          break;
      }

      return <SpriteWrapper gameSprite={this.props.bird}> {wbird} </SpriteWrapper>;
    }
  }
);


const Pipe = observer(
  class Pipe extends Component {
    render() {
      let wpipe;
      switch (this.props.pipe.type) {
        default:
        case "N":
          wpipe = pipeN;
          break;
        case "S":
          wpipe = pipeS;
          break;
      }

      return <SpriteWrapper gameSprite={this.props.pipe}> {wpipe} </SpriteWrapper>;
    }
  }
);


const Gameover = observer(
  class Gameover extends Component {
    render() {
      return <SpriteWrapper gameSprite={{ cx: width / 2 - 94, cy: height - 400 }}> {gameover} </SpriteWrapper>;
    }
  }
);


export const OK = observer(
  class OK extends Component {
    render() {
      return <SpriteWrapper gameSprite={{ cx: width / 2 - 40, cy: height - 340 }} onClickHandler={rungame}> {_ok_} </SpriteWrapper>;
    }
  }
);


export const Splash = observer(
  class Splash extends Component {
    render() {
      return <SpriteWrapper gameSprite={{ cx: width / 2 - 59, cy: height - 300 }}> {splash} </SpriteWrapper>;
    }
  }
);


export const Ready = observer(
  class Ready extends Component {
    render() {
      return <SpriteWrapper gameSprite={{ cx: width / 2 - 87, cy: height - 380 }}> {ready} </SpriteWrapper>;
    }
  }
);


const Flappy = observer(class Flappy extends Component {
  state = {
    isLoading: false,
    value: '',
    copied: false,
  };

  componentDidMount() {
    this.req = window.requestAnimationFrame(this.appUpdateFrame)
  }

  appUpdateFrame = () => {
    this.props.updateFrame();
    this.req = window.requestAnimationFrame(this.appUpdateFrame);
  }

  sendScore = () => {
    this.setState({ isLoading: true }); // Mostrar indicador de carga
    const score = this.props.game.score;
    const walletAddress = document.getElementById('walletAddress').value;

    fetch('https://galiens-api.onrender.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        points: score - 2 + "",
        wallet: walletAddress,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al enviar el puntaje');
        }
        return response.json();
      })
      .then(data => {
        console.log('Puntaje enviado correctamente:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { isLoading } = this.state;
    const { bgs, fgs, bird, pipes } = this.props.store
    const { currentstate } = this.props.game;
    const { score } = this.props.game;

    const style = {
      width: width,
      height: height
    }

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <div className='scoreContainer'>
            <span>Score: {score >= 2 ? score - 2 : 0}</span>
          </div>
          <div className="App" id="fakingcanvas" style={style}>
            {bgs.map((bg) => (<Bg bg={bg} key={bg.id} />))}
            {pipes.map((pipe) => (<Pipe pipe={pipe} key={pipe.id} />))}
            <Bird bird={bird} />
            {(currentstate === states.Score) ? <Gameover /> : null}
            {(currentstate === states.Score) ? <OK /> : null}
            {(currentstate === states.Splash) ? <Splash /> : null}
            {(currentstate === states.Splash) ? <Ready /> : null}
            {fgs.map((fg) => (<Fg fg={fg} key={fg.id} />))}
          </div>
        </div>
        <div>
          <div style={{ zIndex: "4" }}>
            
              <div className='scoreForm'>
                <span className='scoreText'>Submit score</span>
                <input className="inputWallet" id="walletAddress" type='text' placeholder='Wallet address'></input>
                <button onClick={this.sendScore} className='buttonSendScore' disabled={this.state.isLoading}>
                  {this.state.isLoading ? 'Sending...' : 'Send to leaderboard'}
                </button>
              </div>
            
          </div>
        </div>
        <div className='urlLink' title='Click to Copy'>
          <CopyToClipboard text={this.state.value}
            onCopy={() => this.setState({ copied: true })}>
            <span className='caCode'>CA: ------------</span>
          </CopyToClipboard>
        </div>
      </div>
    );
  }
});

export default Flappy;
