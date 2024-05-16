const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const allRomanNumerals = ['I', 'bII', 'II', 'bIII', 'III', 'IV', 'bV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
const allShaprRomanNumerals = ['I', '#I', 'II', '#II', 'III', 'IV', '#IV', 'V', '#V', 'VI', '#VI', 'VII'];
const keyCircle = ['I', 'IV', 'V', 'bVII', 'II', 'bIII', 'VI', 'bVI', 'III', 'bII', 'VII', 'bV']; 
const minorkeyCircle = ['vi', 'ii', 'iii', 'v', 'vii', 'i', 'bv', 'iv', 'bii', 'bvii', 'bvi', 'biii']; 

const KEY_WEIGHT_DIVIDER = 20;
const MINOR_KEY_WEIGHT_SUBTRACT = 0.00;

enum Quality {
  maj7,
  dom7,
  m7,
  m7b5,
  o7,
}

function qualityToString(quality: Quality): string {
  switch (quality) {
    case Quality.maj7:
      return '';
    case Quality.dom7:
      return '7';
    case Quality.m7:
      return 'm7';
    case Quality.m7b5:
      return 'm7b5';
    case Quality.o7:
      return 'o7';
  }
}

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
      throw new Error(msg)
  }
}

export class Chord {
  input: string;
  romanNumeral = '';
  harmonicFunctions: string[];
  weights: number[];
  root = '';
  scale: string[];
  quality: Quality = Quality.maj7;
  scaleIndex = 0;

  constructor(input: string, scale: string[]) {
    this.input = input;
    this.scale = scale;
    this.getRomanNumeral();
    this.harmonicFunctions = [];
    this.weights = [];
    this.analyzeRomanQuality();
  }

  // return the harmonic functions sorted by their weight
  private getHarmonicFunctionsSorted(): string[] {
    const functions = this.harmonicFunctions;
    const weights = this.weights;
    const sortedFunctions = functions.sort((a, b) => {
      const aIndex = functions.indexOf(a);
      const bIndex = functions.indexOf(b);
      return weights[bIndex] - weights[aIndex];
    });
    return sortedFunctions;
  }

  private newkey(scaleDistance: number) : string {
    let index = (this.scaleIndex + scaleDistance) % 12;
    while (index < 0) {
      index += 12;
    }
    // console.log('index', index);
    return allRomanNumerals[index];
  }

  private keyString(key: string): string {
    return key === 'I' ? '' : '/' + key;
  }

  private keyDistance(key:string): number {
    // console.log('keyDistance: key', key, 'keyCircle.indexOf(key)', keyCircle.indexOf(key));
    return 1 - keyCircle.indexOf(key) / KEY_WEIGHT_DIVIDER;
  }

  private addHarmonicFunctionHelper(keyStr: string, scaleDistance: number) {
    const key = this.newkey(scaleDistance);
    const keyDist = this.keyDistance(key);
    // console.log('key', key, 'keyDist', keyDist);
    this.addHarmonicFunction(keyStr + this.keyString(key), keyDist);    
  }

  private addMinorHarmonicFunctionHelper(keyStr: string, scaleDistance: number) {
    const key = this.newkey(scaleDistance);
    const minorKey = key.toLowerCase();
    assert(minorkeyCircle.indexOf(minorKey) >= 0 , `minorKey ${minorKey} not found`)
    const minorKeyDist = 1 - minorkeyCircle.indexOf(minorKey) / KEY_WEIGHT_DIVIDER - MINOR_KEY_WEIGHT_SUBTRACT;
    // console.log('min key', minorKey, 'minorKeyDist', minorKeyDist);
    this.addHarmonicFunction(keyStr + this.keyString(minorKey), minorKeyDist);
  }

  private analyzeRomanQuality() : void {
    assert(this.scaleIndex >= 0 && this.scaleIndex < 12, 
      `${this.input} ${this.romanNumeral} scaleIndex ${this.scaleIndex} out of range`);

    // maj7
    if (this.quality === Quality.maj7) {
      this.addHarmonicFunctionHelper('IV', 7);
      this.addHarmonicFunctionHelper('I', 0);
    }

    if (this.quality === Quality.dom7) {
      this.addHarmonicFunctionHelper('V7', -7);
      this.addMinorHarmonicFunctionHelper('V7', -7);
      this.addHarmonicFunctionHelper('BD7', +2);
      this.addHarmonicFunctionHelper('TT7', -1);
      this.addMinorHarmonicFunctionHelper('TT7', -1);
    }

    if (this.quality === Quality.m7) {
      this.addHarmonicFunctionHelper('iim7', -2);
      this.addHarmonicFunctionHelper('iiim7', -4);
      this.addHarmonicFunctionHelper('vim7', -9);
      this.addHarmonicFunctionHelper('ivm7', -5);
      this.addHarmonicFunctionHelper('TTm7', -8);
    }

    if (this.quality === Quality.m7b5) {
      this.addMinorHarmonicFunctionHelper('iim7b5', -2); // minor
      this.addHarmonicFunctionHelper('viim7b5', 1);
    }

    if (this.quality === Quality.o7) {
      this.addMinorHarmonicFunctionHelper('viio7', 1);
      this.addMinorHarmonicFunctionHelper('viio7', -2);
      this.addMinorHarmonicFunctionHelper('viio7', -5);
      this.addMinorHarmonicFunctionHelper('viio7', -8);  
    }

    // console.log(this.scaleIndex);
    console.log(this.input, this.harmonicFunctions);
    console.log(this.weights);
  }

  /**
   * Get the roman numeral representation of a chord
   *
   * @method getRomanNumeral
   * @param {string} inputChord - The chord to analyze
   * @returns {string} The roman numeral representation of the chord
   */
  private getRomanNumeral(): void {
    this.root = this.getChordRoot();
    if (this.root === '') {
      throw new Error('Invalid chord: ' + this.input);
    }

    const quality = this.getChordQuality();
    const rootRomanNumeral = this.rootToRomanNumeral();
    // console.log('root:', this.root);
    // console.log('quality:', quality);
    // console.log('rootRomanNumeral:', rootRomanNumeral);
    const isMajor = quality === 'maj' || quality === 'maj7' || quality === '7' || quality === '';
    const isMinor7th = quality === 'm7';
    const isDiminished = quality === 'dim7';
    const isHalfDiminished = quality === 'm7b5';

    this.quality = quality === '7' ? Quality.dom7 : Quality.maj7;
    if (isDiminished) {
      this.quality = Quality.o7;
    }
    if (isMinor7th) {
      this.quality = Quality.m7;
    }
    if (isHalfDiminished) {
      this.quality = Quality.m7b5;
    }

    this.romanNumeral = (isMajor ? rootRomanNumeral : rootRomanNumeral.toLowerCase()) + qualityToString(this.quality);
  }

  /**
   * Get the root of a chord
   *
   * @method getChordRoot
   * @param {string} chord - The chord to analyze
   * @returns {string} The root of the chord
   */
  private getChordRoot(): string {
    const matchResult = this.input.match(/[A-G][#b]?/);
    return matchResult ? matchResult[0] : '';
  }

  /**
   * Get the quality of a chord
   *
   * @method getChordQuality
   * @param {string} chord - The chord to analyze
   * @returns {string} The quality of the chord
   */
  private getChordQuality(): string {
    const matchResult = this.input.match(/maj7|m7b5|m7|dim7|aug7|7|m/);
    // console.log('matchResult:', matchResult);
    return matchResult ? matchResult[0] : '';
  }

  private rootToRomanNumeral(): string {
    let localScaleIndex = this.scale.indexOf(this.root);

    let romanNumeral = romanNumerals[localScaleIndex];
    // if index is not found, try flatting the this.root and search again
    if (romanNumeral) {
      this.scaleIndex = allRomanNumerals.indexOf(romanNumeral);
      assert(this.scaleIndex >= 0 && this.scaleIndex < 12, `${this.input}:  scaleIndex ${this.scaleIndex} out of range`);
      return romanNumeral;
    }

    const flatRoot = this.flatten(this.root)
    localScaleIndex = this.scale.indexOf(flatRoot);
    romanNumeral = romanNumerals[localScaleIndex];
    if (romanNumeral) {

      // TODO: does not work for sharps!!!!
      romanNumeral = '#' + romanNumeral;
      this.scaleIndex = allRomanNumerals.indexOf(romanNumeral);
      if (this.scaleIndex < 0) {
        this.scaleIndex = allShaprRomanNumerals.indexOf(romanNumeral);
      }
      assert(this.scaleIndex >= 0 && this.scaleIndex < 12, `${this.input}:  scaleIndex ${this.scaleIndex} out of range`);
      return romanNumeral;
    }

    const sharpRoot = this.sharpen(this.root);
    localScaleIndex = this.scale.indexOf(sharpRoot);
    romanNumeral = romanNumerals[localScaleIndex];
    if (romanNumeral) {
      romanNumeral = 'b' + romanNumeral
      this.scaleIndex = allRomanNumerals.indexOf(romanNumeral);
      assert(this.scaleIndex >= 0 && this.scaleIndex < 12, `${this.input}:  scaleIndex ${this.scaleIndex} out of range`);
      return romanNumeral;
    }

    this.scaleIndex = localScaleIndex;
    assert(this.scaleIndex >= 0 && this.scaleIndex < 12, `${this.input}:  scaleIndex ${this.scaleIndex} out of range`);

    return this.root;
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

  private addHarmonicFunction(harmonicFunction: string, weight = 1): void {
    this.harmonicFunctions.push(harmonicFunction);
    this.weights.push(weight);
  }

  getHarmonicFunction(): string {
    if (this.harmonicFunctions.length === 0) {
      return '?';
    }
    // return the harmonic function with the highest weight
    // const maxWeight = Math.max(...this.weights);
    // const maxIndex = this.weights.indexOf(maxWeight);
    // return this.harmonicFunctions[maxIndex];
    return this.getHarmonicFunctionsSorted()[0];
  }

  private getHarmonicFunctions(): string[] {
    return this.harmonicFunctions;
  }

}


