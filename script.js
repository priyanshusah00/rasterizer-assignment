const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Move origin to center
ctx.translate(WIDTH / 2, HEIGHT / 2);

// Plot single pixel
function plotPixel(x, y, color = "white", alpha = 1) {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fillRect(Math.round(x), Math.round(-y), 1, 1);
  ctx.globalAlpha = 1;
}

/* =========================
   DDA LINE ALGORITHM (RED)
   ========================= */
function drawLineDDA(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;

  let steps = Math.max(Math.abs(dx), Math.abs(dy));
  let xInc = dx / steps;
  let yInc = dy / steps;

  let x = x1;
  let y = y1;

  for (let i = 0; i <= steps; i++) {
    plotPixel(x, y, "red");
    x += xInc;
    y += yInc;
  }
}

/* ==============================
   BRESENHAM LINE (GREEN)
   ============================== */
function drawLineBresenham(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);

  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;

  let err = dx - dy;

  while (true) {
    plotPixel(x1, y1, "green");

    if (x1 === x2 && y1 === y2) break;

    let e2 = 2 * err;

    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}

/* ==============================
   MIDPOINT CIRCLE (BLUE)
   ============================== */
function drawCircleMidpoint(xc, yc, r) {
  let x = 0;
  let y = r;
  let p = 1 - r;

  while (x <= y) {
    plotCirclePoints(xc, yc, x, y);
    x++;

    if (p < 0) {
      p += 2 * x + 1;
    } else {
      y--;
      p += 2 * x - 2 * y + 1;
    }
  }
}

function plotCirclePoints(xc, yc, x, y) {
  plotPixel(xc + x, yc + y, "blue");
  plotPixel(xc - x, yc + y, "blue");
  plotPixel(xc + x, yc - y, "blue");
  plotPixel(xc - x, yc - y, "blue");
  plotPixel(xc + y, yc + x, "blue");
  plotPixel(xc - y, yc + x, "blue");
  plotPixel(xc + y, yc - x, "blue");
  plotPixel(xc - y, yc - x, "blue");
}

/* ==============================
   WU LINE ALGORITHM (YELLOW)
   ============================== */
function drawLineWu(x0, y0, x1, y1) {
  function ipart(x) { return Math.floor(x); }
  function fpart(x) { return x - Math.floor(x); }
  function rfpart(x) { return 1 - fpart(x); }

  let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }

  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }

  let dx = x1 - x0;
  let dy = y1 - y0;
  let gradient = dx === 0 ? 1 : dy / dx;
  let y = y0;

  for (let x = x0; x <= x1; x++) {
    if (steep) {
      plotPixel(ipart(y), x, "yellow", rfpart(y));
      plotPixel(ipart(y) + 1, x, "yellow", fpart(y));
    } else {
      plotPixel(x, ipart(y), "yellow", rfpart(y));
      plotPixel(x, ipart(y) + 1, "yellow", fpart(y));
    }
    y += gradient;
  }
}

/* =========================
   LABELS
   ========================= */
ctx.fillStyle = "white";
ctx.font = "14px Arial";
ctx.fillText("DDA Line (Red)", -380, 280);
ctx.fillText("Bresenham Line (Green)", -380, 260);
ctx.fillText("Midpoint Circle (Blue)", -380, 240);
ctx.fillText("Wu Line (Yellow)", -380, 220);

/* =========================
   TEST CASES (ALL QUADRANTS)
   ========================= */
drawLineDDA(-250, -150, 250, -50);
drawLineBresenham(-250, 150, 250, 50);
drawCircleMidpoint(0, 0, 120);
drawLineWu(-200, -20, 200, 80);
