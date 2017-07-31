import multiplyMatrixAndPoint from './multiply_matrix';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let WIDTH = document.body.clientWidth;
let HEIGHT = document.body.clientHeight;
let boxWidth = WIDTH / 10;
let boxHeight = HEIGHT / 5;
let rectScale = 20;
let mouseX = WIDTH / 2;
let mouseY = HEIGHT / 2;
let points = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0]
];
let time = 0;
let boxesTotal = 10;

document.body.appendChild(canvas);

canvas.width = WIDTH;
canvas.height = HEIGHT;

document.addEventListener('mousemove', updateMousePos, true);
document.addEventListener('touchmove', updateMousePos, true);

function updateMousePos(e) {

  console.log(e.touches);

  mouseX = e.pageX;
  mouseY = e.pageY;
}

var rotateZMatrix;

function render () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  var a = Math.PI * Math.sin((WIDTH - mouseX) / WIDTH / 2);
  var b = Math.PI * Math.sin((HEIGHT - mouseY) / HEIGHT / 2);

  // Rotate around Z axis
  rotateZMatrix = [
    Math.cos(a), Math.sin(b),    0, 0,
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
    // ctx.lineWidth = ((boxesTotal - i) / boxesTotal);
    ctx.lineWidth = 1;

    let point = new Point(points[0], i);
    let boxWidth = (point[0] * rectScale) / (boxesTotal * i) / 2;
    let adjustment = (((rectScale * boxesTotal) + (rectScale * i)) / 2);
    let adjustmentX = adjustment  + (rectScale * (boxesTotal + 1)) - (boxWidth / 2) * Math.sin(time / 1000);
    let adjustmentY = rectScale * (boxesTotal - i) * Math.cos(time / 1000);

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
  let boxWidth = (point[0] * rectScale) / (boxesTotal - i);
  let boxHeight = (point[1] * rectScale) / (boxesTotal - i);
  let boxAdjust = rectScale * boxesTotal;
  let boxAdjustX = ((boxAdjust));
  let boxAdjustY = (HEIGHT - boxAdjust) / 1.25;

  let coords = [
    boxAdjustX + (boxWidth  * boxesTotal),
    boxAdjustY + (boxHeight * boxesTotal),
    1, 1
  ];

  // return coords;
  return multiplyMatrixAndPoint(rotateZMatrix, coords);
}