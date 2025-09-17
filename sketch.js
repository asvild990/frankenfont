let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Form &\nFunction";
let cols = 24;
let rows = 18;
let fontGrid = [];
let canvasW;
let canvasH;
let textSizeValue;
let offscreen;

// 💡 Adjustable nudging
let xNudgeCells = 2;
let yNudgeCells = 4;

// ❄️ Click-freeze system
let freezeMap = [];
let freezeRadius = 2;

function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  offscreen = createGraphics(canvasW, canvasH);
  offscreen.textAlign(LEFT, TOP);
  initFontGrid();
  getTextHeight();
  initFreezeMap();
  frameRate(12); // controls how fast randomization happens
  loop(); // make sure draw() keeps running
}

function initFontGrid() {
  for (let j = 0; j < rows; j++) {
    fontGrid[j] = [];
    for (let i = 0; i < cols; i++) {
      fontGrid[j][i] = random(fonts);
    }
  }
}

function initFreezeMap() {
  for (let j = 0; j < rows; j++) {
    freezeMap[j] = [];
    for (let i = 0; i < cols; i++) {
      freezeMap[j][i] = false;
    }
  }
}

function getTextHeight() {
  offscreen.textFont("Futura");
  textSizeValue = canvasW * 0.20;
  offscreen.textSize(textSizeValue);
}

function draw() {
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  // Cursor position converted to grid cell
  let col = floor((mouseX - offsetX) / cellSize);
  let row = floor((mouseY - offsetY) / cellSize);

  // Only randomize within bounds
  for (let j = -freezeRadius; j <= freezeRadius; j++) {
    for (let i = -freezeRadius; i <= freezeRadius; i++) {
      let ni = col + i;
      let nj = row + j;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows && !freezeMap[nj][ni]) {
        fontGrid[nj][ni] = random(fonts);
      }
    }
  }

  drawGrid();
}

function drawGrid() {
  background("#F3F3F3");
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let tile = getSector(j, i, cellSize);
      image(tile, offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
      stroke(0, 25); // grid lines
      noFill();
      rect(offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
    }
  }
}

function getSector(row, col, cellSize) {
  let pg = createGraphics(cellSize, cellSize);
  pg.fill("black");
  pg.textFont(fontGrid[row][col]);
  pg.textAlign(LEFT, TOP);
  pg.textSize(textSizeValue);
  let nudgeX = (col - xNudgeCells) * cellSize;
  let nudgeY = (row - yNudgeCells) * cellSize;
  pg.text(message, -nudgeX, -nudgeY);
  return pg;
}

function mousePressed() {
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;
  let col = floor((mouseX - offsetX) / cellSize);
  let row = floor((mouseY - offsetY) / cellSize);

  for (let j = -freezeRadius; j <= freezeRadius; j++) {
    for (let i = -freezeRadius; i <= freezeRadius; i++) {
      let ni = col + i;
      let nj = row + j;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
        freezeMap[nj][ni] = true;
      }
    }
  }
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  offscreen = createGraphics(canvasW, canvasH);
  getTextHeight();
  drawGrid();
}
