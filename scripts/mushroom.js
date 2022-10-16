class Mushroom extends Crop {
  constructor(x, y, note) {
    super(x, y, note);
    
    this.stemWidth  = this.cropWidth  * 0.20;
    this.stemHeight = this.cropHeight * 0.35;  
    this.stemOffset = this.cropHeight * this.growthScale;
    
    this.capWidth  = this.stemWidth  * 2.0;  
    this.capHeight = this.stemHeight * 1.5;
    
    this.stemColor = color(255);
    this.capColor  = color(255, 0, 0);
  }
  
  dance() {
    const that = this;
    
    const startEvent = () => {};

    const endEvent = () => {
      that.scale = 1.0;
    };

    const stages = [
      {
        speed : 5.0,
        animationEvent : (a, c) => {
          that.scale = 1.0 + (c * 0.5) * 0.25;
          const age = constrain(that.age, 0, that.ripeAge);
          const growth = map(age, 0, that.ripeAge, that.growthMinScale, that.growthMaxScale);
          this.growthScale = growth + c * (that.growthMaxScale/that.ripeAge);
        }
      }
    ];
    
    this.animate(stages, startEvent, endEvent);
  }
  
  grow() {    
    const that = this;
    
    const startEvent = () => {};

    const endEvent = () => {
      const target = map(that.age, 0, that.ripeAge, that.growthMinScale, that.growthMaxScale);
      that.growthScale = target;
    };

    const stages = [
      {
        speed : 4.0,
        animationEvent : (a, c) => {
          const target = map(that.age, 0, that.ripeAge, that.growthMinScale, that.growthMaxScale);
          const growth = lerp(that.growthScale, target, a);
          that.growthScale = growth + (c * (that.growthMaxScale/that.ripeAge) * 0.5);
        }
      }
    ];
    
    this.animate(stages, startEvent, endEvent);
  }
  
  plant() {
    const that = this;
    
    const startEvent = () => {
      that.scale = 0.0;
    };

    const endEvent = () => {
      that.maskLength = game.cellWidth * 0.5 * 0.20;
      that.scale = 1.0;
    };

    const stages = [
      {
        speed : 6.0,
        animationEvent : (a, c) => {
          that.maskLength = (a + c*0.5) * game.cellWidth * 0.5 * 0.20;
        }
      },
      {
        speed : 6.0,
        animationEvent : (a, c) => {
          that.scale = a + c * 0.25;
          const age = constrain(that.age, 0, that.ripeAge);
          const growth = map(age, 0, that.ripeAge, that.growthMinScale, that.growthMaxScale);
          that.growthScale = growth + c * (that.growthMaxScale/that.ripeAge);
        }
      }
    ];
    
    this.animate(stages, startEvent, endEvent);
  }
  
  pick() {
    const that = this;
    
    const startEvent = () => {
      that.picked = true;
    };

    const endEvent = () => {
      for (let i = 0; i < 16; i++) {
        particles.push(new Confetti(that.x + random(-that.capWidth, that.capWidth), 
                                    that.y + random(-that.stemHeight, that.stemHeight) + that.offsetY));
      }
      
      that.destroyed = true;
    };

    const stages = [
      {
        speed : 4.0,
        animationEvent : (a, c) => {
          that.offsetY = map(a, 0, 1, 0, -game.cellHeight*0.5);
          that.offsetY += c * game.cellHeight/2;
        }
      },
      {
        speed : 6.0,
        animationEvent : (a, c) => {
          that.maskLength = (game.cellWidth * 0.5 * 0.20) - ((a) * game.cellWidth * 0.5 * 0.20);
        }
      },
      {
        speed : 8.0,
        animationEvent : (a, c) => {
          const r = floor(random(2)) * 255;
          const g = floor(random(2)) * 255;
          const b = floor(random(2)) * 255;
          that.stemColor = color(r, g, b);
          that.capColor = color(r, g, b);
          that.strokeColor = -1;
        }
      }
    ];
    
    this.animate(stages, startEvent, endEvent);
  }
  
  draw(graphics) {
    this.scaleMushroom();
    this.drawMushroom(graphics, this.x, this.y);
  }
  
  drawMushroom(graphics, tX, tY) {
    this.drawStem(graphics, tX, tY + this.offsetY);
    this.drawCap( graphics, tX, tY + this.offsetY);
    this.drawMask(graphics, tX, tY);
  }
  
  scaleMushroom() {
    this.stemWidth  = this.cropWidth  * 0.20 * this.scale;
    this.stemHeight = this.cropHeight * 0.35 * this.scale; 
    this.stemOffset = this.cropHeight * this.growthScale * this.scale;
    
    this.capWidth  = this.stemWidth  * 2.0;
    this.capHeight = this.stemHeight * 1.5;
  }

  drawStem(graphics, tX, tY) {
    graphics.push();

    graphics.fill(this.stemColor);
    this.setStroke(graphics);
    graphics.strokeWeight(graphics.width * 0.0025);
    graphics.strokeJoin(ROUND);

    graphics.translate(tX, tY);

    graphics.beginShape();
    for (let i = 0; i < 6; i++) {

      let angle = TWO_PI/6 * i;

      let x = cos(angle) * this.stemWidth;
      let y = sin(angle) * this.stemHeight;

      let offset = 0;
      if (i == 4 || i == 5) {
        offset = this.stemOffset;
      }

      graphics.vertex(x, y - offset);

    }
    graphics.endShape(CLOSE);

    graphics.pop();
  }

  drawCap(graphics, tX, tY) {
    graphics.push();

    graphics.fill(this.capColor);
    this.setStroke(graphics);
    graphics.strokeWeight(graphics.width * 0.0025);
    graphics.strokeJoin(ROUND);

    graphics.translate(tX, tY - (this.stemHeight + this.stemOffset) + this.capHeight/2);

    let x1 = -this.capWidth;
    let y1 = 0;
    let x2 = -this.capWidth/2;
    let y2 = -this.capHeight;
    let x3 =  this.capWidth/2;
    let y3 = -this.capHeight;
    let x4 =  this.capWidth;
    let y4 = 0;

    graphics.quad(x1, y1, x2, y2, x3, y3, x4, y4);

    graphics.pop();
  }
  
  playNote(dur, time) {
    /*
    problem: sealing tone functionality to audio class reduces creative access
    solution: attach unique audio event (like glide event) callbacks to audio class

    for now, mushroom.js maintains access to tone.js functions...
    */

    if (this.picked) return;
    
    let octave = constrain(this.age, 0, this.ripeAge)/this.ripeAge;
    octave = octave * 2 - 1;
    octave = round(octave) * 12;

    const note = game.audio.note(this.note, octave);

    this.synth.portamento = 0;
    this.synth.triggerAttackRelease(note, dur * 0.5, time);
    
    const bendEvent = () => {
      this.synth.portamento = dur * 0.25;
      this.synth.setNote(game.audio.note(note, 12));
    };
    
    game.audio.scheduleAudioEvent(time + dur * 0.25, bendEvent);
  }
}