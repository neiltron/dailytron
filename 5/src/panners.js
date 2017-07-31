import Tone from 'tone';
import reverb from './reverb';

let panners = {};

for (var i = -1; i < 1; i += .1) {
  let pan = Math.floor(i * 10) / 10;
  panners[pan.toString()] = new Tone.Panner(i).connect(reverb);
}

export default panners;