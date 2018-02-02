class Dimensions {
  constructor() {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
    this.callbacks = [];

    window.addEventListener('resize', () => {
      this.width = document.body.clientWidth;
      this.height = document.body.clientHeight;

      if (this.callbacks.length > 0) {
        for (let i = 0, total = this.callbacks.length; i < total; i++) {
          this.callbacks[i].call(this);
        }
      }
    })
  }

  addCallback(cb) {
    this.callbacks.push(cb);
  }
}

export default new Dimensions();