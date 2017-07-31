let width = document.body.clientWidth;
let height = document.body.clientHeight;

window.addEventListener('resize', () => {
  width = document.body.clientWidth;
  height = document.body.clientHeight;
})

export default {
  width,
  height
};