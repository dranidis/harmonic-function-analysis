import { Quality, qualityToString } from './chord';

const SHOW_WEIGHT = false;

export class HarmonicFunction {
  private _key: string;
  private _position: string;
  private quality: Quality;
  private _weight: number;

  constructor(key: string, position: string, quality: Quality, weight: number) {
    this._key = key;
    this._position = position;
    this.quality = quality;
    this._weight = weight;
  }

  toString(): string {
    let output = '';
    // if the first character of the position is 'S' then it is a secondary dominant
    // in that case extract the rest of the position
    if (this._position[0] === 'S' && this._key === 'I') {
      output = `V7/${this._position.slice(1)}`;
    }

    output = `${this._position}` + qualityToString(this.quality) + (this._key === 'I' ? '' : `/${this._key}`);

    return output + (SHOW_WEIGHT ? ` (${this._weight.toPrecision(2)})` : '');
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

  get position(): string {
    return this._position;
  }
  
}
