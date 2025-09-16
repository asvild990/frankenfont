let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Form &\nFunction";
let cols = 24;
let rows = 18;
let fontGrid = [];
let freezeMap = [];
let canvasW, canvasH;
let textSizeValue;
let offscreen;
let baseFont = "Futura";

// 💡 Adjustable nudging
let xNudgeCells = 2;
let yNudgeCells = 4;
let freezeRadius = 2;
let autoChangeInterval = 0;

function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  offscreen = createGraphics(canvasW, canvasH);
  offscreen.textAlign(LEFT, TOP);
  offscreen.fill("black");

  initFontGrid();
  initFreezeMap();
  getTextHeight();
  renderBaseMessage();
  noLoop();
  drawGrid();
  setInterval(autoRandomize, autoChangeInterval);
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
  offscreen.textFont(baseFont);
  textSizeValue = canvasW * 0.20;
  offscreen.textSize(textSizeValue);
}

function renderBaseMessage() {
  offscreen.background(255, 0); // transparent
  offscreen.textFont(baseFont);
  offscreen.textSize(textSizeValue);
  let nudgeX = -xNudgeCells * (canvasW / cols);
  let nudgeY = -yNudgeCells * (canvasH / rows);
  offscreen.text(message, nudgeX, nudgeY);
}

function drawGrid() {
  background("#F3F3F3");
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let tile = getFontTile(i, j, cellSize);
      image(tile, offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
      stroke(0, 25);
      noFill();
      rect(offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
    }
  }
}

function getFontTile(col, row, cellSize) {
  let pg = createGraphics(cellSize, cellSize);
  let srcX = col * cellSize;
  let srcY = row * cellSize;
  let snippet = offscreen.get(srcX, srcY, cellSize, cellSize);

  // draw snippet as guide
  pg.image(snippet, 0, 0, cellSize, cellSize);

  // overlay matching text in target font
  pg.fill("black");
  pg.textFont(fontGrid[row][col]);
  pg.textAlign(LEFT, TOP);
  pg.textSize(textSizeValue);
  let nudgeX = -col * cellSize + xNudgeCells * cellSize;
  let nudgeY = -row * cellSize + yNudgeCells * cellSize;
  pg.text(message, nudgeX, nudgeY);

  return pg;
}

function autoRandomize() {
  let count = floor(random(36, 48));
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  for (let n = 0; n < count; n++) {
    let i = floor(random(cols));
    let j = floor(random(rows));
    if (!freezeMap[j][i]) {
      fontGrid[j][i] = random(fonts);

      let tile = getFontTile(i, j, cellSize);
      image(tile, offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);

      stroke(0, 25);
      noFill();
      rect(offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
    }
  }
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

  drawGrid();
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  offscreen = createGraphics(canvasW, canvasH);
  offscreen.textAlign(LEFT, TOP);
  getTextHeight();
  renderBaseMessage();
  drawGrid();
}
