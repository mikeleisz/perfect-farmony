const progression = audioDefaults.progression;

class Sequencer {
  constructor(grid) {
    this.grid = grid;
    this.step = 0;
    this.displayStep = 0;
    this.page = 0;
    this.progression = progression;
    this.notes = this.progression[0];
    
    this.playing = true;
  }

  gatherActiveNotes(step) {
    const activeCells = [];
    for (let y = 0; y < this.grid.rows; y++) {
      const cell = this.grid.getCell(step, y);
      if (cell.active) {
        activeCells.push(cell);
      }
    }
    return activeCells;
  }

  getNote(y) {
    return this.notes[(this.grid.rows - 1) - y];
  }

  transposeNotes(notes) {
    this.notes = this.progression[this.page];
    
    for (let x = 0; x < this.grid.cols; x++) {
      for (let y = 0; y < this.grid.rows; y++) {
        
        let cell = this.grid.getCell(x, y);
        if (!cell.active) continue;
        
        let note = this.getNote(y);
        cell.crop.setNote(note);
      }
    }
  }

  playSequencedNotes(time) {
    const activeCells = this.gatherActiveNotes(this.step);
      
    let t = time;
    for (let i = 0; i < activeCells.length; i++) {
  
      let index = i;
      if (this.step % 2 == 0) {
        index = activeCells.length - 1 - i;
      }
  
      const crop = activeCells[index].crop;
      if (crop.isBusy) continue;
  
      const beat = game.audio.beat()/activeCells.length;
      crop.playNote(beat * 0.5, t);
  
      const updateEvent = () => {
        crop.sequencerUpdate();
      };
      
      game.audio.scheduleGameEvent(t, updateEvent);

      t += beat;
    }
  }

  update() {
    this.step++;
    if (this.step >= this.grid.cols) {
      this.step = 0;
  
      this.page++;
      if (this.page >= progression.length) {
        this.page = 0;
      }
  
      this.transposeNotes();
    }
  }

  updateDisplay() {
    this.displayStep = this.step - 1;
    if (this.displayStep < 0) this.displayStep += this.grid.cols;
  }

  draw(graphics) {
    const grid = game.grid;
    
    for (let y = 0; y < grid.rows; y++) {
      const x = this.displayStep;
      
      drawCell(graphics,
               grid.cellToScreenX(x, y), 
               grid.cellToScreenY(x, y), 
               color(255, 255, 0), 
               color(32));
    }
  }
}