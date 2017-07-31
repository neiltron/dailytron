import Rectangle from './src/rectangle';
import dimensions from './src/dimensions';

import rotateZMatrix from './src/rotate_zmatrix.js';
import Tone from 'tone';
import StartAudioContext from 'startaudiocontext';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let boxesTotal = 1;
let boxes = [];

document.body.appendChild(canvas);

canvas.width = dimensions.width;
canvas.height = dimensions.height;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  let btn = document.createElement('span');
  btn.id = 'start_btn';
  btn.innerHTML = 'START';

  document.body.append(btn);

  StartAudioContext(Tone.context, btn, function(){
    btn.remove();
  });
}

StartAudioContext(Tone.context);

for (let i = 0; i < boxesTotal; i++) {
  boxes.push(new Rectangle({
    ctx: ctx,
    width: 20,
    height: 20,
    delay: i / 2,
    center: [
      (dimensions.width / boxesTotal) * (i + .5),
      dimensions.height / 2
    ],
  }));
}

function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  ctx.strokeStyle = '#faf';

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update()
    boxes[i].draw();
  }

  requestAnimationFrame(render);
}

render();
