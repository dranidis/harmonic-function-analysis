import { Quality, qualityToString } from "./chord";

export class HarmonicFunction {
  private key: string;
  private position: string;
  private quality: Quality;
  private _weight: number;

  constructor(key: string, position: string, quality: Quality, weight: number) {
    this.key = key;
    this.position = position;
    this.quality = quality;
    this._weight = weight;
  }

  toString(): string {
    return `${this.position}`+ qualityToString(this.quality) 
      + (this.key === 'I' ? '' : `/${this.key}`);
  }

  get weight(): number {
    return this._weight;
  }
}
