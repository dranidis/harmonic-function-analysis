const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  
  /**
   * if note is sharp remove the sharp
   * otherwise add a flat
   */
  export function flatten(note: string): string {
    return note.includes('#') ? note.slice(0, 1) : note + 'b';
  }

  export function sharpen(note: string): string {
    return note.includes('b') ? note.slice(0, 1) : note + '#';
  }

  export function rootToRomanNumeral(scale: string[], root: string): string {

    let romanNumeral = romanNumerals[scale.indexOf(root)];
    // if index is not found, try flatting the root and search again
    if (romanNumeral) {
      return romanNumeral;
    }

    romanNumeral = romanNumerals[scale.indexOf(flatten(root))];
    if (romanNumeral) {
      romanNumeral = '#' + romanNumeral;
      return romanNumeral;
    }

    romanNumeral = romanNumerals[ scale.indexOf(sharpen(root))];
    if (romanNumeral) {
      romanNumeral = 'b' + romanNumeral;
      return romanNumeral;
    }

    return root;
  }
