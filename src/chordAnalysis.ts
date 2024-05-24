import { Chord } from './chord';
import {
  HarmonicFunction,
  harmonicFuctionsForDominants as harmonicFunctionsForDominants,
  harmonicFunctionsForFullyDiminished,
  harmonicFunctionsForHalfDiminished,
  harmonicFunctionsForMajor,
  harmonicFunctionsForMinor,
  majorV_degree,
  minorII_degree,
  minorIV_degree,
} from './harmonicFunction';
import { toMinorKey } from './keys';

import { assertThat } from './util';

const FROM_NEXT_NEIGHBOR_UPDATE_FACTOR = 0.0;
const FROM_PREV_NEIGHBOR_UPDATE_FACTOR = 0.0;
const II_V_UPDATE_FACTOR_ii = 10; //4;
const V_I_UPDATE_FACTOR_V = 10; //5;
const V_I_UPDATE_FACTOR_I = 4; //5;
const II_V_UPDATE_TO_MINOR_V_due_to_dim_ii = 35;
const KEY_CHANGE_UPDATE_FACTOR = 2;

export class ChordAnalysis {
  chord: Chord;
  harmonicFunctions: HarmonicFunction[] = [];
  scaleIndex = 0;

  constructor(chord: Chord, scale: string[]) {
    this.chord = chord;
    this.scaleIndex = this.chord.getScaleIndex(scale);
    this.analyzeRomanQuality();
  }

  updateKeyChanges(previous: ChordAnalysis, next: ChordAnalysis): void {
    const previousKey = previous.getBestHarmonicFunction().key;
    const nextKey = next.getBestHarmonicFunction().key;
    if (previousKey === nextKey) {
      if (this.getBestHarmonicFunction().key !== previousKey) {
        const functionToUpdate = this.getHarmonicFunctionAtKey(previousKey);
        if (functionToUpdate) {
          functionToUpdate.weight += KEY_CHANGE_UPDATE_FACTOR;
        }
      }
    }
  }

  private getHarmonicFunctionAtKey(key: string): HarmonicFunction | undefined {
    for (const hf of this.harmonicFunctions) {
      if (hf.key === key) {
        return hf;
      }
    }
  }

  updateIIwithNextV(nextV: ChordAnalysis): void {
    const bestFunction = this.getBestHarmonicFunction();

    // don't change the function of diatonic chords
    if (bestFunction.isDiatonic) return;

    const bestNextFunction = nextV.getBestHarmonicFunction();

    const currentIIwithKeyOfNext = this.getHarmonicFunctionAtDegreeAndKey(
      bestNextFunction.isBackdoorDominantInAnyKey
        ? minorIV_degree
        : minorII_degree, // the ii of a BD is a iv
      bestNextFunction.key,
    );

    if (currentIIwithKeyOfNext) {
      currentIIwithKeyOfNext.weight *= II_V_UPDATE_FACTOR_ii;
    }

    if (this.chord.isHalfDiminished) {
      const nextVtoMinor = nextV.getHarmonicFunctionAtDegreeAndKey(
        majorV_degree,
        toMinorKey(bestNextFunction.key),
      );
      if (nextVtoMinor) {
        nextVtoMinor.weight *= II_V_UPDATE_TO_MINOR_V_due_to_dim_ii;
      }
    }
  }

  getHarmonicFunctionAtDegreeAndKey(
    degree: string,
    key: string,
  ): HarmonicFunction | undefined {
    for (const hf of this.harmonicFunctions) {
      if (hf.degree === degree && hf.key === key) {
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

  showFunctions(): void {
    console.log(this.chord.input);
    const f = this.getHarmonicFunctionsSorted().reduce(
      (acc, hf) => acc + hf.toString(true) + ' ',
      '  ',
    );

    console.log(f);
  }

  private updateVI(previous: ChordAnalysis): void {
    for (const prevHarmonicFunction of previous.harmonicFunctions) {
      for (const harmonicFunction of this.harmonicFunctions) {
        // secondary dominants V7-I or V7-i
        if (
          prevHarmonicFunction.isDominantInAnyKey &&
          prevHarmonicFunction.key === harmonicFunction.degree &&
          harmonicFunction.isMainKey
        ) {
          // console.log("sec V-I", previous.chord.input, prevHarmonicFunction, this.chord.input, harmonicFunction);
          harmonicFunction.weight *= V_I_UPDATE_FACTOR_I;
          prevHarmonicFunction.weight *= V_I_UPDATE_FACTOR_V;
        }
        // ordinary dominants
        else if (
          prevHarmonicFunction.key === harmonicFunction.key &&
          prevHarmonicFunction.isDominantInAnyKey &&
          harmonicFunction.isTonicInAnyKey
        ) {
          // console.log("V-I", previous.chord.input, prevHarmonicFunction, this.chord.input, harmonicFunction);
          harmonicFunction.weight *= V_I_UPDATE_FACTOR_I;
          prevHarmonicFunction.weight *= V_I_UPDATE_FACTOR_V;
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

  private analyzeRomanQuality(): void {
    assertThat(
      this.scaleIndex >= 0 && this.scaleIndex < 12,
      `${this.chord} scaleIndex ${this.scaleIndex} out of range`,
    );

    if (this.chord.isMaj7) {
      this.harmonicFunctions.push(
        ...harmonicFunctionsForMajor(this.scaleIndex),
      );
    }

    if (this.chord.isDominant7) {
      this.harmonicFunctions.push(
        ...harmonicFunctionsForDominants(this.scaleIndex),
      );
    }

    if (this.chord.isMinor7) {
      this.harmonicFunctions.push(
        ...harmonicFunctionsForMinor(this.scaleIndex),
      );
    }

    if (this.chord.isHalfDiminished) {
      this.harmonicFunctions.push(
        ...harmonicFunctionsForHalfDiminished(this.scaleIndex),
      );
    }

    if (this.chord.isFullyDiminished) {
      this.harmonicFunctions.push(
        ...harmonicFunctionsForFullyDiminished(this.scaleIndex),
      );
    }
  }
}
