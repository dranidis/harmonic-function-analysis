import { HarmonicFunction } from './harmonicFunction';

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const allRomanNumerals = ['I', 'bII', 'II', 'bIII', 'III', 'IV', 'bV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
const allSharpRomanNumerals = ['I', '#I', 'II', '#II', 'III', 'IV', '#IV', 'V', '#V', 'VI', '#VI', 'VII'];
const keyCircle = ['I', 'IV', 'V', 'bVII', 'II', 'bIII', 'VI', 'bVI', 'III', 'bII', 'VII', 'bV'];
const minorKeyCircle = ['vi', 'ii', 'iii', 'v', 'vii', 'i', 'bv', 'iv', 'bii', 'bvii', 'bvi', 'biii'];

const KEY_WEIGHT_DIVIDER = 10//10;
const MINOR_KEY_WEIGHT_SUBTRACT = 0.0;
const FROM_NEXT_NEIGHBOR_UPDATE_FACTOR = 0.8;
const FROM_PREV_NEIGHBOR_UPDATE_FACTOR = 0.3;
const II_V_UPDATE_FACTOR = 2;
const V_I_UPDATE_FACTOR = 2;

const ENABLE_SEC_DOM = false;
const ENABLE_TT = true;

export enum Quality {
  maj7 = 'maj7',
  dom7 = '7',
  m7 = 'm7',
  m7b5 = 'm7b5',
  o7 = 'o7',
}

export function qualityToString(quality: Quality): string {
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
    throw new Error(msg);
  }
}

export class Chord {
  // return the two highest harmonic functions
  getHighestHarmonicFunctions(): string[] {
    const sortedFunctions = this.getHarmonicFunctionsSorted();
    if (sortedFunctions.length < 2) {
      return [sortedFunctions[0].toString()];
    }
    return [sortedFunctions[0].toString(), sortedFunctions[1].toString()];
  }
  // console.log('index', index);

  input: string;
  romanNumeral = '';
  harmonicFunctions: HarmonicFunction[] = [];
  root = '';
  scale: string[];
  quality: Quality = Quality.maj7;
  scaleIndex = 0;

  constructor(input: string, scale: string[]) {
    this.input = input;
    this.scale = scale;
    this.getRomanNumeral();
    this.analyzeRomanQuality();
  }

  getHarmonicFunction(): string {
    if (this.harmonicFunctions.length === 0) {
      return '?';
    }
    // return the harmonic function with the highest weight
    // const maxWeight = Math.max(...this.weights);
    // const maxIndex = this.weights.indexOf(maxWeight);
    // return this.harmonicFunctions[maxIndex];
    console.log(this.input)
    console.log(this.harmonicFunctions)
    return this.getHarmonicFunctionsSorted()[0].toString();
  }

  getHarmonicFunctions(): string[] {
    return this.harmonicFunctions.map((hf) => hf.toString());
  }

  updateWeights(previous: Chord | null, next: Chord | null): void {
    // console.log("BEF", this.input, this.harmonicFunctions);
    if (previous) {
      this.updateWeightsHelper(previous, FROM_PREV_NEIGHBOR_UPDATE_FACTOR);
      this.updateiiV(previous);
    }
    if (next) {
      this.updateWeightsHelper(next, FROM_NEXT_NEIGHBOR_UPDATE_FACTOR);
    }

    // if previous is a ii and current is a V in some same key
    // increase the weight of the previous ii and the current V by 0.5

    // console.log("AFT", this.input, this.harmonicFunctions);
  }

  updateiiV(previous: Chord) : void {
    for (const prevHarmonicFunction of previous.harmonicFunctions) {
      for (const harmonicFunction of this.harmonicFunctions) {
        if (prevHarmonicFunction.key === harmonicFunction.key) {
          if (prevHarmonicFunction.position === 'ii' && harmonicFunction.position === 'V') {
            harmonicFunction.weight *= II_V_UPDATE_FACTOR;
            prevHarmonicFunction.weight *= II_V_UPDATE_FACTOR;
          }

          if (prevHarmonicFunction.position === 'tt' && harmonicFunction.position === 'TT') {
            harmonicFunction.weight *= II_V_UPDATE_FACTOR;
            prevHarmonicFunction.weight *= II_V_UPDATE_FACTOR;
          }

          if (prevHarmonicFunction.position === 'iv' && harmonicFunction.position === 'BD') {
            harmonicFunction.weight *= II_V_UPDATE_FACTOR;
            prevHarmonicFunction.weight *= II_V_UPDATE_FACTOR;
          }

          if (prevHarmonicFunction.position === 'V' && harmonicFunction.position === 'I') {
            harmonicFunction.weight *= V_I_UPDATE_FACTOR;
            prevHarmonicFunction.weight *= V_I_UPDATE_FACTOR;
          }
        }
      }
    }
  }

  /**
   * for all the keys in the harmonic functions of the current chord
   * if the neighbor chord has the same key, increase the weight by 0.5 of the neighbor weight
   * @param neighborChord
   */
  private updateWeightsHelper(neighborChord: Chord, factor: number) {
    for (const neighborHarmonicFunction of neighborChord.harmonicFunctions) {
      for (const harmonicFunction of this.harmonicFunctions) {
        if (neighborHarmonicFunction.key === harmonicFunction.key) {
          harmonicFunction.weight += factor * neighborHarmonicFunction.weight;
        }
      }
    }
  }

  // return the harmonic functions sorted by their weight
  getHarmonicFunctionsSorted(): HarmonicFunction[] {
    const functions = this.harmonicFunctions;
    const sortedFunctions = functions.sort((a, b) => {
      return b.weight - a.weight;
    });
    return sortedFunctions;
  }

  private newkey(scaleDistance: number): string {
    let index = (this.scaleIndex + scaleDistance) % 12;
    while (index < 0) {
      index += 12;
    }
    // console.log('index', index);
    return allRomanNumerals[index];
  }

  private keyDistance(key: string): number {
    // console.log('keyDistance: key', key, 'keyCircle.indexOf(key)', keyCircle.indexOf(key));
    return 1 - keyCircle.indexOf(key) / KEY_WEIGHT_DIVIDER;
  }

  private addHarmonicFunctionHelper(posStr: string, quality: Quality, scaleDistance: number) {
    const key = this.newkey(scaleDistance);
    const keyDist = this.keyDistance(key);
    // console.log('key', key, 'keyDist', keyDist);
    this.addHarmonicFunction(key, posStr, quality, keyDist);
  }

  private addMinorHarmonicFunctionHelper(posStr: string, quality: Quality, scaleDistance: number) {
    const key = this.newkey(scaleDistance);
    const minorKey = key.toLowerCase();
    assert(minorKeyCircle.indexOf(minorKey) >= 0, `minorKey ${minorKey} not found`);
    const minorKeyDist = 1 - minorKeyCircle.indexOf(minorKey) / KEY_WEIGHT_DIVIDER - MINOR_KEY_WEIGHT_SUBTRACT;
    // console.log('min key', minorKey, 'minorKeyDist', minorKeyDist);
    this.addHarmonicFunction(minorKey, posStr, quality, minorKeyDist);
  }

  private addHarmonicFunction(key: string, posStr: string, quality: Quality, weight = 1): void {
    this.harmonicFunctions.push(new HarmonicFunction(key, posStr, quality, weight));
  }

  private analyzeRomanQuality(): void {
    assert(
      this.scaleIndex >= 0 && this.scaleIndex < 12,
      `${this.input} ${this.romanNumeral} scaleIndex ${this.scaleIndex} out of range`,
    );

    // maj7
    if (this.quality === Quality.maj7) {
      this.addHarmonicFunctionHelper('IV', Quality.maj7, 7);
      this.addHarmonicFunctionHelper('I', Quality.maj7, 0);
    }

    if (this.quality === Quality.dom7) {
      this.addHarmonicFunctionHelper('V', Quality.dom7, -7);
      this.addMinorHarmonicFunctionHelper('V', Quality.dom7, -7);
      this.addHarmonicFunctionHelper('BD', Quality.dom7, +2);
      if (ENABLE_TT) {
        this.addHarmonicFunctionHelper('TT', Quality.dom7, -1);
        this.addMinorHarmonicFunctionHelper('TT', Quality.dom7, -1);
      }

      // secondary dominants
      // tests break
      if (ENABLE_SEC_DOM) {
        this.addHarmonicFunctionHelper('SV', Quality.dom7, -2);
        this.addHarmonicFunctionHelper('Sii', Quality.dom7, +3);
        this.addHarmonicFunctionHelper('Svi', Quality.dom7, -4);
        this.addHarmonicFunctionHelper('Siii', Quality.dom7, +1);
        this.addHarmonicFunctionHelper('SIV', Quality.dom7, 0);
      }
    }

    if (this.quality === Quality.m7) {
      this.addHarmonicFunctionHelper('ii', Quality.m7, -2);
      this.addHarmonicFunctionHelper('iii', Quality.m7, -4);
      this.addHarmonicFunctionHelper('vi', Quality.m7, -9);
      this.addHarmonicFunctionHelper('iv', Quality.m7, -5);
      if (ENABLE_TT) {
       this.addHarmonicFunctionHelper('tt', Quality.m7, -8);
      }
      // this.addMinorHarmonicFunctionHelper('i', Quality.m7, 0); // minor

    }

    if (this.quality === Quality.m7b5) {
      this.addMinorHarmonicFunctionHelper('ii', Quality.m7b5, -2); // minor
      // this.addHarmonicFunctionHelper('vii', Quality.m7b5, 1);
    }

    if (this.quality === Quality.o7) {
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, 1);
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, -2);
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, -5);
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, -8);
    }

    // console.log(this.scaleIndex);
    // console.log(this.input, this.harmonicFunctions);
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
      assert(
        this.scaleIndex >= 0 && this.scaleIndex < 12,
        `${this.input}:  scaleIndex ${this.scaleIndex} out of range`,
      );
      return romanNumeral;
    }

    const flatRoot = this.flatten(this.root);
    localScaleIndex = this.scale.indexOf(flatRoot);
    romanNumeral = romanNumerals[localScaleIndex];
    if (romanNumeral) {
      // TODO: does not work for sharps!!!!
      romanNumeral = '#' + romanNumeral;
      this.scaleIndex = allRomanNumerals.indexOf(romanNumeral);
      if (this.scaleIndex < 0) {
        this.scaleIndex = allSharpRomanNumerals.indexOf(romanNumeral);
      }
      assert(
        this.scaleIndex >= 0 && this.scaleIndex < 12,
        `${this.input}:  scaleIndex ${this.scaleIndex} out of range`,
      );
      return romanNumeral;
    }

    const sharpRoot = this.sharpen(this.root);
    localScaleIndex = this.scale.indexOf(sharpRoot);
    romanNumeral = romanNumerals[localScaleIndex];
    if (romanNumeral) {
      romanNumeral = 'b' + romanNumeral;
      this.scaleIndex = allRomanNumerals.indexOf(romanNumeral);
      assert(
        this.scaleIndex >= 0 && this.scaleIndex < 12,
        `${this.input}:  scaleIndex ${this.scaleIndex} out of range`,
      );
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
}
