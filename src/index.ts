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
class Chord {
  input: string;
  romanNumeral: string;
  harmonicFunction: string[];

  constructor(input: string, romanNumeral: string) {
    this.input = input;
    this.romanNumeral = romanNumeral;
    this.harmonicFunction = [];
  }

  addHarmonicFunction(harmonicFunction: string) {
    this.harmonicFunction.push(harmonicFunction);
  }

  getHarmonicFunction() {
    if (this.harmonicFunction.length === 0) { return "?"; }
    return this.harmonicFunction[0];
  }

  analyzeDiatonic(): void {
    // diatonic chords
    // I, ii, iii, IV, V, vi, viio
    // I, iim7, iiim7, IV, V, vim7, viio7
    const diatonicChords = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viio', 'iim7', 'iiim7', 'vim7', 'viio7', 'V7', 'ivm7'];
    if (diatonicChords.includes(this.romanNumeral)) {
      this.addHarmonicFunction(this.romanNumeral);
    }
 }
}

export class ChordRomanAnalyzer {
  private key: string;
  private romanNumerals: string[];
  private scale: string[];
  private options: {
    secondaryDominants: boolean;
  }

  /**
   * RomanAnalyzer constructor
   *
   * @constructor
   */
  constructor() {
    this.romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    this.key = 'C';
    this.scale = [];
    this.options = {secondaryDominants : false};
  }

  setOptions(options: {secondaryDominants: boolean}) : void {
    this.options = options;
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
    this.scale = this.getScale(this.key);
    // console.log('key:', this.key);
    // console.log('scale:', this.scale);
    const analysis = chordStrings.map((chortStr) => this.getRomanNumeral(chortStr));

    analysis.forEach((chord) => {
      chord.analyzeDiatonic();
    });

    if (this.options.secondaryDominants) {
      return this.identifySecondaryDominants(analysis).map((chord) => chord.getHarmonicFunction());
    }

    return analysis.map((chord) => chord.romanNumeral);
  }


  /** For each roman numeral in the array examine if 
   * it is a secondary dominant and replace it with the
   * secondary dominant notation
    */
  private identifySecondaryDominants(chords: Chord[]): Chord[] {
    const secondaryDominantsMap = new Map<string, string>();
    secondaryDominantsMap.set('VI7', 'V7/ii');
    secondaryDominantsMap.set('VII7', 'V7/iii');
    secondaryDominantsMap.set('I7', 'V7/IV');
    secondaryDominantsMap.set('II7', 'V7/V');
    secondaryDominantsMap.set('III7', 'V7/vi');
    secondaryDominantsMap.set('#ivo7', 'iio7/iii');
    secondaryDominantsMap.set('vm7', 'iim7/IV');
    // secondaryDominantsMap.set('viio7', 'iio7/vi');
    secondaryDominantsMap.set('bVII7', 'BD7'); // also V7/bIII
    secondaryDominantsMap.set('bII7', 'TT7'); // also V7/bV
    secondaryDominantsMap.set('bIII7', 'TT7/ii'); // also V7/bVI
    secondaryDominantsMap.set('IV7', 'TT7/iii'); // also V7/bVII
    secondaryDominantsMap.set('bVI7', 'TT7/V'); // also V7/bII
    secondaryDominantsMap.set('bV7', 'TT7/IV'); // also V7/VII (rare?)
    secondaryDominantsMap.set('biiim7', 'TTm7/V');

    return chords.map((chord) => {
      if (secondaryDominantsMap.has(chord.romanNumeral)) {
        chord.addHarmonicFunction(secondaryDominantsMap.get(chord.romanNumeral) || '');
      }
      return chord;
    });
  }

  /**
   * Get the roman numeral representation of a chord
   *
   * @method getRomanNumeral
   * @param {string} inputChord - The chord to analyze
   * @returns {string} The roman numeral representation of the chord
   */
  private getRomanNumeral(inputChord: string): Chord {
    const root = this.getChordRoot(inputChord);
    const quality = this.getChordQuality(inputChord);
    const romanNumeral = this.rootToRomanNumeral(root);
    // console.log('root:', root);
    // console.log('quality:', quality);
    const isMajor = quality === 'maj' || quality === 'maj7' || quality === '7' || quality === '';
    const isMinor7th = quality === 'm7';
    const isDiminished = quality === 'dim7';
    let romanQuality = quality === '7' ? '7' : '';
    if (isDiminished) {
      romanQuality = 'o7';
    }
    if (isMinor7th) {
      romanQuality = 'm7';
    }

    const chord = new Chord(inputChord, (isMajor ? romanNumeral : romanNumeral.toLowerCase()) + romanQuality);
    return chord;
  }

  private rootToRomanNumeral(root: string): string {
    let scaleIndex = this.scale.indexOf(root);
    let index = this.romanNumerals[scaleIndex];
    // if index is not found, try flatting the root and search again
    if (index) return index;

    const flatRoot = this.flatten(root);
    scaleIndex = this.scale.indexOf(flatRoot);
    index = this.romanNumerals[scaleIndex];
    if (index) return '#' + index;

    const sharpRoot = this.sharpen(root);
    scaleIndex = this.scale.indexOf(sharpRoot);
    index = this.romanNumerals[scaleIndex];
    if (index) return 'b' + index;

    return root;
  }

  /**
   * if note is sharp remove the sharp
   * otherwise add a flat
   */
  private flatten(note: string): string {
    return note.includes('#') ? note.slice(0, 1) : note + 'b';
  }

  private sharpen(note: string): string {
    return note.includes('b') ? note.slice(0, 1) : note + '#';
  }

  /**
   * Get the root of a chord
   *
   * @method getChordRoot
   * @param {string} chord - The chord to analyze
   * @returns {string} The root of the chord
   */
  private getChordRoot(chord: string): string {
    const matchResult = chord.match(/[A-G][#b]?/);
    return matchResult ? matchResult[0] : '';
  }

  /**
   * Get the quality of a chord
   *
   * @method getChordQuality
   * @param {string} chord - The chord to analyze
   * @returns {string} The quality of the chord
   */
  private getChordQuality(chord: string): string {
    const matchResult = chord.match(/maj7|m7|dim7|aug7|7|m/);
    // console.log('matchResult:', matchResult);
    return matchResult ? matchResult[0] : '';
  }

  /**
   * Get the scale of a key.
   * Works for major keys only.
   * Works with accidentals.
   *
   * @method getScale
   * @param {string} key - The key to analyze
   * @returns {string[]} The scale of the key
   * @example
   * getScale('C');
   * // returns ['C', 'D', 'E', 'F', 'G', 'A', 'B']
   * @example
   * getScale('F#');
   * // returns ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']
   */

  flattedNotes: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  sharpNotes: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  getScale(key: string): string[] {
    const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
    const scale: string[] = [this.key];

    let notesToUse = this.flattedNotes;

    const isSharpKey = this.sharpNotes.includes(key);
    if (isSharpKey) {
      notesToUse = this.sharpNotes;
    }

    let currentIndex = notesToUse.indexOf(key);

    for (const interval of majorScaleIntervals) {
      currentIndex = (currentIndex + interval) % notesToUse.length;
      scale.push(notesToUse[currentIndex]);
    }

    return scale;
  }
}

// bII is a maj7 chord found in the tonic in the key of bII: I/bII (Dbmaj7 in the key of C)
// and in the key of bVI where it is the IV: IV/bVI (Dbmaj7 is the IV in Ab)

// bII is either I/bII or IV/bVI
// bIII is either I/bIII or IV/bVII
// bV is either I/bV or IV/bII  
// bVI is either I/bVI or IV/bIII
// bVII is either I/bVII or IV/IV

const a = new ChordRomanAnalyzer();
a.setOptions({secondaryDominants: true});
console.log(a.analyze(['Cmaj7', 'Dbmaj7', 'Eb7', 'Abmaj7', 'Gm7', 'C7', 'Fmaj7', 'Fm7', 'Bb7', 'Ebm7', 'Ab7', 'Dm7', 'G7' ], 'C'));
console.log(a.analyze(['Cmaj7', 'Dbmaj7', 'Eb7', 'Gb7', 'F7', 'Ddim7', 'G7', 'Em7', 'A7', 'Dm7', 'G7', 'Cmaj7' ], 'C'));
