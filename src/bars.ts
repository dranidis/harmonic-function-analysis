import * as fs from 'fs';
class ChordInBar {
  chord: string;
  analyzedChord = '';
  bar: number;
  degree: number;

  constructor(chord: string, bar: number, degree: number) {
    this.chord = chord;
    this.bar = bar;
    this.degree = degree;
  }
}

export function processBars(input: string): ChordInBar[] {
  const chords: ChordInBar[] = [];
  // replace a '|' followed by whitespaces and changes of line and whitespaces and a '|' by a single '|'
  input = input.replace(/\|\s*\n\s*\|\s*/g, '|'); //
  
  let bars = input.split('|');
  bars = bars.slice(1);
  for (let bIndex = 0; bIndex < bars.length; bIndex++) {
    const bar = bars[bIndex].trim();
    const chordsInBar = bar.split(' ').map((chord) => chord.trim());
    for (let cIndex = 0; cIndex < chordsInBar.length; cIndex++) {
      if (chordsInBar[cIndex] === '') {
        continue;
      }
      const chordInBar = new ChordInBar(chordsInBar[cIndex], bIndex, cIndex);
      chords.push(chordInBar);
    }
  }
  return chords;
}

export function printBars(
  chords: ChordInBar[],
  changeOfLineEveryBars = 4,
  showOriginalChords = false,
): string {
  const bars: string[] = [];
  let barCount = 0;
  let currentBar = '|';

  for (let i = 0; i < chords.length; i++) {
    const chord = chords[i];
    // console.log(chord)
    while (chord.bar != barCount) {
      bars.push(currentBar);
      currentBar = '|';
      barCount++;
    }

    // if the next chord is in the same bar and in the same key
    // print the two harmonic functions together
    if (i + 1 < chords.length && chords[i + 1].bar === chord.bar) {
      const chord1 =
        (showOriginalChords ? chord.chord + ': ' : '') + chord.analyzedChord;
      const chord2 =
        (showOriginalChords ? chords[i + 1].chord + ':' : '') +
        chords[i + 1].analyzedChord;
      // check if they share the same '/...' suffix
      const key = chord1.split('/')[1];
      if (key && key === chord2.split('/')[1]) {
        currentBar +=
          ' ' + chord1.split('/')[0] + '-' + chord2.split('/')[0] + '/' + key;
        i++;
      } else {
        currentBar += ' ' + chord1;
      }
    } else {
      currentBar +=
        ' ' +
        (showOriginalChords ? chord.chord + ': ' : '') +
        chord.analyzedChord;
    }
  }
  bars.push(currentBar);

  const maxBarLength = bars.reduce((max, bar) => Math.max(max, bar.length), 0);
  let output = '';
  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    output += bar.padEnd(maxBarLength);
    if (i % changeOfLineEveryBars === changeOfLineEveryBars - 1) {
      output += '|\n';
    }
  }
  return output;
}

export function readChordsFromFile(filename: string): string {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return data;
    } catch (err) {
        console.error(err);
        return '';
    }
}
