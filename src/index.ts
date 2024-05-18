import { printBars, processBars } from './bars';
import { Chord } from './chord';
import { ChordName } from './chordName';
import { getScale } from './scale';

export class ChordRomanAnalyzer {
  private key: string;
  private scale: string[];
  private options: {
    showAnalysis: boolean;
    showFunctions: boolean;
    allHarmonicFunctions: boolean;
    showOriginalChords: boolean;
  };

  constructor() {
    this.key = 'C';
    this.scale = [];
    this.options = {
      showFunctions: false,
      allHarmonicFunctions: false,
      showOriginalChords: false,
      showAnalysis: false,
    };
  }

  showFunctions(secondaryDominants: boolean): ChordRomanAnalyzer {
    this.options.showFunctions = secondaryDominants;
    return this;
  }

  showOriginalChords(showOriginalChords: boolean): ChordRomanAnalyzer {
    this.options.showOriginalChords = showOriginalChords;
    return this;
  }

  showAllHarmonicFunctions(allHarmonicFunctions: boolean): ChordRomanAnalyzer {
    this.options.allHarmonicFunctions = allHarmonicFunctions;
    return this;
  }

  showAnalysis(showAnalysis: boolean): ChordRomanAnalyzer {
    this.options.showAnalysis = showAnalysis;
    return this;
  }

  /**
   * Analyze a sequence of chords and determine their roman numeral representation
   *
   * @method analyze
   * @param {string[]} chordStrings - The sequence of chords to analyze
   * @param {string} key - The key of the sequence of chords
   * @returns {string[]} The roman numeral representation of the sequence of chords
   */
  analyze(chordStrings: string[], key: string): string[] {
    this.key = key;
    this.scale = getScale(this.key);
    const chords = chordStrings.map(
      (chortStr) => new Chord(new ChordName(chortStr), this.scale),
    );

    if (this.options.showAnalysis) {
      chords.forEach((chord) => {
        chord.showFunctions();
      });
    }

    chords.forEach((chord) => {
      console.log(chord.chordName.input);
      console.log(chord.harmonicFunctions);
    });

    this.updateWeights(chords);
    this.updateWeights(chords, true);

    if (this.options.showAnalysis) {
      chords.forEach((chord) => {
        chord.showFunctions();
      });
    }

    chords.forEach((chord) => {
      console.log(chord.chordName.input);
      console.log(chord.harmonicFunctions);
    });

    return chords.map((chord) => {
      if (this.options.showFunctions) {
        if (this.options.allHarmonicFunctions) {
          return (
            (this.options.showOriginalChords
              ? chord.chordName.input + ' : '
              : '') + chord.getHighestHarmonicFunctions().join()
          );
          // return chord.input + '[' + chord.getHarmonicFunctionsSorted().join() + ']'
          // return chord.getHighestHarmonicFunctions().join()
        }
        return chord.getHarmonicFunction();
      }
      return chord.chordName.romanNumeral;
    });
  }

  private updateWeights(chords: Chord[], secondPass = false): void {
    for (let i = 0; i < chords.length; i++) {
      const previous = i === 0 ? null : chords[i - 1];
      const next = i === chords.length - 1 ? null : chords[i + 1];
      if (secondPass) {
        chords[i].updateWeights2(previous, next);
      } else {
        chords[i].updateWeights(previous, next);
      }
    }
  }

  analyzeBars(input: string, key: string): string {
    const chords = processBars(input);
    // console.log(chords);
    const chordsStrings = chords.map((chord) => chord.chord);
    // console.log(chordsStrings);
    const analyzedChords = this.analyze(chordsStrings, key);
    // console.log(analyzedChords);
    for (let i = 0; i < chords.length; i++) {
      chords[i].analyzedChord = analyzedChords[i];
    }
    return printBars(chords, 4, this.options.showOriginalChords);
  }
}

const a = new ChordRomanAnalyzer()
  .showFunctions(true)
  .showOriginalChords(true)
  .showAllHarmonicFunctions(false)
  .showAnalysis(true);

// console.log(a.printBars(a.processBars('|Cmaj7  |Am7 D7|Gm7 C7|Fmaj7|', 'C')));
export const yourSteppedBars =
  '| Cmaj7 |     | Dbmaj7   |        ' +
  '| Eb7   |     | Abmaj7   |        ' +
  '| Gm7   | C7  | Fmaj7    |        ' +
  '| Fm7   | Bb7 | Ebm7 Ab7 | Dm7 G7 ' +
  '| Cmaj7 |     | Dbmaj7   |        ' +
  '| Eb7   |     | Gb7      | F7     ' +
  '| Dm7b5 | G7  | Em7      | A7     ' +
  '| Dm7   | G7  | Cmaj7    | Dm7 G7 ';

export const yourSteppedBars1 =
  '| Cmaj7 |     | Dbmaj7   |        ' +
  '| Eb7   |     | Abmaj7   |        ' +
  '| Gm7   | C7  | Fmaj7    |        ' +
  '| Am7   | D7  | Ebm7 Ab7 | Dm7 G7 ' +
  '| Cmaj7 |     | Dbmaj7   |        ' +
  '| Eb7   |     | Gb7      | F7     ' +
  '| Dm7b5 | G7  | Em7      | A7     ' +
  '| Dm7   | G7  | Cmaj7    | Dm7 G7 ';

const allTheThingsYouAreBars =
  '| Fm7  | Bbm7 | Eb7    | Abmaj7   | Dbmaj7 | G7       | Cmaj7 |       ' +
  '| Cm7  | Fm7  | Bb7    | Ebmaj7   | Abmaj7 | Am7b5 D7 | Gmaj7 | E7    ' +
  '| Am7  | D7   | Gmaj7  |          | F#m7b5 | B7       | Emaj7 | C7    ' +
  '| Fm7  | Bbm7 | Eb7    | Abmaj7   | Dbmaj7 | Gb7      | Cm7   | Bdim7 ' +
  '| Bbm7 | Eb7  | Abmaj7 | Gm7b5 C7 ';

const iRememberYouBars =
  '| Fmaj7   | Bm7b5 E7 | Fmaj7    | Cm7 F7 ' +
  '| Bbmaj7  | Bbm7 Eb7 | Fmaj7    | Gm7 C7 ' +
  '| Fmaj7   | Bm7b5 E7 | Fmaj7    | Cm7 F7 ' +
  '| Bbmaj7  | Bbm7 Eb7 | Fmaj7    | Cm7 F7 ' +
  '| Bbmaj7  | Em7 A7   | Dmaj7    | Em7 A7 ' +
  '| Dmaj7   | Dm7 G7   | Cmaj7    | Gm7 C7 ' +
  '| Fmaj7   | Bm7b5 E7 | Fmaj7    | Am7b5 D7 ' +
  '| Gm7     | Bbm7 Eb7 | Am7      | D7 ' +
  '| Gm7     | C7       | Fmaj7 D7 | Gm7 C7 ';

export const stellaByStarlightBars =
  '| Em7b5  | A7       | Cm7    | F7 ' +
  '| Fm7    | Bb7      | Ebmaj7 | Ab7 ' +
  '| Bbmaj7 | Em7b5 A7 | Dm7    | Bbm7 Eb7 ' +
  '| Fmaj7  | Em7b5 A7 | Am7b5  | D7' +
  '| G7     |          | Cm7    | ' +
  '| Ab7    |          | Bbmaj7 | ' +
  '| Em7b5  | A7       | Dm7b5  | G7 ' +
  '| Cm7b5  | F7       | Bbmaj7 | ';

const illRememberAprilBars =
  '| Gmaj7  |    |        | ' +
  '| Gm7    |    |        | ' +
  '| Am7b5  | D7 | Bm7b5  | E7 ' +
  '| Am7    | D7 | Gmaj7  | G7  ' +
  '| Cm7    | F7 | Bbmaj7 | Gm7 ' +
  '| Cm7    | F7 | Bbmaj7 |  ' +
  '| Am7    | D7 | Gmaj7  |  ' +
  '| F#m7b5 | B7 | Emaj7  | Am7 D7 ' +
  '| Gmaj7  |    |        | ' +
  '| Gm7    |    |        | ' +
  '| Am7b5  | D7 | Bm7b5  | E7 ' +
  '| Am7    | D7 | Gmaj7  | Am7 D7  ';

const girlFromIpanemaBars =
  '| Fmaj7 | Fmaj7 | G7 | G7' +
  '| Gm7 | Gb7 | Fmaj7 | Gb7 ' +
  '| Fmaj7 | Fmaj7 | G7 | G7' +
  '| Gm7 | Gb7 | Fmaj7 |  ' +
  '| Gbmaj7 |  | B7 | ' +
  '| F#m7 | | D7 | ' +
  '| Gm7 | | Eb7 | ' +
  '| Am7 | D7 | Gm7 | C7 ' +
  '| Fmaj7 | Fmaj7 | G7 | G7' +
  '| Gm7 | Gb7 | Fmaj7 | Gb7 ';

// console.log(a.analyzeBars(girlFromIpanemaBars, 'F'));

// console.log(a.analyzeBars(yourSteppedBars1, 'C'));
// console.log(a.analyzeBars(iRememberYouBars, 'F'));
// console.log(a.analyzeBars(stellaByStarlightBars, 'Bb'));
// console.log(a.analyzeBars(illRememberAprilBars, 'G'));
console.log(a.analyzeBars(allTheThingsYouAreBars, 'Ab'));
