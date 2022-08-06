const canvasSketch = require("canvas-sketch");
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases')

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const sketch = () => {

  const numCircles = 5;
  const numSlices = 9;
  const slice = Math.PI * 2 / numSlices;
  const radius = 300;

  const bins = [];
  const lineWidths = [];

  let lineWidth, bin, mapped;

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 400);
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 300;
    lineWidths.push(lineWidth);
  };

  return ({ context, width, height }) => {
    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);

    let cradius = radius;

    for (let i = 0; i < numCircles; i++) {
      context.save();

      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 0.75, true);
        lineWidth = lineWidths[i] * mapped;
        context.lineWidth = lineWidth;

        context.beginPath();
        context.arc(0, 0, cradius + context.lineWidth * 0.03, 0, slice);
        context.stroke();
      };

      cradius = lineWidths[i];
      context.restore();

    };

    context.restore();

  };
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    }
    else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement("audio");
  audio.src = "duPre.mp3";

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);
  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  console.log(minDb);

  // store the data in an array
  audioData = new Float32Array(analyserNode.frequencyBinCount);

  console.log(audioData.length);
};

const getAverage = (data) => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];

    console.log(sum);
  };

  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
}

start();
