const allRomanNumerals = ['I', 'bII', 'II', 'bIII', 'III', 'IV', 'bV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
const allSharpRomanNumerals = ['I', '#I', 'II', '#II', 'III', 'IV', '#IV', 'V', '#V', 'VI', '#VI', 'VII'];

export function scaleIndex(rootRomanNumeral: string): number {
  const index = allRomanNumerals.indexOf(rootRomanNumeral);

  if (index >= 0) 
    return index;

  return allSharpRomanNumerals.indexOf(rootRomanNumeral);
}

export function newKey(scaleDistance: number, scaleIndex: number): string {
  let index = (scaleIndex + scaleDistance) % 12;
  while (index < 0) {
    index += 12;
  }
  // console.log('index', index);
  return allRomanNumerals[index];
}
