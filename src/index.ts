import { printBars, processBars } from './bars';
import { ChordAnalysis } from './chordAnalysis';
import { Chord } from './chord';
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
      (chortStr) => new ChordAnalysis(new Chord(chortStr), this.scale),
    );

    if (this.options.showAnalysis) {
      chords.forEach((chord) => {
        chord.showFunctions();
      });
      chords.forEach((chord) => {
        console.log(chord.chord.input);
        console.log(chord.harmonicFunctions);
      });
    }

    this.updateWeights(chords);
    this.agreeOnII_Vs(chords);

    if (this.options.showAnalysis) {
      chords.forEach((chord) => {
        chord.showFunctions();
      });
      chords.forEach((chord) => {
        console.log(chord.chord.input);
        console.log(chord.harmonicFunctions);
      });
    }

    return chords.map((chord) => {
      if (this.options.showFunctions) {
        if (this.options.allHarmonicFunctions) {
          return (
            (this.options.showOriginalChords ? chord.chord.input + ' : ' : '') +
            chord.getHighestHarmonicFunctions().join()
          );
          // return chord.input + '[' + chord.getHarmonicFunctionsSorted().join() + ']'
          // return chord.getHighestHarmonicFunctions().join()
        }
        return chord.getBestHarmonicFunctionStr();
      }
      return chord.chord.romanNumeral;
    });
  }

  private updateWeights(chords: ChordAnalysis[]): void {
    for (let i = 0; i < chords.length; i++) {
      const previous = i === 0 ? null : chords[i - 1];
      const next = i === chords.length - 1 ? null : chords[i + 1];

      chords[i].updateWeights(previous, next);
    }
  }

  private agreeOnII_Vs(chords: ChordAnalysis[]): void {
    for (let i = 0; i < chords.length; i++) {
      const current = chords[i];
      const previous = i === 0 ? null : chords[i - 1];
        if (
          previous &&
          previous.chord.isMinor &&
          current.chord.isDominant7
        ) {
          previous.updateIIwithNextV(current);
        }
    }
  }

  analyzeBars(input: string, key: string): string {
    const chordsInBars = processBars(input);
    // console.log(chords);
    const chordsStrings = chordsInBars.map((chord) => chord.chord);
    // console.log(chordsStrings);
    const analyzedChords = this.analyze(chordsStrings, key);
    // console.log(analyzedChords);
    for (let i = 0; i < chordsInBars.length; i++) {
      chordsInBars[i].analyzedChord = analyzedChords[i];
    }
    return printBars(chordsInBars, 4, this.options.showOriginalChords);
  }
}

const a = new ChordRomanAnalyzer()
  .showFunctions(true)
  .showOriginalChords(true)
  .showAllHarmonicFunctions(false)
  .showAnalysis(true);

// console.log(a.analyzeBars(std.girlFromIpanemaBars, 'F')); // problems in B section
// console.log(a.analyzeBars(std.yourSteppedBars1, 'C'));
// console.log(a.analyzeBars(std.iRememberYouBars, 'F'));
// console.log(a.analyzeBars(std.stellaByStarlightBars, 'Bb'));
console.log(a.analyzeBars(std.illRememberAprilBars, 'G'));
// console.log(a.analyzeBars(std.allTheThingsYouAreBars, 'Ab'));
// console.log(a.analyzeBars(std.theDaysOfWineAndRosesBars, 'F'));
// console.log(a.analyzeBars(std.allOfMeBars, 'C'));
// console.log(a.analyzeBars(std.afternoonInParisBars, 'C'));
// console.log(a.analyzeBars(std.butBeautifulBars, 'G'));
// console.log(a.analyzeBars(std.haveYouMetMissJonesBars, 'G'));
// console.log(a.analyzeBars(std.someDayMyPrinceWillComeBars, 'Bb'));
// console.log(a.analyzeBars('|D D7 | G Bb | D', 'D'));
