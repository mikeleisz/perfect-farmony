class Game {
  constructor(params) {
    this.width = params.width;
    this.height = params.height;
    this.cellWidth = params.cellWidth;
    this.cellHeight = params.cellWidth * 0.5;

    this.renderer = new Renderer(this.width, this.height);
    this.grid = new Grid(params.gridCols, params.gridRows);
    this.audio = new Audio(DEFAULTS.AUDIO);
  }
  
  init() {
    this.grid.init();
    this.audio.init(game.grid);
    this.renderer.init();
  }
  
  update() {
    this.time  = frameCount/60;
    this.delta = 1.0/(frameRate() <= 0 ? 60 : frameRate());
    if (this.audio.started) this.grid.update();
  }
  
  render() {
    this.renderer.render(this.renderer.canvas);
    if (!this.audio.started) this.renderer.drawMouseRequest();
  }

  //placeholder for a function that will retrieve current working grid
  getActiveGrid() {
    return this.grid;
  }
}

const game = new Game(DEFAULTS.GAME);