class SoundEntity extends Entity {
    constructor(x, y, note) {
        super(x, y);
        this.note = note;
        this.synth = game.audio.createSynth();
    }

    playNote(dur, time) {
        game.audio.playSynth(this.synth, this.note, dur * 0.5, time);
    }
}