import Shape from './src/shape';
import Constraint from './src/constraint';
import dimensions from './src/dimensions';
import { vec2 } from 'gl-matrix';
import { canvas, ctx } from './src/canvas';
import { parseSVG, makeAbsolute } from 'svg-path-parser';
import mouse from './src/mousemove';

document.body.appendChild(canvas);
ctx.strokeStyle = '#fff';

let shapes = [];
let connectors = [];


let threshold = 100;
let scale = (dimensions.height / 4000);
let top = 1200 * scale;
let letterWidth = 1200 * scale;

function drawChar(svg, pos, offset) {
  let points = parseSVG(svg);
  makeAbsolute(points);

  ctx.beginPath();

  let x;
  let y;
  let x0;
  let y0;
  let x1;
  let y1;

  for (let i = 0; i < points.length; i++) {
    let inst = points[i];

    switch (inst.command) {
      case 'moveto':
        x = (inst.x * scale) + pos.x;
        y = (inst.y * scale) + pos.y;

        moveTo(x, y, offset);

        break;

      case 'quadratic curveto':
        x = inst.x * scale + pos.x;
        y = inst.y * scale + pos.y;
        x0 = inst.x0 * scale + pos.x;
        y0 = inst.y0 * scale + pos.y;
        x1 = inst.x1 * scale + pos.x;
        y1 = inst.y1 * scale + pos.y;

        bezierCurveTo(x, y, x0, y0, x1, y1, offset);

        break;

      case 'smooth quadratic curveto':
        x = inst.x * scale + pos.x;
        y = inst.y * scale + pos.y;
        x0 = inst.x0 * scale + pos.x;
        y0 = inst.y0 * scale + pos.y;

        quadraticCurveTo(x, y, x0, y0, offset);

        break;

      case 'vertical lineto':
        y = inst.y * scale + pos.y;

        lineTo(x, y, offset);

        break;

      case 'horizontal lineto':
        x = inst.x * scale + pos.x;

        lineTo(x, y, offset);

        break;

      case 'lineto':
        x = inst.x * scale + pos.x;
        y = inst.y * scale + pos.y;

        lineTo(x, y, offset);

        break;

      case 'closepath':
        // console.log('closep');
        ctx.closePath();
        break;
    }
  }

  ctx.closePath();
  ctx.stroke();
  // ctx.fill();
}

function moveTo (x, y, offset) {
  if (offset > 0) {
    let pos = vec2.fromValues(x, y);
    let mousePos = vec2.fromValues(mouse.position[0], mouse.position[1]);
    let distance = vec2.distance(pos, mousePos);

    // if (distance < threshold) {
      let distanceX = (threshold / distance) * (mouse.position[0] - x);
      let distanceY = (threshold / distance) * (mouse.position[1] - y);

      x += distanceX / offset;
      y += distanceY / offset;
    // }
  }

  ctx.moveTo(x, y);
}

function lineTo (x, y, offset) {
  if (offset > 0) {
    let pos = vec2.fromValues(x, y);
    let mousePos = vec2.fromValues(mouse.position[0], mouse.position[1]);
    let distance = vec2.distance(pos, mousePos);

    // if (distance < threshold) {
      let distanceX = (threshold / distance) * (mouse.position[0] - x);
      let distanceY = (threshold / distance) * (mouse.position[1] - y);

      x += distanceX / offset;
      y += distanceY / offset;
    // }
  }

  ctx.lineTo(x, y);
}

function bezierCurveTo (x, y, x0, y0, x1, y1, offset) {
  if (offset > 0) {
    let _pos = vec2.fromValues(x, y);
    let mousePos = vec2.fromValues(mouse.position[0], mouse.position[1]);
    let distance = vec2.distance(_pos, mousePos);

    if (distance < threshold) {
      let distanceX = (threshold / distance) * (mouse.position[0] - x);
      let distanceY = (threshold / distance) * (mouse.position[1] - y);

      x += distanceX / offset;
      y += distanceY / offset;

      x0 += distanceX / offset;
      y0 += distanceY / offset;

      x1 += distanceX / offset;
      y1 += distanceY / offset;
    }
  }

  ctx.bezierCurveTo(x0, y0, x1, y1, x, y);
}

function quadraticCurveTo (x, y, x0, y0, offset) {
  if (offset > 0) {
    let _pos = vec2.fromValues(x, y);
    let mousePos = vec2.fromValues(mouse.position[0], mouse.position[1]);
    let distance = vec2.distance(_pos, mousePos);

    if (distance < threshold) {
      let distanceX = (threshold / distance) * (mouse.position[0] - x);
      let distanceY = (threshold / distance) * (mouse.position[1] - y);

      x += distanceX / offset;
      y += distanceY / offset;

      x0 += distanceX / offset;
      y0 += distanceY / offset;
    }
  }

  ctx.quadraticCurveTo(x0, y0, x, y);
}


// for (let i = 0; i < 1; i++) {
//   shapes.push(new Shape({
//     sides: Math.floor(Math.random() * 20 + 10),
//     radius: dimensions.height / 3
//   }));

//   if (i > 0) {
//     // connectors.push(
//     //   new Constraint({
//     //     points: [
//     //       shapes[i].points[shapes[i].points.length - 1],
//     //       shapes[i - 1].points[0]
//     //     ],
//     //     restingDistance: 100,
//     //     stiffness: .2
//     //   })
//     // );

//     // connectors.push(
//     //   new Constraint({
//     //     points: [
//     //       shapes[i].points[0],
//     //       shapes[i - 1].points[shapes[i - 1].points.length - 1]
//     //     ],
//     //     restingDistance: 100,
//     //     stiffness: .2
//     //   })
//     // );
//   }
// }


function render () {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  drawChar('M565 598l-154 -169v-429h-282v1456h282v-667l132 178l354 489h344l-490 -644l508 -812h-334z', { x: 0, y: top }, 0)
  drawChar('M565 598l-154 -169v-429h-282v1456h282v-667l132 178l354 489h344l-490 -644l508 -812h-334z', { x: 0, y: top }, 1)
  drawChar('M565 598l-154 -169v-429h-282v1456h282v-667l132 178l354 489h344l-490 -644l508 -812h-334z', { x: 0, y: top }, 2)
  drawChar('M565 598l-154 -169v-429h-282v1456h282v-667l132 178l354 489h344l-490 -644l508 -812h-334z', { x: 0, y: top }, 3)
  drawChar('M565 598l-154 -169v-429h-282v1456h282v-667l132 178l354 489h344l-490 -644l508 -812h-334z', { x: 0, y: top }, 4)

  drawChar('M432 227h682v-227h-964v1456h282v-1229z', { x: letterWidth, y: top }, 0)
  drawChar('M432 227h682v-227h-964v1456h282v-1229z', { x: letterWidth, y: top }, 1)
  drawChar('M432 227h682v-227h-964v1456h282v-1229z', { x: letterWidth, y: top }, 2)
  drawChar('M432 227h682v-227h-964v1456h282v-1229z', { x: letterWidth, y: top }, 3)
  drawChar('M432 227h682v-227h-964v1456h282v-1229z', { x: letterWidth, y: top }, 4)

  drawChar('M476 1456l138 -547l157 547h349v-1456h-258v431l12 681l-191 -632h-139l-171 605l12 -654v-431h-258v1456h349z', { x: letterWidth * 2, y: top }, 0)
  drawChar('M476 1456l138 -547l157 547h349v-1456h-258v431l12 681l-191 -632h-139l-171 605l12 -654v-431h-258v1456h349z', { x: letterWidth * 2, y: top }, 1)
  drawChar('M476 1456l138 -547l157 547h349v-1456h-258v431l12 681l-191 -632h-139l-171 605l12 -654v-431h-258v1456h349z', { x: letterWidth * 2, y: top }, 2)
  drawChar('M476 1456l138 -547l157 547h349v-1456h-258v431l12 681l-191 -632h-139l-171 605l12 -654v-431h-258v1456h349z', { x: letterWidth * 2, y: top }, 3)
  drawChar('M476 1456l138 -547l157 547h349v-1456h-258v431l12 681l-191 -632h-139l-171 605l12 -654v-431h-258v1456h349z', { x: letterWidth * 2, y: top }, 4)

  drawChar('M1091 0h-280l-405 939v-939h-283v1456h283l402 -935l1 935h282v-1456z', { x: letterWidth * 3, y: top }, 0)
  drawChar('M1091 0h-280l-405 939v-939h-283v1456h283l402 -935l1 935h282v-1456z', { x: letterWidth * 3, y: top }, 1)
  drawChar('M1091 0h-280l-405 939v-939h-283v1456h283l402 -935l1 935h282v-1456z', { x: letterWidth * 3, y: top }, 2)
  drawChar('M1091 0h-280l-405 939v-939h-283v1456h283l402 -935l1 935h282v-1456z', { x: letterWidth * 3, y: top }, 3)
  drawChar('M1091 0h-280l-405 939v-939h-283v1456h283l402 -935l1 935h282v-1456z', { x: letterWidth * 3, y: top }, 4)

  drawChar('M1147 621q0 -140 -37 -258t-107 -203t-170.5 -132.5t-226.5 -47.5t-224 47.5t-165 133t-102 203t-35 257.5v212q0 140 35 258t102 203.5t164.5 133.5t223.5 48q127 0 227.5 -48t170.5 -133.5t107 -203.5t37 -258v-212zM862 835q0 89 -14.5 164t-45.5 129t-79.5 84.5t-117.5 30.5q-68 0 -114 -30.5t-74 -84.5t-40 -129t-12 -164v-214q0 -88 12 -163t40 -130t74 -86t115 -31q68 0 116.5 31t79 85.5t45.5 129.5t15 164v214z', { x: letterWidth * 4, y: top }, 0)
  drawChar('M1147 621q0 -140 -37 -258t-107 -203t-170.5 -132.5t-226.5 -47.5t-224 47.5t-165 133t-102 203t-35 257.5v212q0 140 35 258t102 203.5t164.5 133.5t223.5 48q127 0 227.5 -48t170.5 -133.5t107 -203.5t37 -258v-212zM862 835q0 89 -14.5 164t-45.5 129t-79.5 84.5t-117.5 30.5q-68 0 -114 -30.5t-74 -84.5t-40 -129t-12 -164v-214q0 -88 12 -163t40 -130t74 -86t115 -31q68 0 116.5 31t79 85.5t45.5 129.5t15 164v214z', { x: letterWidth * 4, y: top }, 1)
  drawChar('M1147 621q0 -140 -37 -258t-107 -203t-170.5 -132.5t-226.5 -47.5t-224 47.5t-165 133t-102 203t-35 257.5v212q0 140 35 258t102 203.5t164.5 133.5t223.5 48q127 0 227.5 -48t170.5 -133.5t107 -203.5t37 -258v-212zM862 835q0 89 -14.5 164t-45.5 129t-79.5 84.5t-117.5 30.5q-68 0 -114 -30.5t-74 -84.5t-40 -129t-12 -164v-214q0 -88 12 -163t40 -130t74 -86t115 -31q68 0 116.5 31t79 85.5t45.5 129.5t15 164v214z', { x: letterWidth * 4, y: top }, 2)
  drawChar('M1147 621q0 -140 -37 -258t-107 -203t-170.5 -132.5t-226.5 -47.5t-224 47.5t-165 133t-102 203t-35 257.5v212q0 140 35 258t102 203.5t164.5 133.5t223.5 48q127 0 227.5 -48t170.5 -133.5t107 -203.5t37 -258v-212zM862 835q0 89 -14.5 164t-45.5 129t-79.5 84.5t-117.5 30.5q-68 0 -114 -30.5t-74 -84.5t-40 -129t-12 -164v-214q0 -88 12 -163t40 -130t74 -86t115 -31q68 0 116.5 31t79 85.5t45.5 129.5t15 164v214z', { x: letterWidth * 4, y: top }, 3)
  drawChar('M1147 621q0 -140 -37 -258t-107 -203t-170.5 -132.5t-226.5 -47.5t-224 47.5t-165 133t-102 203t-35 257.5v212q0 140 35 258t102 203.5t164.5 133.5t223.5 48q127 0 227.5 -48t170.5 -133.5t107 -203.5t37 -258v-212zM862 835q0 89 -14.5 164t-45.5 129t-79.5 84.5t-117.5 30.5q-68 0 -114 -30.5t-74 -84.5t-40 -129t-12 -164v-214q0 -88 12 -163t40 -130t74 -86t115 -31q68 0 116.5 31t79 85.5t45.5 129.5t15 164v214z', { x: letterWidth * 4, y: top }, 4)


  drawChar('M430 534v-534h-281v1456h498q119 0 215 -34.5t163.5 -96t104 -147.5t36.5 -191q0 -98 -36.5 -181t-104 -143.5t-163.5 -94.5t-215 -34h-217zM430 762h217q60 0 104 18t73.5 49t44 71.5t14.5 84.5q0 51 -14.5 95t-44 77t-73.5 52t-104 19h-217v-466z', { x: letterWidth * 5, y: top }, 0)
  drawChar('M430 534v-534h-281v1456h498q119 0 215 -34.5t163.5 -96t104 -147.5t36.5 -191q0 -98 -36.5 -181t-104 -143.5t-163.5 -94.5t-215 -34h-217zM430 762h217q60 0 104 18t73.5 49t44 71.5t14.5 84.5q0 51 -14.5 95t-44 77t-73.5 52t-104 19h-217v-466z', { x: letterWidth * 5, y: top }, 1)
  drawChar('M430 534v-534h-281v1456h498q119 0 215 -34.5t163.5 -96t104 -147.5t36.5 -191q0 -98 -36.5 -181t-104 -143.5t-163.5 -94.5t-215 -34h-217zM430 762h217q60 0 104 18t73.5 49t44 71.5t14.5 84.5q0 51 -14.5 95t-44 77t-73.5 52t-104 19h-217v-466z', { x: letterWidth * 5, y: top }, 2)
  drawChar('M430 534v-534h-281v1456h498q119 0 215 -34.5t163.5 -96t104 -147.5t36.5 -191q0 -98 -36.5 -181t-104 -143.5t-163.5 -94.5t-215 -34h-217zM430 762h217q60 0 104 18t73.5 49t44 71.5t14.5 84.5q0 51 -14.5 95t-44 77t-73.5 52t-104 19h-217v-466z', { x: letterWidth * 5, y: top }, 3)
  drawChar('M430 534v-534h-281v1456h498q119 0 215 -34.5t163.5 -96t104 -147.5t36.5 -191q0 -98 -36.5 -181t-104 -143.5t-163.5 -94.5t-215 -34h-217zM430 762h217q60 0 104 18t73.5 49t44 71.5t14.5 84.5q0 51 -14.5 95t-44 77t-73.5 52t-104 19h-217v-466z', { x: letterWidth * 5, y: top }, 4)


  // for (let i = 0; i < shapes.length; i++) {
  //   shapes[i].draw();
  // }

  // for (let i = 0; i < connectors.length; i++) {
  //   connectors[i].update();
  //   connectors[i].draw();
  // }
}

render();

mouse.moveCallbacks.push(() => {
  requestAnimationFrame(render)
});

dimensions.addCallback(() => {
  scale = (dimensions.height / 4000);
  top = 1200 * scale;
  letterWidth = 1200 * scale;

  requestAnimationFrame(render)
});