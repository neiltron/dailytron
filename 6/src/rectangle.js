import Point from './point';
import dimensions from './dimensions';
import mouse from './mousemove';
import Tone from 'tone';
import reverb from './reverb';

export default class Rectangle {
  constructor(opts) {
    this.boxesTotal = 10;

    this.width = this.startWidth = opts.width;
    this.height = this.startHeight = opts.height;
    this.center = opts.center;
    this.ctx = opts.ctx;
    this.delay = opts.delay;
    this.note = opts.note;
    this.zMatrix = [];
    this.x = opts.x;
    this.y = opts.y;
    this.velocityX = (Math.random() + Math.random()) * (Math.random() > .5 ? 1 : -1) * (dimensions.width > dimensions.height ? dimensions.width : dimensions.height) / 720;
    this.velocityY = (Math.random() + Math.random()) * (Math.random() > .5 ? 1 : -1) * (dimensions.width > dimensions.height ? dimensions.width : dimensions.height) / 720;
    this.lastPlayTime = 0;

    this.panner = new Tone.Panner(0).connect(reverb);

    this.oscillator = new Tone.OmniOscillator(this.note, "square4")
    this.oscillator.connect(this.panner);
    this.oscillator.start();

    this.update();
  }

  draw() {
    let adjustmentY = dimensions.height / -8;
    let fillColor = Math.floor((1 - this.volume) * 255);
    this.width = this.height = this.startHeight * (1 - (this.y / dimensions.height));

    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = `rgb(${fillColor}, ${fillColor}, ${fillColor})`;
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.fill();
    this.ctx.closePath();

    // this.playNote(this.note, this.synth)
  }

  playNote(note, synth) {
    // console.log(note, this.delay);
    if (Date.now() - this.lastPlayTime > 60) {
      this.synth.volume.value = -60 * this.volume;
      synth.triggerAttack(note)
      this.lastPlayTime = Date.now();
    }
  }

  update() {
    // let rotation = this._timeRotation();

    // let x = Math.PI * rotation[0] * 10;
    // let y = Math.PI * rotation[1] * 10;

    this.volume = this.y / dimensions.height;
    this.oscillator.volume.value = (-40 * this.volume) - 30;
    this.panner.pan.value = (this.x / dimensions.width) * 2 - 1;

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.x = Math.floor(this.x * 100) / 100
    this.y = Math.floor(this.y * 100) / 100

    if (this.x <= 0) {
      this.velocityX *= -1;
      this.x = 0.1;
    } else if (this.x >= dimensions.width - this.width) {
      this.velocityX *= -1;
      this.x = dimensions.width - this.width - .1;
    }

    if (this.y <= 0) {
      this.velocityY *= -1;
      this.y = 0.1;
    } else if (this.y >= dimensions.height - this.height) {
      this.velocityY *= -1;
      this.y = dimensions.height - this.height - .1;
    }
  }

  _mouseRotation() {
    return [
      Math.sin((dimensions.width - mouse().x) / (dimensions.width / 10)) / 10,
      Math.sin((dimensions.height - mouse().y) / (dimensions.height / 10)) / 10
    ]
  }

  _timeRotation() {
    let divisor = ('ontouchstart' in window) ? 1 : 8;
    let time = Date.now() * (.5 * (this.delay + 1));

    return [
      ((Math.sin(time) + (mouse().x / dimensions.width) + .5) / divisor) / 10,
      ((Math.cos(time) + (mouse().y / dimensions.height) + .5) / divisor) / 10
    ];
  }
}