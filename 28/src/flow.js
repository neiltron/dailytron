import dimensions from './dimensions';
import noise from './noise';
import { vec2 } from 'gl-matrix';

class Flow {
  constructor() {
    this.resolution = 30;
    this.grid = [];

    this.setup();
  }

  setup() {
    let perlin = noise({
      seed: Date.now() / 100000000000,
      dimensions: 2,
      wavelength: 12,
      octaves: 10
    });

    for (let i = 0; i < dimensions.width / this.resolution; i += 1) {
      for (let j = 0; j < dimensions.height / this.resolution; j += 1) {
        if (!this.grid[i]) { this.grid[i] = []; }
        let velocity = perlin.get(i, j);

        this.grid[i][j] = velocity;
      }
    }
  }

  lookup(position) {
    let x = Math.floor(position.x / this.resolution);
    let y = Math.floor(position.y / this.resolution);

    if (typeof this.grid[x] === 'undefined' || typeof this.grid[x][y] === 'undefined') {
      return 0;
    }

    return this.grid[x][y];
  }
}

export default new Flow();