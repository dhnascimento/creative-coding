const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const getRandomColor = (red, green, blue, alpha) => {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const sketch = ({ context, width, height }) => {

  // Center drawing
  const cx = width * 0.5;
  const cy = height * 0.5;
  // Set starting position(?)
  const w = width * 0.01;
  const h = height * 0.1;
  // Initialize variables to set position
  let x, y, modifiedRadius;
  // Number of iterations to draw elements
  const num = 1000;
  // Radius of the circle (i.e. how far sketches move from center)
  const defaultRadius = width * 0.2;

  const radiusObj = {
    '3': defaultRadius,
    '4': defaultRadius,
  }

  const agents = [];

  for (let i = 0; i < num; i++) {
    // Divides number of elements to position them concentrically
    const slice = math.degToRad(360 / num);
    const a = slice * i;

    if (i > 0 && i % 3 === 0 && i % 4 === 0) {
      modifiedRadius = defaultRadius * random.range(0.6, 1);
    } else if (i > 0 && i % 3 === 0) {
      modifiedRadius = radiusObj[3] * random.range(0.7, 0.9);
    } else if (i > 0 && i % 4 === 0) {
      modifiedRadius = radiusObj[4] * random.range(1.1, 1.5);
    } else {
      modifiedRadius = defaultRadius * random.range(0.01, 1);
    }

    // Use sine and cosine to distribute position rectangles around center
    x = cx + modifiedRadius * Math.sin(a);
    y = cy + modifiedRadius * Math.cos(a);
    agents.push(new Agent(x, y, a, defaultRadius));
  }

  return ({ context, width, height }) => {
    // Frame rectangle
    context.fillStyle = '#ccc';
    context.fillRect(0, 0, width, height);

    for (let agent of agents) {
      agent.update(width,height);
      agent.drawRectangle(context, w, h);
    }
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
  constructor(x, y, angle, radius) {
    // Positions
    this.pos = new Vector(x, y);
    this.originalPos = new Vector(x, y);
    // Velocity
    this.vel = new Vector(0.1, 0.1);
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
    this.randomSeed1 = random.range(0.5, 1.55);
    this.randomSeed2 = random.range(0.35, 1.7);
    // Rectangle dimensions
    this.recWidth;
    this.recHeight;
  }

  getRandomColor(red, green, blue, alpha) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  bounce(width, height) {
     
    if (this.pos.x < 0 || this.pos.x + this.recWidth / 2 > width) {console.log('BOUCE X!', this.pos.x, 'recWidth', this.recWidth); this.vel.x *= -1;}
    if (this.pos.y < 0 || this.pos.y + this.recHeight / 2 > height) { console.log('BOUCE Y!', this.pos.y, 'recHeight', this.recHeight); this.vel.y *= -1;}
  }

  update(width, height) {
    this.pos.x += this.pos.x > width * 0.5 ? -this.vel.x : this.vel.x;
    this.pos.y += this.pos.y > height * 0.5 ? -this.vel.y : this.vel.y;

   }

  wrap(width, height) {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;

    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }


  drawRectangle(context, recWidth, recHeight) {
    // Reseting context
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-this.angle);
    // Randomly change dimensions of rectangle
    // context.scale(this.randomSeed2, this.randomSeed1);
    // Store new dimensions
    this.recWidth = recWidth * this.randomSeed1;
    this.recHeight = recHeight * this.randomSeed2;

    context.beginPath();

    // Random colors
    const alphaRand = random.range(0.6, 1);
    const red = random.range(0, 240);
    const green = random.range(0, 240);
    const blue = random.range(0, 240);

    context.fillStyle = getRandomColor(this.red, this.green, this.blue, this.alphaRand);
    // Draw rectangle and randomly position it
    context.rect(-this.recWidth * 0.1, -this.recHeight * 0.1, this.recWidth, this.recHeight);
    context.fill();
    context.restore();
  }

  drawArc(context, radius, slice, angle, centerX, centerY) {
    context.save();

    const alphaRand = Math.random();
    const red = random.range(0, 100);
    const green = random.range(100, 240);
    const blue = random.range(50, 240);

    context.strokeStyle = getRandomColor(red, green, blue, alphaRand);
    context.translate(centerX, centerY);
    context.rotate(-angle);
    context.lineWidth = random.range(10, 25);

    context.beginPath();
    context.arc(0, 0, radius * random.range(0.1, 1.2), slice * random.range(2, 10), slice * random.range(10, 20));
    context.stroke();

    context.restore();
  }
}