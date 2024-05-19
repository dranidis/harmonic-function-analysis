import { printBars, processBars } from './bars';
import { Chord } from './chord';
import { ChordName } from './chordName';
import { std } from './examples';
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
      chords.forEach((chord) => {
        console.log(chord.chordName.input);
        console.log(chord.harmonicFunctions);
      });
    }



    this.updateWeights(chords);
    this.updateWeights(chords, true);

    if (this.options.showAnalysis) {
      chords.forEach((chord) => {
        chord.showFunctions();
      });
      chords.forEach((chord) => {
        console.log(chord.chordName.input);
        console.log(chord.harmonicFunctions);
      });
    }

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
  .showAnalysis(false);

// console.log(a.analyzeBars(std.girlFromIpanemaBars, 'F'));
// console.log(a.analyzeBars(std.yourSteppedBars1, 'C'));
// console.log(a.analyzeBars(std.iRememberYouBars, 'F'));
// console.log(a.analyzeBars(std.stellaByStarlightBars, 'Bb'));
// console.log(a.analyzeBars(std.illRememberAprilBars, 'G'));
// console.log(a.analyzeBars(std.allTheThingsYouAreBars, 'Ab'));
console.log(a.analyzeBars('|D D7 | G Bb | D', 'D'));
