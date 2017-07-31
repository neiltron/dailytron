import Point from './point';
import dimensions from './dimensions';
import mouse from './mousemove';
import Tone from 'tone';
import panners from './panners';

let points = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0]
];

export default class Rectangle {
  constructor(opts) {
    this.boxesTotal = dimensions.width / 40;

    this.width = opts.width;
    this.height = opts.height;
    this.center = opts.center;
    this.ctx = opts.ctx;
    this.delay = opts.delay;
    this.zMatrix = [];

    this.noteRange = Math.floor(((this.delay * 2.5 / this.boxesTotal) * 3) + 2);

    var audioX = Math.floor(((this.delay / this.boxesTotal) * 4  - 1) * 10) / 10;

    this.synthA = new Tone.Synth({
      "envelope" : {
        "attack" : 0.1,
        "decay" : 2,
        "sustain" : 0
      },
      "oscillator" : {
        "type" : "square4"
      }
    }).connect(panners[audioX]);

    this.synthB = new Tone.Synth({
      "envelope" : {
        "attack" : 0.3,
        "decay" : 3,
        "sustain" : 0
      },
      "oscillator" : {
        "type" : "sawtooth4"
      }
    }).connect(panners[audioX]);

    this.synthC = new Tone.Synth({
      "envelope" : {
        "attack" : 0.2,
        "decay" : 3,
        "sustain" : 0
      },
      "oscillator" : {
        "type" : "sawtooth4"
      }
    }).connect(panners[audioX]);

    this.currentNote = '';

    this.update();
    this.points = this.getPoints();
  }

  getPoints() {
    let result = [];

    for (let i = 0, total = points.length; i < total; i++) {
      result.push(new Point(points[i], this));
    }

    return result;
  }

  draw() {

    let adjustmentY = dimensions.height / -8;
    let point = this.points[0].get();


    if (point[0] >= -1) {
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#fff';

      this.synthA.volume.value = -6;
      this.synthA.frequency.value = 300;
      this.playNote('G' + this.noteRange, this.synthA)
    } else if (point[0] < -100 && point[0] > -200) {
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = '#000';

      this.synthB.volume.value = -12;
      this.synthB.frequency.value = 100;
      this.playNote('B' + this.noteRange, this.synthB)
    } else if (point[0] < dimensions.width / -1.6 || point[1] < dimensions.height / -1.6) {
      this.ctx.lineWidth = 1.25;
      this.ctx.strokeStyle = '#faf';

      this.synthC.volume.value = -16;
      this.synthC.frequency.value = 600;
      this.playNote('D' + this.noteRange, this.synthC)
    } else {
      this.ctx.lineWidth = 1;
      this.note = '';
      this.ctx.strokeStyle = '#777';
    }

    this.ctx.beginPath();
    this.ctx.moveTo(point[0] + this.center[0], point[1] + this.center[1]);

    for (var i = 0; i < this.points.length; i++) {
      point = this.points[i].get();

      this.ctx.lineTo(point[0] + this.center[0], point[1] + this.center[1]);
    }

    this.ctx.closePath();
    this.ctx.stroke();
  }

  playNote(note, synth) {
    if (this.note !== note) {
      // console.log(note, this.delay);
      synth.triggerAttack(note)
      this.note = note;
    }
  }

  update() {
    let rotation = this._timeRotation();

    let y = Math.PI * rotation[0] * 50;
    let x = Math.PI * rotation[1] * 50;

    this.zMatrix = [
      x, 0,    0, 0,
      x,  y,    0, 0,
           0,       0,    1,    0,
           0,       0,    0,    1
    ];
  }

  _mouseRotation() {
    return [
      Math.sin((dimensions.width - mouse().x) / (dimensions.width / 10)) / 100,
      Math.sin((dimensions.height - mouse().y) / (dimensions.height / 10)) / 100
    ]
  }

  _timeRotation() {
    let divisor = ('ontouchstart' in window) ? 10 : 5;
    let time = Date.now() * (.5 * (this.delay + 1));

    return [
      ((Math.sin(time / 5000) + 1) / divisor) / 10,
      ((Math.cos(time / 5000) + 1) / divisor) / 10
    ];
  }
}