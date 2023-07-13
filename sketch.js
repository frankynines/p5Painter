let canvas;
let currentColor;
let currentSize;
let isDrawing = false;
let saveButton;
let clearButton;
let rainbowButton;
let isRainbowBrush = false;

let prevX = 0;
let prevY = 0;

let lines = [];

class Line {
  constructor(x1, y1, x2, y2, isRainbow) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.isRainbow = isRainbow;
    if (!isRainbow) {
      this.color = currentColor.toString('#rrggbb');
    }
    this.hue = random(360);
  }

  draw() {
    strokeWeight(currentSize);
    if (this.isRainbow) {
      colorMode(HSB, 360, 100, 100);
      this.hue = (this.hue + 5) % 360;
      stroke(this.hue, 100, 100);
    } else {
      colorMode(RGB, 255);
      stroke(this.color);
    }
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

function setup() {
  canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');

  background(255);
  prevX = mouseX;
  prevY = mouseY;

  currentColor = color(0, 0, 0);
  currentSize = 5;

  rainbowButton = createButton('Rainbow');
  rainbowButton.mousePressed(() => isRainbowBrush = !isRainbowBrush);
  rainbowButton.parent('controls-container');

  saveButton = createButton('Save');
  saveButton.mousePressed(() => saveCanvas(canvas, 'myCanvas', 'png'));
  saveButton.parent('controls-container');

  clearButton = createButton('Clear');
  clearButton.mousePressed(clearCanvas);
  clearButton.parent('controls-container');

  saveStaticButton = createButton('Save as static sketch');
  saveStaticButton.mousePressed(saveStaticSketch);
  saveStaticButton.parent('controls-container');

  let colorsContainer = createDiv();
  colorsContainer.parent('controls-container');
  createColorButtons(colorsContainer);

  let sizesContainer = createDiv();
  sizesContainer.parent('controls-container');
  createSizeButtons(sizesContainer);
}

function createColorButtons(container) {
  let colors = [
    color(0, 0, 0),
    color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255),
    color(255, 255, 0),
    color(255, 0, 255),
    color(0, 255, 255)
  ];

  for (let i = 0; i < colors.length; i++) {
    let button = createButton('');
    button.style('background-color', colors[i].toString());
    button.mousePressed(() => {
      currentColor = colors[i];
      isRainbowBrush = false;
    });
    button.parent(container);
  }
}

function createSizeButtons(container) {
  let sizes = [2, 5, 10, 20];

  for (let i = 0; i < sizes.length; i++) {
    let button = createButton(sizes[i].toString());
    button.mousePressed(() => {
      currentSize = sizes[i];
    });
    button.parent(container);
  }
}

function draw() {
  background(255);
  
  for (let line of lines) {
    line.draw();
  }
  
  if (mouseIsPressed && isDrawing) {
    let newLine = new Line(prevX, prevY, mouseX, mouseY, isRainbowBrush);
    lines.push(newLine);
    newLine.draw();
  }
  
  prevX = mouseX;
  prevY = mouseY;
}

function mousePressed() {
  isDrawing = true;
  lines.push(new Line(prevX, prevY, mouseX, mouseY, isRainbowBrush));
}

function mouseReleased() {
  isDrawing = false;
}

function clearCanvas() {
  lines = [];
}

function saveStaticSketch() {
  let code = `
  function setup() {
    createCanvas(800, 600);
    noLoop();
  }
  
  function draw() {
    background(255);
  `;

  for (let line of lines) {
    if (line.isRainbow) {
      code += `
      colorMode(HSB, 360, 100, 100);
      stroke(${line.hue}, 100, 100);
      line(${line.x1}, ${line.y1}, ${line.x2}, ${line.y2});
      `;
    } else {
      code += `
      colorMode(RGB, 255);
      stroke('${line.color}');
      line(${line.x1}, ${line.y1}, ${line.x2}, ${line.y2});
      `;
    }
  }

  code += '}\n';

  saveStrings(code.split('\n'), 'sketch.js');
}
