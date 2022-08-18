// hexagon calc: https://docs.google.com/spreadsheets/d/1JPoY6mOUoYhVmDqM3YDWBoRvZnL7mOEo2uX9TRnXkj8/edit?usp=sharing

// declare data variables
let year_1920 = 21;
let year_2019 = 73;

// declare fixed variables
let diam = 30;
let total_hex = year_2019;
let diagonal = 11;
let first_row = 6;
let side = first_row;

// declare dependent variables
let radius = diam / 2;
let upper_half = side - 1;
let rows = upper_half + side;

function setup() {
  createCanvas(700, 700);
}

// draw
function draw() {
  background("#ffae5");
  noFill();
  strokeWeight(1.2);
  stroke("#ffb703");

  // start counters
  yellow = 0;
  counter = 0;
  row_cells = first_row;

  push();
  translate(200, 100);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < row_cells; i++) {
      if (yellow >= year_1920) {
        stroke(255);
        fill("#ffb703");
      }
      yellow++;

      if (counter >= total_hex) {
        noStroke();
        noFill();
      }

      push();
      translate(-j * (radius + radius / 2 + radius / 4), 0);

      if (
        diagonal > i &&
        !(i < upper_half && j > upper_half && j - i > upper_half)
      ) {
        push();
        translate(i * 2 * diam - (i * radius) / 2, 3 * j * (diam / 2));
        polygon(0, 0, diam, 6);
        pop();

        counter++;
      }
      pop();
    }

    if (rows > j) {
      row_cells++;
    }
  }

  pop();
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + sin(a) * radius;
    let sy = y + cos(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
