let fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell"];
let message = "Visual\nSystems";
let cols = 20;
let rows = 11;
let fontGrid = [];
let canvasW = 980;
let canvasH = 900;
let h; // full text height
let offscreen;

function setup() {
  createCanvas(canvasW, canvasH);
  offscreen = createGraphics(canvasW, canvasH);
  offscreen.textAlign(LEFT, TOP); // Not actually used now, but for safety
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
    offscreen.textSize(canvasW * canvasW / offscreen.textWidth(message));
    maxHeight = max(maxHeight, offscreen.textAscent());
  }
  h = maxHeight * 1.2 * 2; // add some leading
}

function drawGrid() {
  background("#F3F3F3");
  let cellW = canvasW / cols;
  let cellH = h / rows;
  stroke(0);
  strokeWeight(0.5);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let tile = getSector(j, i);
      image(tile, i * cellW, canvasH / 2 - h / 2 + j * cellH, cellW, cellH);
      noFill();
      rect(i * cellW, canvasH / 2 - h / 2 + j * cellH, cellW, cellH);
    }
  }
}

function getSector(row, col) {
  let cellW = canvasW / cols;
  let cellH = h / rows;
  let pg = createGraphics(cellW, cellH);
  pg.fill("black");
  pg.noStroke();
  pg.textFont(fontGrid[row][col]);
  pg.textAlign(LEFT, TOP);
  pg.textSize(canvasW * canvasW / pg.textWidth(message));
  pg.textLeading(pg.textSize() * 1.2);
  pg.text(message, -col * cellW, -row * cellH);
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
