const CROP_STATES = {
  IDLE  : 0,
  DANCE : 1,
  GROW  : 2,
  PLANT : 3,
  PICK  : 4
};

class Crop extends SoundEntity {
  constructor(x, y, note) {
    super(x, y, note);
    
    this.offsetY = 0;
    
    this.cropWidth  = game.cellWidth  * 0.5;
    this.cropHeight = game.cellHeight * 0.5;
    this.scale = 0;
    this.maskLength = 0;
    
    this.age = 0;
    this.ripeAge = 4;
    this.rotAge = 8;
    
    this.growthMinScale = 0.0;
    this.growthMaxScale = 0.75;
    this.growthScale = this.growthMinScale;
    
    this.animationState = CROP_STATES.PLANT;
    this.animationBuffer = 0.0;
    this.animation = 0.0;
    this.isBusy = false;
    this.animationStage = 0;
    
    this.strokeColor = color(255);
    
    this.picked = false;
    this.rotten = false;
    this.destroyed = false;
  }
  
  update() {
    this.animationStateMachine();
  }
  
  animationStateMachine() {
    this.delta = game.delta;
    
    switch (this.animationState) {
      case CROP_STATES.IDLE:
        this.idle();
        break;
      case CROP_STATES.DANCE:
        this.dance();
        break;
      case CROP_STATES.GROW:
        this.grow();
        break;
      case CROP_STATES.PLANT:
        this.plant();
        break;
      case CROP_STATES.PICK:
        this.pick();
        break;
    }
  }

  changeAnimationState(nextState) {
    if (this.isBusy) return;
    this.animationState = nextState;
  }
  
  animate(stages, startEvents = () => {}, endEvents = () => {}) {
    
    if (!this.isBusy) {
      startEvents();
      this.animationStage = 0;
      this.isBusy = true;
    }
    
    const speed = stages[this.animationStage].speed;
    const curve = pow(sin(PI * this.animation), 3);
    
    stages[this.animationStage].animationEvent(this.animation, curve);
    
    this.animation += this.delta * speed;
    
    if (this.animation >= 1) {
      this.animation = 0.0;
      this.animationStage++;
    }
    
    if (this.animationStage > stages.length - 1) {
      endEvents();
      
      this.isBusy = false;
      this.changeAnimationState(CROP_STATES.IDLE);
    }
  }
  
  idle() {
    this.animation = 0.0;
    this.isBusy = false;
  }
  
  dance() {}
  plant() {}
  pick() {}
  grow() {}

  display() {
    if (this.destroyed) return;
    
    push();
    fill(255);
    ellipse(this.x, this.y, this.cropWidth * this.scale, this.cropHeight * this.scale);
    pop();
  }

  setStroke(graphics) {
    if (this.strokeColor == -1) graphics.noStroke();
    else graphics.stroke(this.strokeColor);
  }
  
  drawMask(graphics, tX, tY) {
    graphics.push();

    graphics.translate(tX, tY);
    
    graphics.fill(0);
    graphics.erase();
    graphics.beginShape();
    for (let i = 0; i < 3; i++) {
      let a = TWO_PI/4 * i;
      let x = cos(a) * game.cellWidth  * 0.48;
      let y = sin(a) * game.cellHeight * 0.48;
      graphics.vertex(x, y);
    }
    graphics.endShape();
    graphics.noErase();

    this.setStroke(graphics);
    graphics.strokeWeight(graphics.width * 0.0025);
    graphics.line(-this.maskLength*1.5, 0, this.maskLength*1.5, 0);

    graphics.pop();
  }

  pickCrop() {
    this.changeAnimationState(CROP_STATES.PICK);
  }
  
  interact() {
    if (this.age >= this.ripeAge) {
      this.changeAnimationState(CROP_STATES.PICK);
    } else {
      this.changeAnimationState(CROP_STATES.DANCE);
    }
  }

  playNote(dur, time) {
    if (this.picked) return;
    super.playNote(dur, time);
  }

  setNote(note) {
    this.note = note;
  }

  sequencerUpdate() {
    let particleColor = color(255, 255, 0);
    
    this.age++;
    if (this.age < this.ripeAge) {
      this.changeAnimationState(CROP_STATES.GROW);
    } else {
      this.changeAnimationState(CROP_STATES.DANCE);
      particleColor = color(0, 255, 0);
    }
    
    //create inputs in the renderer for these actions
    particles.push(new TileGlow(this.x, this.y, particleColor));
    particles.push(new Particle(this.x, this.y, particleColor));  
  }
}