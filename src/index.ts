import { printBars, processBars, readChordsFromFile } from './bars';
import { ChordAnalysis } from './chordAnalysis';
import { Chord } from './chord';
import { standards } from './examples';
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
    this.identifyChangeOfKey(chords);

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
      if (previous && previous.chord.isMinor && current.chord.isDominant7) {
        previous.updateIIwithNextV(current);
      }
    }
  }

  private identifyChangeOfKey(chords: ChordAnalysis[]): void {
    for (let i = 0; i < chords.length; i++) {
      const current = chords[i];
      const previous = i === 0 ? null : chords[i - 1];
      const next: ChordAnalysis | null =
        i === chords.length - 1 ? null : chords[i + 1];
      if (previous && next) {
        current.updateKeyChanges(previous, next);
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
  .showOriginalChords(false)
  .showAllHarmonicFunctions(false)
  .showAnalysis(true);

// console.log(a.analyzeBars(standards.girlFromIpanemaBars, 'F')); // problems in B section
// console.log(a.analyzeBars(standards.yourSteppedBars1, 'C'));
// console.log(a.analyzeBars(standards.iRememberYouBars, 'F'));
// console.log(a.analyzeBars(standards.stellaByStarlightBars, 'Bb'));
// console.log(a.analyzeBars(standards.illRememberAprilBars, 'G'));
// console.log(a.analyzeBars(standards.allTheThingsYouAreBars, 'Ab'));
// console.log(a.analyzeBars(standards.theDaysOfWineAndRosesBars, 'F'));
// console.log(a.analyzeBars(standards.allOfMeBars, 'C'));
// console.log(a.analyzeBars(standards.afternoonInParisBars, 'C'));
// console.log(a.analyzeBars(standards.butBeautifulBars, 'G'));
// console.log(a.analyzeBars(standards.haveYouMetMissJonesBars, 'G'));
// console.log(a.analyzeBars(standards.someDayMyPrinceWillComeBars, 'Bb'));
// console.log(a.analyzeBars(standards.howInsensitiveBars, 'Bb'));
// console.log(a.analyzeBars('|D D7 | G Bb | D', 'D'));

// console.log(a.analyzeBars(readChordsFromFile('src/examples/standards/WhatIsThisThingCalledLove.txt'), 'C'));
// console.log(a.analyzeBars(readChordsFromFile('src/examples/standards/SomedayMyPrinceWillCome.txt'), 'Bb'));
console.log(
  a.analyzeBars(
    readChordsFromFile('src/examples/standards/EasyLiving.txt'),
    'F',
  ),
);
