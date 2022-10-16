var font;
function preload() {
  font = loadFont('assets/ChargeVectorThin-d9qdR.ttf');
}

function setup() {
  createCanvas(game.width, game.height);
  game.init();
  intro = buildIntroSequence();
  scheduleIntroSequence();
}

function draw() {
  game.update();
  game.render();
}

function mousePressed() {
  if (!game.audio.started) {
    game.audio.start();
    return;
  }
  
  const grid = game.getActiveGrid();
  
  let mX = grid.screenToCellX(mouseX, mouseY + game.cellHeight*0.5);
  let mY = grid.screenToCellY(mouseX, mouseY + game.cellHeight*0.5);

  const cell = grid.cellExists(mX, mY);
  if (cell) {
    cell.interact(mX, mY);
  }
}

var intro;
function buildIntroSequence() {
  const grid = game.getActiveGrid();
  const sequence = [];
  sequence.push([grid.cellToScreenX(0, 7), grid.cellToScreenY(0, 7)]);
  sequence.push([grid.cellToScreenX(0, 5), grid.cellToScreenY(0, 5)]);
  sequence.push([grid.cellToScreenX(0, 3), grid.cellToScreenY(0, 3)]);
  sequence.push([grid.cellToScreenX(0, 1), grid.cellToScreenY(0, 1)]);
  return sequence;
}

function playIntroSequenceEvent(index) {
  const [cX, cY] = intro[index];
  const sX = game.grid.screenToCellX(cX, cY);
  const sY = game.grid.screenToCellY(cX, cY);
  const cell = game.grid.cellExists(sX, sY);
  if (cell) {
    cell.interact(sX, sY);
  }
}

function scheduleIntroSequence() {
  let t = game.audio.now();
  
  for (let i = 0; i < intro.length; i++) {

    const event = () => {
      playIntroSequenceEvent(i);
    }

    game.audio.scheduleGameEvent(t, event);

    t += 0.1;
  }
}