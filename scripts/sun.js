/*
Sun Entity
not yet implemented
use as a button for global transport control
*/

class Sun extends Entity {
    constructor(x, y) {
        super(x, y);
    }

    display(graphics) {
        graphics.push();

        graphics.translate(this.x, this.y);
        let orbit = -game.time/10;

        graphics.fill(255, 255, 0);
        graphics.stroke(255);
        graphics.strokeCap(PROJECT);
        graphics.strokeWeight(game.width * 0.0025);

        graphics.beginShape();
        for (let i = 0; i < 32; i++) {
            let a = TWO_PI/32 * i - orbit;

            const x = cos(a) * (game.width/16);
            const y = sin(a) * (game.width/16);

            graphics.push();
            const x2 = x + (game.width/16) * (sin(game.time + i*2) * 0.25 + 0.5) * cos(a);
            const y2 = y + (game.width/16) * (sin(game.time + i*2) * 0.25 + 0.5) * sin(a);
            graphics.line(x, y, x2, y2);
            graphics.pop();

            graphics.vertex(x, y);
        }
        graphics.endShape(CLOSE);

        graphics.pop();
    }
}