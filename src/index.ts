import { Chord } from './chord';
import { getScale } from './scale';

/**
 * RomanAnalyzer class
 *
 * @class RomanAnalyzer
 * @classdesc RomanAnalyzer class to analyze a sequence of chords and determine their roman numeral representation
 * @example
 * const romanAnalyzer = new RomanAnalyzer();
 * romanAnalyzer.analyze(['C', 'G', 'Am', 'F']);
 * // returns ['I', 'V', 'vi', 'IV']
 * @example
 * const romanAnalyzer = new RomanAnalyzer();
 * romanAnalyzer.analyze(['Dm7', 'G7', 'Cmaj7', 'A7'], 'C');
 * // returns ['ii7', 'V7', 'Imaj7', 'V7/ii']
 */

export class ChordRomanAnalyzer {
  private key: string;
  private scale: string[];
  private options: {
    secondaryDominants: boolean;
    allHarmonicFunctions: boolean;
  };

  /**
   * RomanAnalyzer constructor
   *
   * @constructor
   */
  constructor() {
    this.key = 'C';
    this.scale = [];
    this.options = { secondaryDominants: false, allHarmonicFunctions: false };
  }

  setOptions(options: { secondaryDominants: boolean; allHarmonicFunctions: boolean }): void {
    this.options = options;
  }

  setSecondaryDominants(secondaryDominants: boolean): void {
    this.options.secondaryDominants = secondaryDominants;
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
    const analysis = chordStrings.map((chortStr) => new Chord(chortStr, this.scale));

    return analysis.map((chord) => {
      if (this.options.secondaryDominants) {
        if (this.options.allHarmonicFunctions) {
          return chord.input + ' : ' + chord.getHarmonicFunction();
          // return chord.input + '[' + chord.getHarmonicFunctionsSorted().join() + ']'
        }
        return chord.getHarmonicFunction();
      }
      return chord.romanNumeral;
    });
  }
}

const a = new ChordRomanAnalyzer();
a.setOptions({ secondaryDominants: true, allHarmonicFunctions: true });

const youStepped = [
  'Cmaj7',
  'Dbmaj7',
  'Eb7',
  'Abmaj7',
  'Gm7',
  'C7',
  'Fmaj7',
  'Fm7',
  'Bb7',
  'Ebm7',
  'Ab7',
  'Dm7',
  'G7',
  'Cmaj7',
  'Dbmaj7',
  'Eb7',
  'Gb7',
  'F7',
  'Ddim7',
  'G7',
  'Em7',
  'A7',
  'Dm7',
  'G7',
  'Cmaj7',
];

const allTheThingsYouAre = [
  'Fm7',
  'Bbm7',
  'Eb7',
  'Abmaj7',
  'Dbmaj7',
  'G7',
  'Cmaj7',

  'Cm7',
  'Fm7',
  'Bb7',
  'Ebmaj7',
  'Abmaj7',
  'Am7b5',
  'D7',
  'Gmaj7',
  'E7',
  'Am7',
  'D7',
  'Gmaj7',
  'F#m7b5',
  'B7',
  'Emaj7',
  'C7',
  'Fm7',
  'Bbm7',
  'Eb7',
  'Abmaj7',
  'Dbmaj7',
  'Gb7',
  'Cm7',
  'Bdim7',
  'Bbm7',
  'Eb7',
  'Abmaj7',
  'Gm7b5',
  'C7',
];

const iRememberYou = 
  ('Fmaj7 Bm7b5 E7 Fmaj7 Cm7 F7 '
  + 'Bbmaj7 Bbm7 Eb7 Fmaj7 Gm7 C7 '
  + 'Fmaj7 Bm7 E7 Fmaj7 Cm7 F7 '
  + 'Bbmaj7 Bbm7 Eb7 Fmaj7 Cm7 F7 '
  + 'Bbmaj7 Em7 A7 Dmaj7 Em7 A7 '
  + 'Dmaj7 Dm7 G7 Cmaj7 Gm7 C7 '
  + 'Fmaj7 Bm7 E7 Fmaj7 Am7b5 D7 '
  + 'Gm7 Bbm7 Eb7 Am7 D7 ' 
  + 'Gm7 C7 Fmaj7 D7 Gm7 C7').split(' ');

  // console.log(iRememberYou);

// console.log(a.analyze(iRememberYou, 'F'));
// console.log(a.analyze(youStepped, 'C'));
// console.log(a.analyze(allTheThingsYouAre, 'Ab'));
// console.log(a.analyze(['Bm7b5'], 'C'));
// console.log(a.analyze(['Dbmaj7'], 'C'));
// console.log(a.analyze(['Fmaj7'], 'C'));
// a.setOptions({ secondaryDominants: false, allHarmonicFunctions: true });

// console.log(a.analyze(['Cmaj7', 'C#dim7', 'Dm7', 'D#dim7', 'Em7'], 'C'));
// console.log(a.analyze(['Em7', 'Ebdim7', 'Dm7', 'Dbdim7', 'Cmaj7'], 'C'));
