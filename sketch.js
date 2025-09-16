let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Form &\nFunction";
let cols = 24;
let rows = 18;
let fontGrid = [];
let freezeMap = [];
let canvasW, canvasH, cellSize;
let textSizeValue;
let offscreen;
let currentFont = "Futura";

function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  cellSize = min(canvasW / cols, canvasH / rows);
  offscreen = createGraphics(canvasW, canvasH);
  offscreen.textAlign(LEFT, TOP);
  textSizeValue = canvasW * 0.20;
  offscreen.textSize(textSizeValue);

  initFontGrid();
  initFreezeMap();
  drawOffscreenText(currentFont);
  drawGrid();

  setInterval(autoRandomize, 100); // fast interval, but optimized
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

function drawOffscreenText(font) {
  offscreen.clear();
  offscreen.fill("black");
  offscreen.textFont(font);
  offscreen.textSize(textSizeValue);

  // Nudging
  let xNudge = -2 * cellSize;
  let yNudge = -4 * cellSize;

  offscreen.text(message, xNudge, yNudge);
}

function drawGrid() {
  background("#F3F3F3");
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let sx = i * cellSize;
      let sy = j * cellSize;

      image(
        getTile(i, j),
        offsetX + i * cellSize,
        offsetY + j * cellSize,
        cellSize,
        cellSize
      );

      stroke(0, 25);
      noFill();
      rect(offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
    }
  }
}

function getTile(i, j) {
  let pg = createGraphics(cellSize, cellSize);
  pg.imageMode(CORNER);
  pg.image(
    offscreen,
    0,
    0,
    cellSize,
    cellSize,
    i * cellSize,
    j * cellSize,
    cellSize,
    cellSize
  );
  return pg;
}

function autoRandomize() {
  let count = floor(random(36, 48));
  let updated = [];

  for (let n = 0; n < count; n++) {
    let i = floor(random(cols));
    let j = floor(random(rows));
    if (!freezeMap[j][i]) {
      fontGrid[j][i] = random(fonts);
      updated.push({ i, j });
    }
  }

  if (updated.length > 0) {
    currentFont = random(fonts);
    drawOffscreenText(currentFont);
    redrawTiles(updated);
  }
}

function redrawTiles(tiles) {
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;

  for (let t of tiles) {
    let i = t.i;
    let j = t.j;

    let tile = getTile(i, j);
    image(tile, offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);

    stroke(0, 25);
    noFill();
    rect(offsetX + i * cellSize, offsetY + j * cellSize, cellSize, cellSize);
  }
}

function mousePressed() {
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;
  let col = floor((mouseX - offsetX) / cellSize);
  let row = floor((mouseY - offsetY) / cellSize);

  let radius = 2;
  let updated = [];

  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {
      let ni = col + i;
      let nj = row + j;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
        freezeMap[nj][ni] = true;
        updated.push({ i: ni, j: nj });
      }
    }
  }

  if (updated.length > 0) {
    redrawTiles(updated);
  }
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  cellSize = min(canvasW / cols, canvasH / rows);
  offscreen = createGraphics(canvasW, canvasH);
  textSizeValue = canvasW * 0.20;
  offscreen.textSize(textSizeValue);
  drawOffscreenText(currentFont);
  drawGrid();
}
