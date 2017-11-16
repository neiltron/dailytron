import dimensions from './dimensions';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

const setDimensions = () => {
  let pixel_ratio = Math.max( window.devicePixelRatio ? window.devicePixelRatio : 1, 1 );

  canvas.width = dimensions.width * pixel_ratio;
  canvas.height = dimensions.height * pixel_ratio;

  canvas.style.width = dimensions.width + 'px';
  canvas.style.height = dimensions.height + 'px';

  // ctx.scale( pixel_ratio, pixel_ratio );
  // ctx.strokeStyle = '#fff';
}

setDimensions();

export { canvas, ctx };

dimensions.addCallback((width, height) => {
  setDimensions();
});