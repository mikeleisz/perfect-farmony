class Particle {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.lifespan = 30;
    this.age = 0;
    
    this.color = c;
  }
  
  update() {
    this.age++;
  }
  
  draw(graphics) {
    let a = (1.0 - this.age/this.lifespan);
    drawCell(graphics, this.x, this.y, -1, color(red(this.color), 
                                                     green(this.color), 
                                                     blue(this.color), 
                                                     255 * a));
  }
}

class TileGlow extends Particle {
  constructor(x, y, c) {
    super(x, y, c);
    this.height = game.cellHeight * 0.5;
  }
  
  draw(graphics) {
    const y = this.y - this.height;
    const a = (1.0 - this.age/this.lifespan);
    for (let i = 0; i < this.height; i++) {
      let alpha = a * i/this.height;
      drawCell(graphics, this.x, y + i, -1, color(red(this.color), 
                                                      green(this.color), 
                                                      blue(this.color) * alpha, 
                                                      127 * alpha));
    }
  }
}

class Confetti extends Particle {
  constructor(x, y) {
    super(x, y, color(0));
    
    let a = random(TWO_PI);
    this.speedX = cos(a) * random(1, 2);
    this.speedY = sin(a) * random(1, 2);
    this.size = (game.width/32) + (game.width/80)*random(-1, 1);
    
    this.lifespan = random(15, 30);
  }
  
  update(){
    super.update();
    this.x += this.speedX;
    this.y += this.speedY;
  }
  
  draw(graphics) {
    graphics.push();
    graphics.noStroke();
    graphics.rectMode(CENTER);
    const r = floor(random(2)) * 255;
    const g = floor(random(2)) * 255;
    const b = floor(random(2)) * 255;
    graphics.fill(r, g, b);
    graphics.rect(this.x, this.y, map(this.age, 0, this.lifespan, this.size, 0));
    graphics.pop();
  }
}