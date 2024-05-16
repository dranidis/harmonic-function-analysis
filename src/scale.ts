/**
 * Get the scale of a key.
 * Works for major keys only.
 * Works with accidentals.
 *
 * @method getScale
 * @param {string} key - The key to analyze
 * @returns {string[]} The scale of the key
 * @example
 * getScale('C');
 * // returns ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * @example
 * getScale('F#');
 * // returns ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']
 */

const flattedNotes: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const sharpNotes: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getScale(key: string): string[] {
  const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
  const scale: string[] = [key];

  let notesToUse = flattedNotes;

  const isSharpKey = sharpNotes.includes(key);
  if (isSharpKey) {
    notesToUse = sharpNotes;
  }

  let currentIndex = notesToUse.indexOf(key);

  for (const interval of majorScaleIntervals) {
    currentIndex = (currentIndex + interval) % notesToUse.length;
    scale.push(notesToUse[currentIndex]);
  }

  return scale;
}
