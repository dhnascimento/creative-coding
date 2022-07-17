const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const params = {
  cell: 20,
  frequency_img: 0.1,
  amplitude_img: 0.8,
  frame: 0,
  angle: Math.PI * 2,
  radius: 0.5,
  animate: true,
}

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: params.animate
};

let manager, image;

const url = '/images/spfc.png';

let fontFamily = 'Helvetica'; 

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = params.cell;
  const cols =  Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height, frame }) => {
    typeContext.fillStyle = `rgba(0,0,0,0.3)`;
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows);
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.textBaseline = 'middle';
    context.textAlign = 'center';
    

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const f = params.animate ? frame : params.frame;

      const n = random.noise3D(x, y, f * 2, params.frequency_img, params.amplitude_img);

      const r = typeData[i * 4 + 0] ;
      const g = typeData[i * 4 + 1] ;
      const b = typeData[i * 4 + 2] ;
      const a = typeData[i * 4 + 3];

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      // context.fillRect(0, 0, cell, cell);

      context.beginPath();
      const angleModifier = math.mapRange(n, -1, 1, 0, params.angle); 
      const radiusModifier = math.mapRange(n, -1, 1, 0, params.radius);
      context.arc(0, 0, cell * radiusModifier, angleModifier, Math.PI * 2 );

      // context.fillText(glyph, 0, 0);

      context.fill();
      context.restore();
    }

  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({title: 'Cells'});
  folder.addInput(params, 'cell', { min:1, max: 50, step: 1});

  folder = pane.addFolder({title: 'Arc'});
  folder.addInput(params, 'radius', { min:0, max: 1, step: 0.01});
  folder.addInput(params, 'angle', {min: 0, max: Math.PI * 2})

  folder = pane.addFolder({title: 'Perrin Noise - Image'});
  folder.addInput(params, 'frequency_img', { min: -0.1, max: 0.1, step: 0.01 });
  folder.addInput(params, 'amplitude_img', { min: 0, max: 1, step: 0.01 }),
  folder.addInput(params, 'frame', { min: 0, max: 999 });
  folder.addInput(params, 'animate');
}

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  })
}

const start = async () => {
  try {
  image = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
  } catch(error) {
    console.log(error);
  }
};
createPane();
start();

