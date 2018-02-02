const generateCylinderMesh = (radius = 1, height = 1, sides = 5) => {
  const points = sides * height * 6;
  const step = (Math.PI * 2) / sides;
  let angle = 0;


  // generate points
  const positions = Array(points).fill([0, 0, 0]).map((el, index) => {
    const _index = index / sides;

    if (index % sides === 0) {
      angle = 0;
    }

    const vector = [
      Math.floor(Math.sin(angle)) * radius + Math.sin(index / 10.0) * 10.0,
      _index * (radius / 2),
      Math.floor(Math.cos(angle)) * radius + Math.sin(index / 10.0) * 10.0
    ];

    angle += step;

    return vector;
  });

  // connect lines with cells
  const cells = [];

  for (let i = 0; i < points / 2; i += sides) {
    for (let j = 0; j < sides; j++) {

      // if cell in row, connect back to
      // first side to complete tunnel.

      if (j === sides) {
        cells.push(j + i, sides * i, sides + j + i);
        cells.push(sides * i, sides + j + i, 1 + j + i);
      } else {
        cells.push(j + i, j + i + 1, sides + j + i);
        cells.push(j + i + 1, sides + j + i, (sides + 1) + j + i);
      }
    }
  }

  console.log(cells);

  return {
    positions,
    cells
  };
};

export default generateCylinderMesh;
