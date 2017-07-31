let width = document.body.clientWidth;
let height = document.body.clientWidth;

window.addEventListener('resize', () => {
  width = document.body.clientWidth;
  height = document.body.clientWidth;
})

export default {
  width,
  height
};