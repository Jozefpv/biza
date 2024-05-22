import { bg, fg, bird, pipe } from './asset';
import { height } from '../common/common';
import { bg_h, bg_w, fg_h, fg_w, pipe_h, pipe_w, bird_h, bird_w } from '../common/Sprite'; //To get sprite properties
import { action, observable } from 'mobx';

const bg1 = new bg(guid(), 0, height - bg_h);
const bg2 = new bg(guid(), bg_w, height - bg_h);
const fg1 = new fg(guid(), 0, height - fg_h);
const fg2 = new fg(guid(), fg_w, height - fg_h);

export const states = {
  Splash: 0,
  Game: 1,
  Score: 2
};

export const game = observable({
  currentstate: 0,
  score: 0,
});

export const store = {
  bird: new bird(guid(), 60, 0),
  fgpos: 0,
  frames: 1,
  bgs: [bg1, bg2],
  fgs: [fg1, fg2],
  pipes: observable([]),
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

const updateBird = function (bird) {
  bird.frame += store.frames % 10 === 0 ? 1 : 0;
  bird.frame %= bird.animation.length;

  if (game.currentstate === states.Splash) {
    bird.cy = height - 280 + 5 * Math.cos(store.frames / 10);
    bird.rotation = 0;
  } else {
    bird.velocity += bird.gravity;
    bird.cy += bird.velocity;

    if (bird.cy >= height - fg_h - 10) {
      bird.cy = height - fg_h - 10;
      if (game.currentstate === states.Game) {
        game.currentstate = states.Score;
      }
      bird.velocity = bird._jump;
    }

    if (bird.cy <= -10) {
      if (game.currentstate === states.Game) {
        game.currentstate = states.Score;
      }
      bird.velocity = bird._jump;
    }

    if (bird.velocity >= bird._jump) {
      bird.frame = 1;
      bird.rotation = Math.min(Math.PI / 2, bird.rotation + 0.3);
    } else {
      bird.rotation = -0.3;
    }
  }
};

const updatePipe = function () {
  if (store.frames % 100 === 0) {
    var _y = height - (pipe_h + fg_h + 120 + 200 * Math.random());
    store.pipes.push(
      new pipe(guid(), pipe_h, _y, "S"),
      new pipe(guid(), pipe_h, _y + 100 + pipe_h, "N")
    );
  }

  store.pipes.forEach((p) => {
    const bird = store.bird;
    var cx = Math.min(
      Math.max(bird.cx + bird_w / 2, p.cx),
      p.cx + pipe_w
    );
    var cy = Math.min(
      Math.max(bird.cy + bird_h / 2, p.cy),
      p.cy + pipe_h
    );

    var dx = bird.cx + bird_w / 2 - cx;
    var dy = bird.cy + bird_h / 2 - cy;

    var d1 = dx * dx + dy * dy;
    var r = bird.radius * bird.radius;

    if (r > d1) {
      game.currentstate = states.Score;
    }
    p.cx -= 2;
    if (p.cx < -pipe_w) {
      store.pipes.splice(0, 2);
    }
  });
};

export const birdjump = action(function (bird) {
  bird.velocity = -bird._jump;
});

export const rungame = action(function () {
  store.bird = new bird(guid(), 60, 130);
  store.fgpos = 0;
  store.frames = 1;
  store.pipes = observable([]);
  game.currentstate = states.Game;
  game.score = 0; // Reset the score when starting a new game
  
  // Calculamos el tiempo de referencia para el bucle de juego
  let lastFrameTimeMs = performance.now();
  
  // Función para el bucle de juego
  function gameLoop(timestamp) {
    // Calculamos el tiempo transcurrido desde la última actualización en milisegundos
    const elapsed = timestamp - lastFrameTimeMs;

    // Limitamos la velocidad de cuadros por segundo
    if (elapsed > frameTime) {
      lastFrameTimeMs = timestamp - (elapsed % frameTime);

      // Actualizamos el juego
      updateFrame();

      // Llamamos a gameLoop() de nuevo para el próximo frame
      requestAnimationFrame(gameLoop);
    } else {
      // Si no ha pasado suficiente tiempo, esperamos hasta el próximo frame
      requestAnimationFrame(gameLoop);
    }
  }

  // Comenzamos el bucle de juego
  lastFrameTimeMs = performance.now();
  requestAnimationFrame(gameLoop);
});

// Calculamos el tiempo de referencia para el bucle de juego
let lastFrameTimeMs = 0;

// Definimos la velocidad de cuadros por segundo deseada
const FPS = 60;

// Calculamos el tiempo entre cada actualización de cuadro en milisegundos
const frameTime = 1000 / FPS;

// Función para actualizar el juego en cada frame
export const updateFrame = action(function () {
  let elapsed = performance.now() - lastFrameTimeMs;

  while (elapsed >= frameTime) {
    store.frames++;
    store.fgpos = (store.fgpos - 2) % 14;
    fg1.cx = store.fgpos;
    fg2.cx = store.fgpos + fg_w;

    updateBird(store.bird);

    if (game.currentstate === states.Game) {
      updatePipe();
    }
    if (game.currentstate === states.Game) {
      game.score = Math.floor(store.frames / 100);
    }

    elapsed -= frameTime;
    lastFrameTimeMs += frameTime;
  }
});
