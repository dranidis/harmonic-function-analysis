export enum Quality {
  maj7 = 'maj7',
  dom7 = '7',
  m7 = 'm7',
  m7b5 = 'm7b5',
  o7 = 'o7',
  m = 'm',
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
    case Quality.m:
      return '';
  }
}
  /**
   * Get the root of a chord
   *
   * @method getChordRoot
   * @param {string} chord - The chord to analyze
   * @returns {string} The root of the chord
   */
  export function getChordRoot(chordStr: string): string {
    const matchResult = chordStr.match(/[A-G][#b]?/);

    if (!matchResult) {
      throw new Error(`Invalid chord: ${chordStr}`);
    }

    return matchResult[0];
  }

  /**
   * Get the quality of a chord
   *
   * @method getChordQuality
   * @param {string} chord - The chord to analyze
   * @returns {string} The quality of the chord
   */
  export function getChordQuality(chordStr: string): Quality {
    const matchResult = chordStr.match(/maj7|m7b5|m7|dim7|aug7|7|m/);
    // console.log('matchResult:', matchResult);
   
    const quality = matchResult ? matchResult[0] : '';

    const isMajor = quality === 'maj' || quality === 'maj7' || quality === '7' || quality === '';
    const isMinor7th = quality === 'm7';
    const isDiminished = quality === 'dim7';
    const isHalfDiminished = quality === 'm7b5';

    const chordQuality = quality === '7' ? Quality.dom7 : Quality.maj7;
    if (isDiminished) {
      return Quality.o7;
    }
    if (isMinor7th) {
      return Quality.m7;
    }
    if (isHalfDiminished) {
      return Quality.m7b5;
    }
    if (isMajor)    
      return chordQuality;

    return Quality.m;
  }

