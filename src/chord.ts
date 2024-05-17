import { Quality, getChordQuality, getChordRoot, qualityToString } from './chordName';
import { HarmonicFunction } from './harmonicFunction';
import { rootToRomanNumeral } from './note';
import { newKey, scaleIndex } from './roman';

const keyCircle = ['I', 'IV', 'V', 'bVII', 'II', 'bIII', 'VI', 'bVI', 'III', 'bII', 'VII', 'bV'];
const minorKeyCircle = ['vi', 'ii', 'iii', 'v', 'vii', 'i', 'bv', 'iv', 'bii', 'bvii', 'bvi', 'biii'];

const KEY_WEIGHT_DIVIDER = 10; //10;
const MINOR_KEY_WEIGHT_SUBTRACT = 0.0;
const FROM_NEXT_NEIGHBOR_UPDATE_FACTOR = 0.8;
const FROM_PREV_NEIGHBOR_UPDATE_FACTOR = 0.3;
const II_V_UPDATE_FACTOR = 2;
const V_I_UPDATE_FACTOR = 2;

const ENABLE_SEC_DOM = false;
const ENABLE_TT = true;



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
    this.initialize();
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
    console.log(this.input);
    console.log(this.harmonicFunctions);
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

  updateiiV(previous: Chord): void {
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

  private addHarmonicFunctionHelper(posStr: string, quality: Quality, scaleDistance: number) {
    const key = newKey(scaleDistance, this.scaleIndex);
    const keyDist = 1 - keyCircle.indexOf(key) / KEY_WEIGHT_DIVIDER;
    // console.log('key', key, 'keyDist', keyDist);
    this.addHarmonicFunction(key, posStr, quality, keyDist);
  }

  private addMinorHarmonicFunctionHelper(posStr: string, quality: Quality, scaleDistance: number) {
    const key = newKey(scaleDistance, this.scaleIndex);
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
  }

  private initialize(): void {
    this.root = getChordRoot(this.input);
    this.quality = getChordQuality(this.input);

    const rootRomanNumeral = rootToRomanNumeral(this.scale, this.root);

    this.scaleIndex = scaleIndex(rootRomanNumeral);

    this.romanNumeral =
      (this.quality === Quality.dom7 || this.quality === Quality.maj7
        ? rootRomanNumeral
        : rootRomanNumeral.toLowerCase()) + qualityToString(this.quality);
  }
}
