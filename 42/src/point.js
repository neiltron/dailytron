import dimensions from './dimensions';

let rectScale = dimensions.width / 100;

export default class Point {
  constructor(point, parent) {
    this.parent = parent;

    this.boxWidth   = rectScale * point[0];
    this.boxHeight  = rectScale * point[1];
    this.boxAdjustX = rectScale / -2;
    this.boxAdjustY = rectScale / -2;
  }

  get() {
    return multiplyMatrixAndPoint(this.parent.zMatrix, [
      this.boxAdjustX + this.boxWidth,
      this.boxAdjustY + this.boxHeight,
      1, 1
    ]);
  }
}