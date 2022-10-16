class Audio {
  constructor(params) {
    this.bpm = params.bpm;

    this.sequencers = [];
    this.started = false;

    this.out = new Tone.Channel({ volume: -6 }).toDestination();
    this.reverb = new Tone.Reverb(3).toDestination();
    this.out.connect(this.reverb);
  }

  init(grid) {
    this.createSequencer(grid);
  }

  start() {  
    promiseState(Tone.start()).then(state => {
      if (state == "pending") {
        print("Starting BeatFarmer Audio...");
        this.started = true;
        this.scheduleSequencerEvents();
      } 
    });
  }
  
  scheduleSequencerEvents() {
    Tone.Transport.bpm.value = this.bpm;
    Tone.Transport.scheduleRepeat((time) => {

      this.sequencers.forEach((s) => {
        s.playSequencedNotes(time);
        
        this.scheduleGameEvent(time, () => {
          s.updateDisplay();
        });
        
        s.update();
      });
    }, "8n");

    Tone.Transport.start();
  }

  getSequencer() {
    return this.sequencers[0];
  }
  
  createSequencer(grid) {
    const s = new Sequencer(grid);
    this.sequencers.push(s);
    return s;
  }
  
  createSynth() {
    return new Tone.Synth().connect(this.out);
  }

  playSynth(synth, note, dur, time) {
    synth.triggerAttackRelease(note, dur * 0.5, time);
  }

  note(n, t = 0) {
    return Tone.Frequency(n).transpose(t);
  }

  beat() {
    return Tone.Time("8n");
  }

  now() {
    return Tone.now();
  }

  scheduleAudioEvent(time, transportEvent = () => {}) {
    Tone.Transport.scheduleOnce((time) => {  
      transportEvent();
    }, time);
  }
  
  scheduleGameEvent(time, transportEvent = () => {}) {
    Tone.Draw.schedule((time) => {
      transportEvent();
    }, time);
  }

  scheduleDestroy(instrument) {
    instrument.onSilenceCallback = () => {
      instrument.dispose();
    }
  }
}