// Adapted p5.js sketch
let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Visual\nSystems";
let cols = 24;
let rows = 16;
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
    offscreen.textSize(0.8 * canvasW * canvasW / offscreen.textWidth(message));
    maxHeight = max(maxHeight, offscreen.textAscent());
  }
  h = maxHeight;
}

function drawGrid() {
  background("#F3F3F3");
  let cellW = canvasW / cols;
  let cellH = h / rows;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let tile = getSector(j, i);
      image(tile, i * cellW, canvasH / 2 - h / 2 + j * cellH, cellW, cellH);
    }
  }
}

function getSector(row, col) {
  let cellW = canvasW / cols;
  let cellH = h / rows;
  let pg = createGraphics(cellW, cellH);
  pg.fill("black");
  pg.textFont(fontGrid[row][col]);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(canvasW);
  pg.textSize(0.80 * canvasW * canvasW / pg.textWidth(message));
  pg.text(message, canvasW / 2 - col * cellW, h / 2 - row * cellH);
  return pg;
}

function mousePressed() {
  let cellW = canvasW / cols;
  let cellH = h / rows;
  let col = floor(mouseX / cellW);
  let row = floor((mouseY - (canvasH / 2 - h / 2)) / cellH);

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
