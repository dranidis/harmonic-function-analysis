import { Quality, qualityToString } from './chord';
import { distanceFromI, distanceFromIInMinor } from './keys';
import { newKey } from './roman';

const KEY_WEIGHT_DIVIDER = 10; //10;
const MINOR_KEY_WEIGHT_SUBTRACT = 0.0;
const ENABLE_SEC_DOM = false;
const ENABLE_TT = true;
const ENABLE_MIN_MODE_MIXTURE = false;

export const minorIV_degree = 'iv';
export const minorII_degree = 'ii';
export const majorV_degree = 'V';
export const TT_degree = 'TT';
export const BD_degree = 'BD';
export const majorI_degree = 'I';

export class HarmonicFunction {
  private _key: string;
  private _degree: string;
  private quality: Quality;
  private _weight: number;

  constructor(key: string, degree: string, quality: Quality, weight: number) {
    this._key = key;
    this._degree = degree;
    this.quality = quality;
    this._weight = weight;
  }

  get isMainKey(): boolean {
    return this._key === 'I';
  }

  get isTonicInAnyKey(): boolean {
    return this._degree === majorI_degree;
  }

  get isDiatonic(): boolean {
    return this.isMainKey && this._degree !== 'iv' && this._degree !== 'i';
  }

  get isBackdoorDominantInAnyKey(): boolean {
    return this._degree === BD_degree && this.quality === Quality.dom7;
  }

  get isDominantInAnyKey(): boolean {
    return (
      ['V', 'TT', 'BD'].includes(this._degree) && this.quality === Quality.dom7
    );
  }

  toString(showWeight = false): string {
    let output = '';
    // if the first character of the degree is 'S' then it is a secondary dominant
    // in that case extract the rest of the degree
    if (this._degree[0] === 'S' && this._key === 'I') {
      output = `V7/${this._degree.slice(1)}`;
    } else if (this._degree[0] === 'T' && this._key === 'I') {
      output = 'TT7';
    } else {
      output =
        `${this._degree}` +
        qualityToString(this.quality) +
        (this._key === 'I' ? '' : `/${this._key}`);
    }

    return output + (showWeight ? ` (${this._weight.toPrecision(2)})` : '');
  }

  get weight(): number {
    return this._weight;
  }

  set weight(weight: number) {
    this._weight = weight;
  }

  get key(): string {
    return this._key;
  }

  get degree(): string {
    return this._degree;
  }
}

export function harmonicFuctionsForDominants(
  scaleIndex: number,
): HarmonicFunction[] {
  const functions = [];
  if (ENABLE_SEC_DOM) {
    functions.push(
      makeHarmonicFunction('SV', Quality.dom7, -2, scaleIndex),
      makeHarmonicFunction('Sii', Quality.dom7, +3, scaleIndex),
      makeHarmonicFunction('Svi', Quality.dom7, -4, scaleIndex),
      makeHarmonicFunction('Siii', Quality.dom7, +1, scaleIndex),
      makeHarmonicFunction('SIV', Quality.dom7, 0, scaleIndex),
    );
    if (ENABLE_TT) {
      functions.push(
        makeHarmonicFunction('TVi', Quality.dom7, 4, scaleIndex),
        makeHarmonicFunction('Tii', Quality.dom7, 9, scaleIndex),
        makeHarmonicFunction('Tvi', Quality.dom7, 2, scaleIndex),
        makeHarmonicFunction('Tiii', Quality.dom7, 7, scaleIndex),
        makeHarmonicFunction('TIV', Quality.dom7, 6, scaleIndex),
      );
    }
  }

  functions.push(
    makeHarmonicFunction('V', Quality.dom7, -7, scaleIndex),
    makeMinorHarmonicFunction('V', Quality.dom7, -7, scaleIndex),
    makeHarmonicFunction('BD', Quality.dom7, +2, scaleIndex),
  );

  if (ENABLE_TT) {
    functions.push(
      makeHarmonicFunction('TT', Quality.dom7, -1, scaleIndex),
      makeMinorHarmonicFunction('TT', Quality.dom7, -1, scaleIndex),
    );
  }

  return functions;
}

export function harmonicFunctionsForMajor(
  scaleIndex: number,
): HarmonicFunction[] {
  const functions = [];
  functions.push(
    makeHarmonicFunction('IV', Quality.maj7, 7, scaleIndex),
    makeHarmonicFunction('I', Quality.maj7, 0, scaleIndex),
  );

  if (ENABLE_MIN_MODE_MIXTURE) {
    functions.push(
      makeHarmonicFunction('bVI', Quality.maj7, -8, scaleIndex),
      makeHarmonicFunction('bIII', Quality.maj7, -3, scaleIndex),
    );
  }

  return functions;
}

export function harmonicFunctionsForMinor(
  scaleIndex: number,
): HarmonicFunction[] {
  const functions = [];
  functions.push(
    makeHarmonicFunction('ii', Quality.m7, -2, scaleIndex),
    makeHarmonicFunction('iii', Quality.m7, -4, scaleIndex),
    makeHarmonicFunction('vi', Quality.m7, -9, scaleIndex),
    makeHarmonicFunction('iv', Quality.m7, -5, scaleIndex),
    makeHarmonicFunction('i', Quality.m7, 0, scaleIndex),
  );

  if (ENABLE_TT) {
    functions.push(makeHarmonicFunction('tt', Quality.m7, -8, scaleIndex));
  }
  // if (ENABLE_MIN_MODE_MIXTURE) {
  // }
  // this.addMinorHarmonicFunctionHelper('i', Quality.m7, 0); // minor
  return functions;
}

export function harmonicFunctionsForHalfDiminished(
  scaleIndex: number,
): HarmonicFunction[] {
  return [
    makeMinorHarmonicFunction('ii', Quality.m7b5, -2, scaleIndex),
    // makeHarmonicFunction('vii', Quality.m7b5, 1, scaleIndex),
  ];
}

export function harmonicFunctionsForFullyDiminished(
  scaleIndex: number,
): HarmonicFunction[] {
  return [
    makeMinorHarmonicFunction('vii', Quality.o7, 1, scaleIndex),
    makeMinorHarmonicFunction('vii', Quality.o7, -2, scaleIndex),
    makeMinorHarmonicFunction('vii', Quality.o7, -5, scaleIndex),
    makeMinorHarmonicFunction('vii', Quality.o7, -8, scaleIndex),
  ];
}

function makeHarmonicFunction(
  posStr: string,
  quality: Quality,
  scaleDistance: number,
  scaleIndex: number,
): HarmonicFunction {
  const key = newKey(scaleDistance, scaleIndex);
  const keyDist = 1 - distanceFromI(key) / KEY_WEIGHT_DIVIDER;
  // console.log('key', key, 'keyDist', keyDist);
  return new HarmonicFunction(key, posStr, quality, keyDist);
}

function makeMinorHarmonicFunction(
  posStr: string,
  quality: Quality,
  scaleDistance: number,
  scaleIndex: number,
): HarmonicFunction {
  const key = newKey(scaleDistance, scaleIndex);
  const minorKey = key.toLowerCase();
  const minorKeyDist =
    1 -
    distanceFromIInMinor(minorKey) / KEY_WEIGHT_DIVIDER -
    MINOR_KEY_WEIGHT_SUBTRACT;
  // console.log('min key', minorKey, 'minorKeyDist', minorKeyDist);
  return new HarmonicFunction(minorKey, posStr, quality, minorKeyDist);
}
