const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};


const params = {
  rectangles: 50,
  mainRadius: 0.2,
  recWidth: 0.01,
  recHeight: 0.1,
  denomitator1: 3,
  denomitator2: 4,
  modifier1And2: 0.5,
  modifier1: 0.8,
  modifier2: 1.2,
  modifierElse: 0.05,
  background: '#ccc',
  color1: { r: 0, g: 255, b: 214, a: 0.5 },
  color2: { r: 255, g: 150, b: 100, a: 0.7 },
  color1And2: { r: 50, g: 255, b: 100, a: 0.75 },
  colorElse: { r: 100, g: 55, b: 255, a: 0.8 },
  frequency: 0.001,
  amplitude: 0.2,
  animate: true,
  frame: 0,
  scaleMin: 0.8,
  scaleMax: 1.5,
  arcAngleModifier: 5
}


const generateColor = (red, green, blue, alpha) => {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const sketch = ({ context, width, height, frame }) => {

  // Center drawing
  const cx = width * 0.5;
  const cy = height * 0.5;
  // Initialize variables to set position
  let x, y, modifiedRadius, colorIdentifier;

  return ({ context, width, height, frame }) => {

    // Frame rectangle
    context.fillStyle = params.background;
    context.fillRect(0, 0, width, height);
    // Set starting position(?)
    const w = width * params.recWidth;
    const h = height * params.recHeight;

    // Number of iterations to draw elements
    const num = params.rectangles;
    // Radius of the circle (i.e. how far sketches move from center)
    const defaultRadius = width * params.mainRadius;

    const key1 = params.denomitator1;
    const key2 = params.denomitator2

    const radiusObj = {
      one: defaultRadius,
      two: defaultRadius,
    }

          // Colors
          const colors = {
            color1And2: {
              alphaRand: params.color1And2.a,
              red: params.color1And2.r,
              green: params.color1And2.g,
              blue: params.color1And2.b
            },
            color1: {
              alphaRand: params.color1.a,
              red: params.color1.r,
              green: params.color1.g,
              blue: params.color1.b
            },
            color2: {
              alphaRand: params.color2.a,
              red: params.color2.r,
              green: params.color2.g,
              blue: params.color2.b
            },
            colorElse: {
              alphaRand: params.colorElse.a,
              red: params.colorElse.r,
              green: params.colorElse.g,
              blue: params.colorElse.b
            },
          }

    for (let i = 0; i < num; i++) {
      // Divides number of elements to position them concentrically
      const slice = math.degToRad(360 / num);
      const a = slice * i;

      if (i > 0 && i % params.denomitator1 === 0 && i % params.denomitator2 === 0) {
        modifiedRadius = defaultRadius * params.modifier1And2;
        colorIdentifier = 'color1And2';
      } else if (i > 0 && i % params.denomitator1 === 0) {
        modifiedRadius = radiusObj.one * params.modifier1;
        colorIdentifier = 'color1';
      } else if (i > 0 && i % params.denomitator2 === 0) {
        modifiedRadius = radiusObj.two * params.modifier2;
        colorIdentifier = 'color2';
      } else {
        modifiedRadius = defaultRadius * params.modifierElse;
        colorIdentifier = 'colorElse';
      }

      // Use sine and cosine to distribute position rectangles around center
      x = cx + modifiedRadius * Math.sin(a);
      y = cy + modifiedRadius * Math.cos(a);

      const f = params.animate ? frame : params.frame;
      const n = random.noise3D(x, y, f * 10, params.frequency);
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);
      context.save();
      context.translate(x, y);
      context.rotate(-a * params.amplitude);

      // Randomly change dimensions of rectangle
      // context.scale(this.randomSeed2, this.randomSeed1);
      // Store new dimensions

      context.beginPath();
      let color = colors[colorIdentifier];

      context.fillStyle = generateColor(color.red, color.green, color.blue, color.alphaRand);
      // Draw rectangle and randomly position it
      context.rect(-w * 0.1, -h * 0.1, w, h * n);
      context.fill();

      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-a);

      context.strokeStyle = generateColor(color.red, color.green, color.blue, color.alphaRand);
      context.lineWidth = scale;

      context.beginPath();
      context.arc(0, 0, modifiedRadius, slice, slice * (params.arcAngleModifier + n));
			context.stroke();

      context.restore();

    }
  }

};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({ title: 'Noise' });
  folder.addInput(params, 'frequency', { min: -0.01, max: 0.01 });
  folder.addInput(params, 'amplitude', { min: -1, max: 1 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 999 });


  folder = pane.addFolder({ title: 'Elements' });
  folder.addInput(params, 'rectangles', { min: 0, max: 5000, step: 1 });
  folder.addInput(params, 'mainRadius', { min: 0.0, max: 1.00, step: 0.001 });
  folder.addInput(params, 'recWidth', { min: 0.0, max: 1.00, step: 0.001 });
  folder.addInput(params, 'recHeight', { min: 0.0, max: 1.00, step: 0.001 });
  folder.addInput(params, 'arcAngleModifier', { min: 0.0, max: 10.00 });
  folder.addInput(params, 'scaleMin', { min: 1, max: 100, step: 0.5 });
  folder.addInput(params, 'scaleMax', { min: 1, max: 100, step: 0.5 });

  folder = pane.addFolder({ title: 'Modified Radius Params' });
  folder.addInput(params, 'denomitator1', { min: 1, max: 10, step: 1 });
  folder.addInput(params, 'denomitator2', { min: 1, max: 10, step: 1 });
  folder.addInput(params, 'modifier1', { min: 0.1, max: 10, step: 0.1 });
  folder.addInput(params, 'modifier2', { min: 0.1, max: 10, step: 0.1 });
  folder.addInput(params, 'modifier1And2', { min: 0.1, max: 10, step: 0.1 });
  folder.addInput(params, 'modifierElse', { min: 0.1, max: 10, step: 0.1 });

  folder = pane.addFolder({ title: 'Colors' });
  folder.addInput(params, 'background', { view: 'color' });
  folder.addInput(params, 'color1');
  folder.addInput(params, 'color2');
  folder.addInput(params, 'color1And2');
  folder.addInput(params, 'colorElse');
}

createPane();
canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(x, y, angle, radius, colorId, id) {
    // Positions
    this.pos = new Vector(x, y);
    this.originalPos = new Vector(x, y);
    // Velocity
    this.vel = new Vector(0.1, 0.1);
    // Rotate angle
    this.angle = angle;
    // Radius
    this.radius = radius;
    // Rectangle dimensions
    this.recWidth;
    this.recHeight;
    this.colorId = colorId;
    this.id = id;
  }

  getRandomColor(red, green, blue, alpha) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  bounce(width, height) {

    if (this.pos.x < 0 || this.pos.x + this.recWidth / 2 > width) { console.log('BOUCE X!', this.pos.x, 'recWidth', this.recWidth); this.vel.x *= -1; }
    if (this.pos.y < 0 || this.pos.y + this.recHeight / 2 > height) { console.log('BOUCE Y!', this.pos.y, 'recHeight', this.recHeight); this.vel.y *= -1; }
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

  noise3D(frame, context) {
    const f = params.animate ? frame : params.frame;
    const n = random.noise2D(this.id, this.pos.y, f * 10, params.frequency);
    const angle = n * Math.PI * params.amplitude;
    context.rotate(-angle);
  }


  drawRectangle(context, recWidth, recHeight, color, frame) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    // Randomly change dimensions of rectangle
    // context.scale(this.randomSeed2, this.randomSeed1);
    // Store new dimensions
    this.recWidth = recWidth * 0.5;
    this.recHeight = recHeight * 1.2;

    context.beginPath();
    this.color = color[this.colorId];

    context.fillStyle = generateColor(this.color.red, this.color.green, this.color.blue, this.color.alphaRand);
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

    context.strokeStyle = generateColor(red, green, blue, alphaRand);
    context.translate(centerX, centerY);
    context.rotate(-angle);
    context.lineWidth = random.range(10, 25);

    context.beginPath();
    context.arc(0, 0, radius * random.range(0.1, 1.2), slice * random.range(2, 10), slice * random.range(10, 20));
    context.stroke();

    context.restore();
  }
}