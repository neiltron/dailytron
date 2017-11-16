import dimensions from './dimensions';

class Mouse {
  constructor() {
    this.moveCallbacks = [];
    this.downCallbacks = [];
    this.upCallbacks = [];
    this.position = [
      -100,
      -100
    ];

    document.addEventListener('mousemove', this.handleMouseMove.bind(this), true);
    document.addEventListener('touchmove', this.handleMouseMove.bind(this), true);

    document.addEventListener('mousedown', this.handleMouseDown.bind(this), true);
    document.addEventListener('touchstart', this.handleMouseDown.bind(this), true);

    document.addEventListener('mouseup', this.handleMouseUp.bind(this), true);
    document.addEventListener('touchend', this.handleMouseUp.bind(this), true);
  }

  setMousePosition(e) {
    if (typeof e.touches !== 'undefined' && typeof e.touches[0] !== 'undefined') {
      this.position[0] = e.touches[0].clientX;
      this.position[1] = e.touches[0].clientY;
    } else {
      this.position[0] = e.pageX;
      this.position[1] = e.pageY;
    }
  }

  handleMouseMove(e) {
    e.preventDefault();

    this.setMousePosition(e);

    if (this.moveCallbacks.length > 0) {
      for (let i = 0; i < this.moveCallbacks.length; i++) {
        this.moveCallbacks[i].call(this, e, this.position);
      }
    }
  }

  handleMouseDown(e) {
    e.preventDefault();

    this.setMousePosition(e);

    if (this.downCallbacks.length > 0) {
      for (let i = 0; i < this.downCallbacks.length; i++) {
        this.downCallbacks[i].call(this, e, this.position);
      }
    }
  }

  handleMouseUp(e) {
    e.preventDefault();

    this.setMousePosition(e);

    if (this.upCallbacks.length > 0) {
      for (let i = 0; i < this.upCallbacks.length; i++) {
        this.upCallbacks[i].call(this, e, this.position);
      }
    }
  }
}

export default new Mouse();