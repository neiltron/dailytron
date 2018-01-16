// borrowed from mikolalysenko
// https://github.com/mikolalysenko/cyberarts-junkdrawer/blob/gh-pages/regl-webcam.js

const getUserMedia = require('getusermedia')

module.exports = function (options) {
  const regl = options.regl;
  const video = document.getElementById('video');

  video.setAttribute('muted', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');

  video.addEventListener('loadedmetadata', () => {
    video.play()

    const webcam = regl.texture(video)
    regl.frame(() => webcam.subimage(video))

    options.done({ webcam, video })
  })

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user'
    }
  }).then(function success(stream) {
      video.srcObject = stream;
  });
}