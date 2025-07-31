// Adapted p5.js sketch
let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Visual\nSystems";
let cols = 24;
let rows = 18;
let fontGrid = [];
let canvasW = 980;
let canvasH = 800;
let h; // full text height
let offscreen;

function setup() {
  createCanvas(canvasW, canvasH);
  offscreen = createGraphics(canvasW, canvasH);
  offscreen.textAlign(CENTER, CENTER);
  initFontGrid();
  getTextHeight();
  noLoop();
  drawGrid();
}

function initFontGrid() {
  for (let j = 0; j < rows; j++) {
    fontGrid[j] = [];
    for (let i = 0; i < cols; i++) {
      fontGrid[j][i] = random(fonts);
    }
  }
}

function getTextHeight() {
  let maxHeight = 0;
  for (let font of fonts) {
    offscreen.textFont(font);
    offscreen.textSize(canvasW);
    offscreen.textSize(0.80 * canvasW * canvasW / offscreen.textWidth(message));
    maxHeight = max(maxHeight, offscreen.textAscent());
  }
  h = maxHeight;
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

      // Add visible grid lines
      stroke(0, 25); // light black
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
  pg.textSize(0.80 * canvasW * canvasW / pg.textWidth(message));
  pg.text(message, -col * cellSize, -row * cellSize);
  return pg;
}

function mousePressed() {
  let cellSize = min(canvasW / cols, canvasH / rows);
  let offsetX = (canvasW - cols * cellSize) / 2;
  let offsetY = (canvasH - rows * cellSize) / 2;
  let col = floor((mouseX - offsetX) / cellSize);
  let row = floor((mouseY - offsetY) / cellSize);

  let radius = 2;
  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {
      let ni = col + i;
      let nj = row + j;
      if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
        fontGrid[nj][ni] = random(fonts);
      }
    }
  }
  drawGrid();
}

function windowResized() {
  resizeCanvas(canvasW, canvasH);
  drawGrid();
}
