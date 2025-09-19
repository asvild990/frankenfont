let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Form &\nFunction";
let cols = 24;
let rows = 18;
let fontGrid = [];
let canvasW, canvasH, textSizeValue;
let xNudgeCells = 2;
let yNudgeCells = 4;
let freezeMap = [];
let freezeRadius = 2;
let liveCycleRadius = 2;
let dirtyMap = [];
let tileCache = [];

function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  textAlign(LEFT, TOP);
  initFontGrid();
  getTextHeight();
  initFreezeMap();
  initDirtyMap();
  frameRate(4);
}

function initFontGrid() {
  for (let j = 0; j < rows; j++) {
    fontGrid[j] = [];
    tileCache[j] = [];
    for (let i = 0; i < cols; i++) {
      fontGrid[j][i] = random(fonts);
      tileCache[j][i] = null; // Empty cache
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

function initDirtyMap() {
  for (let j = 0; j < rows; j++) {
    dirtyMap[j] = [];
    for (let i = 0; i < cols; i++) {
      dirtyMap[j][i] = true; // Draw everything at the start
    }
  }
}

function getTextHeight() {
  textFont("Futura");
  textSizeValue = canvasW * 0.20;
  textSize(textSizeValue);
}

function draw() {
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  let col = floor((mouseX - offsetX) / cellSize);
  let row = floor((mouseY - offsetY) / cellSize);

  // Live-cycle: continually randomize within cursor zone
  for (let j = -liveCycleRadius; j <= liveCycleRadius; j++) {
    for (let i = -liveCycleRadius; i <= liveCycleRadius; i++) {
      let ni = col + i;
      let nj = row + j;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows && !freezeMap[nj][ni]) {
        fontGrid[nj][ni] = random(fonts);
        dirtyMap[nj][ni] = true; // Mark for redraw
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
      if (dirtyMap[j][i] || tileCache[j][i] == null) {
        tileCache[j][i] = getSector(j, i, cellSize);
        dirtyMap[j][i] = false;
      }
      image(tileCache[j][i], offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
      stroke(0, 25);
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
  pg.textLeading(textSizeValue * 1.2); // spacing for multiline

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
  getTextHeight();
  initDirtyMap(); // Redraw all tiles
}
