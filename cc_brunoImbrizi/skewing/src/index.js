const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080]
  // animate: true,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h;
  const num = 20;
  const degrees = 30;

  const rects = [];

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(400, 600);
    h = random.range(40, 200);

    rects.push({ x, y, w, h });
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h } = rect;

      context.save(); // push
      context.translate(x, y);

      context.strokeStyle = "blue";
      drawSkewRect({ context, w, h, degrees });

      context.restore(); // pop
    });
  };
};

const drawSkewRect = ({ context, w = 600, h = 200, degrees = -45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save(); // push
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.lineTo(0, 0);
  context.closePath();
  context.stroke();

  context.restore();
};

canvasSketch(sketch, settings);
