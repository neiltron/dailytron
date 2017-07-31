import dimensions from './dimensions';

let mouseX = dimensions.width / 2;
let mouseY = dimensions.height / 2;

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

export default () => {
  return {
    x: mouseX,
    y: mouseY
  }
}