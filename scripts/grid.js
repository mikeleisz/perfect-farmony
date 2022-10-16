class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];
  }

  init() {
    this.generateGrid();
    return this;
  }
  
  createCell(x, y) {
    return new Cell(x, y);
  }
  
  checkIfCellIsActive(x, y) {
    return this.getCell(x, y).active;
  }

  getCell(x, y) {
    return this.cells[x + y * this.cols];
  }
  
  getDimensions() {
    return [this.cols, this.rows];
  }

  generateGrid() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const cX = this.cellToScreenX(x, y);
        const cY = this.cellToScreenY(x, y);
        this.cells.push(this.createCell(this, cX, cY));
      }
    }
  }
  
  cellExists(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
    return this.getCell(x, y);
  }

  cellToScreenX(cX, cY) {
      const offsetX = game.width*0.5;
      return ((cX - cY) * (game.cellWidth * 0.5)) + offsetX;
  }

  cellToScreenY(cX, cY) {
      const offsetY = game.height*0.4;
      return ((cX + cY) * (game.cellHeight * 0.5)) + offsetY;
  }

  screenToCellX(sX, sY) {
      const offsetX = game.width*0.5;
      const offsetY = game.height*0.4
      sX -= offsetX;
      sY -= offsetY;
      return floor(sX / game.cellWidth + sY / game.cellHeight);
  }

  screenToCellY(sX, sY) {
      const offsetX = game.width*0.5;
      const offsetY = game.height*0.4;
      sX -= offsetX;
      sY -= offsetY;
      return floor(sY / game.cellHeight - sX / game.cellWidth);
  }

  draw(graphics) {
    for (var x = 0; x < this.cols; x++) {
      for (var y = 0; y < this.rows; y++) {
        
        var cX = this.cellToScreenX(x, y);
        var cY = this.cellToScreenY(x, y);
        
        drawCell(graphics, cX, cY);
      }
    }
  }

  update() {
    this.updateCells();
  }

  updateCells() {
    for (var x = 0; x < this.cols; x++) {
      for (var y = 0; y < this.rows; y++) {
      
        let cell = this.getCell(x, y);
        if (!cell.active) continue;
        
        cell.update();
      }
    }
  }
}

class Cell {
  constructor(grid, x, y) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.active = false;
    this.note = -1;
    this.crop = null;
  }

  removeCrop() {
    if (this.crop == null) return;
    game.audio.scheduleDestroy(this.crop.synth);
    this.crop = null;
    this.active = false;
  }

  addCrop(crop) {
    if (this.active) return;
    this.active = true;
    this.crop = crop;
  }

  plantCrop(cX, cY, CropType = Mushroom) {
    //need a way to enforce a global sequence 
    const note = game.audio.getSequencer().getNote(cY);

    const cropX = this.grid.cellToScreenX(cX, cY);
    const cropY = this.grid.cellToScreenY(cX, cY);

    const crop = new CropType(cropX, cropY, note);
    crop.playNote(game.audio.beat(), game.audio.now());
    this.addCrop(crop);
  }

  pickCrop() {
    this.crop.pickCrop();
  }

  interact(cX, cY) {
    if (!this.active) {
      this.plantCrop(cX, cY);
    } else {
      this.pickCrop();
    }
  }

  update() {
    this.crop.update();
    if (this.crop.destroyed) {
      this.removeCrop();
    }
  }
}