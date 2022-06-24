const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: false
};


const sketch = ({ context, width, height }) => {

  // Center drawing
  const cx = width * 0.5;
  const cy = height * 0.5;
  // Set size of smaller rectangles
  const w = width * 0.04;
  const h = height * 0.04;
  // Number of iterations to draw elements
  const rows = settings.dimensions[0] / 4;
  const columns = settings.dimensions[0] / 4;
  // Radius of the circle (i.e. how far sketches move from center)
  const defaultRadius = width * 0.1;
  // Grid settings
  let x,y;
  const gap = width * 0.000;
  const ix = width * 0.001;
  const iy = height * 0.01;


  const agents = [];

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      x = ix + (w + gap) * i;
      y = iy + (h + gap) * j;
      let agent = new Agent(x, y, j, i);
      agents.push(agent);
    }
  };

  return ({ context, width, height, playhead }) => {
    // Frame rectangle
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    agents.forEach(agent => {
      //  
      agent.drawRectangle(context, w, h);
      // agent.update();
      // agent.bounce(width, height);
    })
  }

};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(x, y, row, col, angle = 0, radius = 0) {
    // Positions
    this.pos = new Vector(x, y);
    this.originalPos = new Vector(x, y);
    // Velocity
    this.vel = new Vector(random.range(-0.5, 0.5), random.range(-0.5, 0.5));
    // Rotate angle
    this.angle = angle;
    // Radius
    this.radius = radius;
    // Colors
    this.alphaRand = random.range(0.5, 1);
    this.red = random.range(0, 240);
    this.green = random.range(0, 240);
    this.blue = random.range(0, 240);
    // Random seeds
    this.randomSeed1 = random.range(3, 1080);
    this.randomSeed2 = random.range(1, 1080);
    // Rectangle dimensions
    this.recWidth;
    this.recHeight;
    this.turns = 0;
    // Grid position
    this.row = row,
    this.col = col;
  }

  drawRectangle(context, recWidth, recHeight) {
    // Reseting context
    context.save();
    // Position rectangles
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.angle);
    // Randomly change dimensions of rectangle
    // context.scale(this.randomSeed2, this.randomSeed1);
    // Store new dimensions
    this.recWidth = recWidth;
    this.recHeight = recHeight;

    context.beginPath();
    console.log('col', this.col);
    console.log('row', this.row);

    // Random colors
    if((this.row < 100)) {
      // const alphaRand = random.range(0.6, 1);
      // const red = random.range(0, 50);
      // const green = random.range(150, 240);
      // const blue = random.range(200, 240);
      context.fillStyle = 'red';
    } else {
      // const alphaRand = random.range(0.6, 1);
      // const red = random.range(255, 255);
      // const green = random.range(255, 255);
      // const blue = random.range(255, 255);
      context.fillStyle = 'black';
    }


    // context.fillStyle = this.getRandomColor(this.red, this.green, this.blue, this.alphaRand);
    // Draw rectangle and randomly position it
    context.rect(-this.recWidth/2, -this.recHeight, this.recWidth, this.recHeight);
    context.fill();
    context.restore();
  }

  getRandomColor(red, green, blue, alpha) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  bounce(width, height) {

    if (this.pos.x < 0 || this.pos.x + this.recWidth / 2 > width) { console.log('BOUCE X!', this.pos.x, 'recWidth', this.recWidth); this.vel.x *= -1; }
    if (this.pos.y < 0 || this.pos.y + this.recHeight / 2 > height) { console.log('BOUCE Y!', this.pos.y, 'recHeight', this.recHeight); this.vel.y *= -1; }
  }

  update() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  rotate(context) {
    this.turns += 0.001;
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.turns);
    context.translate(-this.pos.x, -this.pos.y);
  }

  wrap(width, height) {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;

    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

}