import multiplyMatrixAndPoint from './multiply_matrix';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let WIDTH = document.body.clientWidth;
let HEIGHT = document.body.clientHeight;
let boxWidth = WIDTH / 10;
let boxHeight = HEIGHT / 5;
let rectScale = WIDTH / 50;
let mouseX = WIDTH / 2;
let mouseY = HEIGHT / 2;
let points = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0]
];
let time = 0;
let boxesTotal = 4;

document.body.appendChild(canvas);

canvas.width = WIDTH;
canvas.height = HEIGHT;

document.addEventListener('mousemove', updateMousePos, true);
document.addEventListener('touchmove', updateMousePos, true);

function updateMousePos(e) {
  if (typeof e.touches !== 'undefined') {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  } else {
    mouseX = e.pageX;
    mouseY = e.pageY;
  }
}

var rotateZMatrix;

function mouseRotation() {
  return [
    Math.sin((WIDTH - mouseX) / WIDTH / 10) / 2,
    Math.sin((HEIGHT - mouseY) / HEIGHT / 10) / 2
  ]
}

function timeRotation() {
  let divisor = ('ontouchstart' in window) ? 10 : 5;

  return [
    (Math.sin(time / 1000) + 1) / divisor,
    (Math.cos(time / 1000) + 1) / divisor
  ];
}

function render () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  let rotation = timeRotation();

  var a = Math.PI * Math.sin(rotation[0]);
  var b = Math.PI * Math.sin(rotation[1]);

  rotateZMatrix = [
    Math.cos(a), -Math.sin(b),    0, 0,
    Math.sin(a),  Math.cos(b),    0, 0,
         0,       0,    1,    0,
         0,       0,    0,    1
  ];

  draw();

  requestAnimationFrame(render);
}

render();

function draw() {
  ctx.strokeStyle = '#eee';

  time = Date.now();

  for (let i = 0; i < boxesTotal; i++) {
    ctx.lineWidth = 2;

    let point = new Point(points[0], i);
    let boxWidth = (point[0] * rectScale) / 2;
    let adjustment = ((WIDTH / boxesTotal) * i / 2);
    let adjustmentX = adjustment + WIDTH / (boxesTotal * 100);
    let adjustmentY = HEIGHT / -8;

    ctx.beginPath();
    ctx.moveTo(point[0] + adjustmentX, point[1] + adjustmentY);

    for (var j = 1; j < points.length; j++) {
      let point = new Point(points[j], i);

      ctx.lineTo(point[0] + adjustmentX, point[1] + adjustmentY);
    }

    ctx.closePath();
    ctx.stroke();
  }
}

function Point (point, i) {
  let boxWidth = (point[0] * rectScale);
  let boxHeight = (point[1] * rectScale);
  let boxAdjust = rectScale * boxesTotal;
  let boxAdjustY = (HEIGHT - boxAdjust) / 1.25 + (i * 10);

  let coords = [
    (boxWidth  * boxesTotal),
    boxAdjustY + (boxHeight * boxesTotal),
    1, 1
  ];

  // return coords;
  return multiplyMatrixAndPoint(rotateZMatrix, coords);
}