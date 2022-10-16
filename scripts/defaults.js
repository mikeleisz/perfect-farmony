const gameDefaults = {
    width: 800,
    height: 800,
    gridCols: 8,
    gridRows: 8,
    cellWidth: 80
  }

  const MUSICAL_SCALES = {
    E_MINOR : [ "E3", "F#3",  "G3",  "A3",  "B3",  "C4",  "D4",  "E4"],
    A_MINOR : [ "A3",  "B3",  "C4",  "D4",  "E4",  "F4",  "G4",  "A4"],
    D_MINOR : [ "D3",  "E3",  "F3",  "G3",  "A3", "A#3",  "C4",  "D4"],
    C_MAJOR : [ "C3",  "D3",  "E3" , "F3",  "G3",  "A3",  "B3",  "C4"],
    F_MAJOR : [ "F3",  "G3",  "A3" , "A#3", "C4",  "D4",  "E4",  "F4"],
    G_MAJOR : [ "G3",  "A3",  "B3" , "C4",  "D4",  "E4",  "F#4", "G4"]
  }
  
  const audioDefaults = {
    bpm: 80,
    progression : [MUSICAL_SCALES.F_MAJOR, MUSICAL_SCALES.G_MAJOR, MUSICAL_SCALES.E_MINOR, MUSICAL_SCALES.A_MINOR]
  }

  const DEFAULTS = {
    GAME : gameDefaults,
    AUDIO : audioDefaults
  }