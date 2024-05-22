import { Chord, Quality } from './chord';
import { HarmonicFunction } from './harmonicFunction';
import { distanceFromI, distanceFromIInMinor } from './keys';
import { newKey } from './roman';
import { assertThat } from './util';

const KEY_WEIGHT_DIVIDER = 10; //10;
const MINOR_KEY_WEIGHT_SUBTRACT = 0.0;
const FROM_NEXT_NEIGHBOR_UPDATE_FACTOR = 0.0;
const FROM_PREV_NEIGHBOR_UPDATE_FACTOR = 0.0;
export const II_V_UPDATE_FACTOR = 1; //4;
export const V_I_UPDATE_FACTOR = 10; //5;

const ENABLE_SEC_DOM = false;
const ENABLE_TT = true;
export const ENABLE_MIN_MODE_MIXTURE = false;

export class ChordAnalysis {
  chord: Chord;
  harmonicFunctions: HarmonicFunction[] = [];
  scaleIndex = 0;

  constructor(chord: Chord, scale: string[]) {
    this.chord = chord;
    this.scaleIndex = this.chord.getScaleIndex(scale);
    this.analyzeRomanQuality();
  }

  updateIIwithNextV(nextV: ChordAnalysis): void {
    const bestPrev = this.getBestHarmonicFunction();

    if (bestPrev.key === 'I') return;

    const bestCurrent = nextV.getBestHarmonicFunction();
    const previousII = this.getHarmonicFunctionAtPositionAndKey(
      'ii',
      bestCurrent.key,
    );

    if (previousII) {
      previousII.weight *= 10;
    }

    if (this.chord.isHalfDiminished) {
      const nextVtoMinor = nextV.getHarmonicFunctionAtPositionAndKey(
        'V',
        bestCurrent.key.toLowerCase(),
      );
      if (nextVtoMinor) {
        nextVtoMinor.weight *= 100;
      }
    }
  }

  getHarmonicFunctionAtPositionAndKey(
    position: string,
    key: string,
  ): HarmonicFunction | undefined {
    for (const hf of this.harmonicFunctions) {
      if (hf.position === position && hf.key === key) {
        return hf;
      }
    }
  }

  getBestHarmonicFunction(): HarmonicFunction {
    return this.getHarmonicFunctionsSorted()[0];
  }

  getBestHarmonicFunctionStr(): string {
    if (this.harmonicFunctions.length === 0) {
      return '?';
    }
    // return the harmonic function with the highest weight
    // const maxWeight = Math.max(...this.weights);
    // const maxIndex = this.weights.indexOf(maxWeight);
    // return this.harmonicFunctions[maxIndex];
    return this.getHarmonicFunctionsSorted()[0].toString();
  }

  // return the two highest harmonic functions
  getHighestHarmonicFunctions(): string[] {
    const sortedFunctions = this.getHarmonicFunctionsSorted();
    if (sortedFunctions.length < 2) {
      return [sortedFunctions[0].toString()];
    }
    return [sortedFunctions[0].toString(), sortedFunctions[1].toString()];
  }

  getHarmonicFunctions(): string[] {
    return this.harmonicFunctions.map((hf) => hf.toString());
  }

  updateWeights(
    previous: ChordAnalysis | null,
    next: ChordAnalysis | null,
  ): void {
    if (previous) {
      this.updateWeightsHelper(previous, FROM_PREV_NEIGHBOR_UPDATE_FACTOR);
      this.updateVI(previous);
    }
    if (next) {
      this.updateWeightsHelper(next, FROM_NEXT_NEIGHBOR_UPDATE_FACTOR);
    }
  }

  updateWeights2(
    previous: ChordAnalysis | null,
    next: ChordAnalysis | null,
  ): void {
    if (previous) {
      // console.log('KEY', this.chord.input, this.getBestHarmonicFunction(), this.harmonicFunctions)
      this.updateWeightsHelper(previous, FROM_PREV_NEIGHBOR_UPDATE_FACTOR);
      this.updateiiV(previous);
    }
    if (next) {
      this.updateWeightsHelper(next, FROM_NEXT_NEIGHBOR_UPDATE_FACTOR);
    }
  }

  showFunctions(): void {
    console.log(this.chord.input);
    const f = this.getHarmonicFunctionsSorted().reduce(
      (acc, hf) => acc + hf.toString(true) + ' ',
      '  ',
    );

    console.log(f);
  }

  private updateiiV(previous: ChordAnalysis): void {
    for (const prevHarmonicFunction of previous.harmonicFunctions) {
      for (const harmonicFunction of this.harmonicFunctions) {
        if (prevHarmonicFunction.key === harmonicFunction.key) {
          if (
            // prevHarmonicFunction.key != "II" && prevHarmonicFunction.key != "V" &&
            prevHarmonicFunction.position === 'ii' &&
            harmonicFunction.position === 'V'
          ) {
            // harmonicFunction.weight *= II_V_UPDATE_FACTOR;
            prevHarmonicFunction.weight *= II_V_UPDATE_FACTOR;
          }

          // if (
          //   prevHarmonicFunction.position === 'tt' &&
          //   harmonicFunction.position === 'TT'
          // ) {
          //   harmonicFunction.weight *= II_V_UPDATE_FACTOR;
          //   prevHarmonicFunction.weight *= II_V_UPDATE_FACTOR;
          // }

          if (
            prevHarmonicFunction.position === 'iv' &&
            harmonicFunction.position === 'BD'
          ) {
            harmonicFunction.weight *= II_V_UPDATE_FACTOR;
            prevHarmonicFunction.weight *= II_V_UPDATE_FACTOR;
          }
        }
      }
    }
  }

  private updateVI(previous: ChordAnalysis): void {
    for (const prevHarmonicFunction of previous.harmonicFunctions) {
      for (const harmonicFunction of this.harmonicFunctions) {
        // secondary dominants V7-I or V7-i
        if (
          ['V', 'TT', 'BD'].includes(prevHarmonicFunction.position) &&
          prevHarmonicFunction.key === harmonicFunction.position &&
          harmonicFunction.key === 'I'
        ) {
          harmonicFunction.weight *= V_I_UPDATE_FACTOR;
          prevHarmonicFunction.weight *= V_I_UPDATE_FACTOR;
        }
        // ordinary dominants
        else if (
          prevHarmonicFunction.key === harmonicFunction.key &&
          ['V', 'TT', 'BD'].includes(prevHarmonicFunction.position) &&
          harmonicFunction.position === 'I'
        ) {
          harmonicFunction.weight *= V_I_UPDATE_FACTOR;
          prevHarmonicFunction.weight *= V_I_UPDATE_FACTOR;
        }
      }
    }
  }

  /**
   * for all the keys in the harmonic functions of the current chord
   * if the neighbor chord has the same key, increase the weight by 0.5 of the neighbor weight
   * @param neighborChord
   */
  private updateWeightsHelper(neighborChord: ChordAnalysis, factor: number) {
    for (const neighborHarmonicFunction of neighborChord.harmonicFunctions) {
      for (const harmonicFunction of this.harmonicFunctions) {
        if (neighborHarmonicFunction.key === harmonicFunction.key) {
          harmonicFunction.weight += factor * neighborHarmonicFunction.weight;
        }
      }
    }
  }

  // return the harmonic functions sorted by their weight
  private getHarmonicFunctionsSorted(): HarmonicFunction[] {
    const functions = this.harmonicFunctions;
    const sortedFunctions = functions.sort((a, b) => {
      return b.weight - a.weight;
    });
    return sortedFunctions;
  }

  private addHarmonicFunctionHelper(
    posStr: string,
    quality: Quality,
    scaleDistance: number,
  ) {
    const key = newKey(scaleDistance, this.scaleIndex);
    const keyDist = 1 - distanceFromI(key) / KEY_WEIGHT_DIVIDER;
    // console.log('key', key, 'keyDist', keyDist);
    this.addHarmonicFunction(key, posStr, quality, keyDist);
  }

  private addMinorHarmonicFunctionHelper(
    posStr: string,
    quality: Quality,
    scaleDistance: number,
  ) {
    const key = newKey(scaleDistance, this.scaleIndex);
    const minorKey = key.toLowerCase();
    const minorKeyDist =
      1 -
      distanceFromIInMinor(minorKey) / KEY_WEIGHT_DIVIDER -
      MINOR_KEY_WEIGHT_SUBTRACT;
    // console.log('min key', minorKey, 'minorKeyDist', minorKeyDist);
    this.addHarmonicFunction(minorKey, posStr, quality, minorKeyDist);
  }

  private addHarmonicFunction(
    key: string,
    posStr: string,
    quality: Quality,
    weight = 1,
  ): void {
    this.harmonicFunctions.push(
      new HarmonicFunction(key, posStr, quality, weight),
    );
  }

  private analyzeRomanQuality(): void {
    assertThat(
      this.scaleIndex >= 0 && this.scaleIndex < 12,
      `${this.chord} scaleIndex ${this.scaleIndex} out of range`,
    );

    // maj7
    if (this.chord.isMaj7) {
      this.addHarmonicFunctionHelper('IV', Quality.maj7, 7);
      this.addHarmonicFunctionHelper('I', Quality.maj7, 0);

      if (ENABLE_MIN_MODE_MIXTURE) {
        this.addHarmonicFunctionHelper('bVI', Quality.maj7, -8);
        this.addHarmonicFunctionHelper('bIII', Quality.maj7, -3);
      }
    }

    if (this.chord.isDominant7) {
      // secondary dominants
      // tests break
      if (ENABLE_SEC_DOM) {
        this.addHarmonicFunctionHelper('SV', Quality.dom7, -2);
        this.addHarmonicFunctionHelper('Sii', Quality.dom7, +3);
        this.addHarmonicFunctionHelper('Svi', Quality.dom7, -4);
        this.addHarmonicFunctionHelper('Siii', Quality.dom7, +1);
        this.addHarmonicFunctionHelper('SIV', Quality.dom7, 0);
        if (ENABLE_TT) {
          this.addHarmonicFunctionHelper('TVi', Quality.dom7, 4);
          this.addHarmonicFunctionHelper('Tii', Quality.dom7, 9);
          this.addHarmonicFunctionHelper('Tvi', Quality.dom7, 2);
          this.addHarmonicFunctionHelper('Tiii', Quality.dom7, 7);
          this.addHarmonicFunctionHelper('TIV', Quality.dom7, 6);
        }
      }

      this.addHarmonicFunctionHelper('V', Quality.dom7, -7);
      this.addMinorHarmonicFunctionHelper('V', Quality.dom7, -7);
      this.addHarmonicFunctionHelper('BD', Quality.dom7, +2);
      if (ENABLE_TT) {
        this.addHarmonicFunctionHelper('TT', Quality.dom7, -1);
        this.addMinorHarmonicFunctionHelper('TT', Quality.dom7, -1);
      }
    }

    if (this.chord.isMinor7) {
      this.addHarmonicFunctionHelper('ii', Quality.m7, -2);
      this.addHarmonicFunctionHelper('iii', Quality.m7, -4);
      this.addHarmonicFunctionHelper('vi', Quality.m7, -9);
      this.addHarmonicFunctionHelper('iv', Quality.m7, -5);
      if (ENABLE_TT) {
        this.addHarmonicFunctionHelper('tt', Quality.m7, -8);
      }
      if (ENABLE_MIN_MODE_MIXTURE) {
        this.addHarmonicFunctionHelper('i', Quality.m7, 0);
      }
      // this.addMinorHarmonicFunctionHelper('i', Quality.m7, 0); // minor
    }

    if (this.chord.isHalfDiminished) {
      this.addMinorHarmonicFunctionHelper('ii', Quality.m7b5, -2); // minor
      // this.addHarmonicFunctionHelper('vii', Quality.m7b5, 1);
    }

    if (this.chord.isFullyDiminished) {
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, 1);
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, -2);
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, -5);
      this.addMinorHarmonicFunctionHelper('vii', Quality.o7, -8);
    }
  }
}
