//to-do: move all local drawing functions to object level

class Renderer {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    
    this.particles = [];
  }
  
  init() {
    this.canvas = createGraphics(this.width, this.height);
    this.spriteLayer = createGraphics(this.width, this.height);
    this.guiLayer = createGraphics(this.width, this.height);
  }

  render() {
    this.spriteLayer.clear();
    this.canvas.background(0);
  
    this.drawEnvironment(this.canvas);
    game.getActiveGrid().draw(this.canvas);
  
    game.audio.sequencers.forEach((s) => {
      s.draw(this.canvas);
    });
  
    this.drawMouse(this.canvas);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(this.canvas);
      if (particles[i].age > particles[i].lifespan) {
        particles.splice(i, 1);
      }
    }
    
    this.drawCrops(this.spriteLayer);
  
    image(this.canvas, 0, 0);
    image(this.spriteLayer, 0, 0);
  }

  drawMouseRequest() {
    this.guiLayer.push();
    this.guiLayer.background(0);
    this.guiLayer.rectMode(CENTER);
    this.guiLayer.fill(255);
    this.guiLayer.stroke(255);
    this.guiLayer.textFont(font);
    this.guiLayer.textSize(64);
    this.guiLayer.textAlign(CENTER, CENTER);
    this.guiLayer.text('CLICK TO ENABLE AUDIO', this.width*0.5, this.height*0.5, this.width*0.25, this.height);
    this.guiLayer.pop();
    image(this.guiLayer, 0, 0);
  }

  drawCrops(graphics) {
    const grid = game.getActiveGrid();
    
    for (var x = 0; x < grid.cols; x++) {
      for (var y = 0; y < grid.rows; y++) {
      
        let cell = grid.getCell(x, y);
        if (!cell.active) continue;
        
        const crop = cell.crop;
        
        if (crop.age >= crop.ripeAge) {
          drawCell(this.canvas, crop.x, crop.y, color(0, 255, 0), -1);
        }
  
        crop.draw(graphics);
      }
    }
  }

  drawMouse(graphics) {
    const grid = game.getActiveGrid();
    
    var mX = grid.screenToCellX(mouseX, mouseY + game.cellHeight*0.5);
    var mY = grid.screenToCellY(mouseX, mouseY + game.cellHeight*0.5);
    
    const cell = grid.cellExists(mX, mY);
  
    if (cell) {
      let fillColor = color(0, 220, 0);
      if (cell.active && cell.crop.age < cell.crop.ripeAge) {
          fillColor = color(0, 0, 255);
      }
      
      drawCell(graphics, grid.cellToScreenX(mX, mY), grid.cellToScreenY(mX, mY), color(255), fillColor);
    }
  }

  drawEnvironment(graphics) {
    this.drawSun(graphics);
    
    //draw horizon
    graphics.push();
    graphics.fill(0);
    graphics.noStroke();
    graphics.rect(0, game.height/4, game.width, game.height);
    graphics.pop();
    
    graphics.push();
    graphics.strokeWeight(game.width * 0.0025);
    graphics.stroke(255);
    graphics.line(0, game.height/4, game.width, game.height/4);
    graphics.pop();
  }
  
  drawSun(graphics) {
    graphics.push();
  
    graphics.translate(game.width/2, game.height/4);
    let orbit = -game.time/10;
  
    graphics.fill(255, 255, 0);
    graphics.stroke(255);
    graphics.strokeCap(PROJECT);
    graphics.strokeWeight(game.width * 0.0025);
  
    graphics.beginShape();
    for (let i = 0; i < 32; i++) {
        let a = TWO_PI/32 * i - orbit;
  
        let x = cos(a) * (game.width/16);
        let y = sin(a) * (game.width/16);
  
        graphics.push();
        let x2 = x + (game.width/16) * (sin(game.time + i*2) * 0.25 + 0.5) * cos(a);
        let y2 = y + (game.width/16) * (sin(game.time + i*2) * 0.25 + 0.5) * sin(a);
        graphics.line(x, y, x2, y2);
        graphics.pop();
  
        graphics.vertex(x, y);
    }
    graphics.endShape(CLOSE);
  
    graphics.pop();
  }
}

//create inputs for particle creation and move into the renderer
const particles = [];

//drawCell is useful for many objects...
function drawCell(graphics, tX, tY, strokeColor = color(255), fillColor = -1) {
  graphics.push();
  graphics.translate(tX, tY);
  
  graphics.strokeWeight(game.width * 0.0025);
  
  if (strokeColor == -1) {
    graphics.noStroke();
  } else {
    graphics.stroke(strokeColor);
  }
  
  if (fillColor == -1) {
    graphics.noFill();
  } else {
    graphics.fill(fillColor);
  }
  
  graphics.beginShape();
  for (let i = 0; i < 4; i++) {
    let angle = TWO_PI/4 * i;
    
    var x = cos(angle) * game.cellWidth  * 0.5;
    var y = sin(angle) * game.cellHeight * 0.5;
    
    graphics.vertex(x, y);
  }
  graphics.endShape(CLOSE);
  
  graphics.pop();
}