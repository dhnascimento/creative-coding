const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const getRandomColor = (red, green, blue, alpha) => {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const sketch = () => {
  return ({ context, width, height }) => {
    // Frame rectangle
    context.fillStyle = '#ccc';
    context.fillRect(0, 0, width, height);
    
    // Center drawing
    const cx = width * 0.0;
    const cy = height * 1;
    // Set size of smaller rectangles
    const w = width * 0.01;
    const h = height * 0.7;
    // Initialize variables to set position
    let x,y, modifiedRadius;
    // Number of iterations to draw elements
    const num = 200;
    // Radius of the circle (i.e. how far sketches move from center)
    const defaultRadius = width * 1.25;
    // let radius = width * 0.06;

    const radiusObj = {
      '3': defaultRadius,
      '4': defaultRadius,
    }

    const counter = {
      'modulus3': 0,
      'modulus4': 0,
      'both': 0,
      'other': 0,
    }

    for (let i = 0; i < num; i++) {
      // Divides number of elements to position them concentrically
      const slice = math.degToRad(360 / num);
      const angle = slice * i;
      
  
      if (i > 0 && i % 3 === 0 && i % 4 === 0) {
        modifiedRadius = defaultRadius * random.range(0.6, 1);
        counter.both ++;
      } else if (i > 0 && i % 3 === 0) {
        counter.modulus3 ++;
        modifiedRadius = radiusObj[3] * random.range(0.7, 0.9);
      } else if (i > 0 && i % 4 === 0) {
        counter.modulus4 ++;
        modifiedRadius = radiusObj[4] * random.range(1.1, 1.5);
      } else {
        counter.other ++;
        modifiedRadius = defaultRadius * random.range(0.01, 1);
      }

    
      
      // Use sine and consine to distribute position rectangles around center
      x = cx + modifiedRadius * Math.sin(angle);
      y = cy + modifiedRadius * Math.cos(angle);

      // Reseting context
      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      // Randomly change dimensions of rectangle
      context.scale(random.range(0.1, 3),random.range(0.1, 0.2));

      context.beginPath();
      
      // Random colors
      let alphaRand = random.range(0.6, 1);
      let red = random.range(220, 240);
      let green = random.range(220, 240);
      let blue = random.range(0, 50);

      context.fillStyle = getRandomColor(red, green, blue, alphaRand);
      // Draw rectangle and randomly position them
      context.rect(-w * 0.5, random.range(0, h * 0.5), w, h);
      context.fill();
      context.restore();

      context.save();

      // Colors for arcs
      alphaRand = Math.random();
      red = random.range(0, 100);
      green = random.range(100, 240);
      blue = random.range(50, 240);

      context.strokeStyle = getRandomColor(red, green, blue, alphaRand);
      context.translate(cx, cy);
      context.rotate(-angle);
      context.lineWidth = random.range(10, 25);

      context.beginPath();
      context.arc(0, 0, modifiedRadius * random.range(0.1, 1.2), slice * random.range(2, 10), slice * random.range(10, 20));
      context.stroke();

      context.restore();
    };
  }

};

canvasSketch(sketch, settings);
