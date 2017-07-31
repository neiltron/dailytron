import Matter from 'matter-js';
import matterWrap from './matter-world-wrap';

class Engine {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.runner = Matter.Runner.create();

    this.world.gravity.y = 0;

    Matter.Runner.run(this.runner, this.engine);
  }
}

export default new Engine()