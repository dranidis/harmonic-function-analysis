import { Quality, qualityToString } from "./chord";

export class HarmonicFunction {
  private _key: string;
  private position: string;
  private quality: Quality;
  private _weight: number;

  constructor(key: string, position: string, quality: Quality, weight: number) {
    this._key = key;
    this.position = position;
    this.quality = quality;
    this._weight = weight;
  }

  toString(): string {
    return `${this.position}`+ qualityToString(this.quality) 
      + (this._key === 'I' ? '' : `/${this._key}`);
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

}
