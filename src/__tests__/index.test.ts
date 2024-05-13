import { ChordRomanAnalyzer } from '../';

describe('RomanAnalyzer', () => {
  test('RomanAnalyzer exists', () => {
    expect(ChordRomanAnalyzer).toBeDefined();
  });

  test('empty chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze([], 'C')).toEqual([]);
  });

  test('simple chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['C', 'G', 'Am', 'F'], 'C')).toEqual(['I', 'V', 'vi', 'IV']);
  });

  test('seventh chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['Dm7', 'G7', 'Cmaj7', 'Am7'], 'C')).toEqual(['iim7', 'V7', 'I', 'vim7']);
  });

  test('key change', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['C', 'G', 'Am', 'D7'], 'G')).toEqual(['IV', 'I', 'ii', 'V7']);
  });

  test('chords with flats', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['Dbmaj7', 'Bbm7', 'Eb7', 'Abmaj7'], 'Ab')).toEqual(['IV', 'iim7', 'V7', 'I']);
  });

  test('chords with sharps', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['C#m7', 'F#m7', 'B7', 'Emaj7'], 'E')).toEqual(['vim7', 'iim7', 'V7', 'I']);
  });

  test('non diatonic chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['Db', 'Gb7', 'Abmaj7', 'F#m7'], 'C')).toEqual(['bII', 'bV7', 'bVI', '#ivm7']);
  });

  test('secondary dominants', () => { 
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setOptions({secondaryDominants: true});
    expect(romanAnalyzer.analyze(['D7', 'G7', 'C7', 'A7', 'B7', 'E7'], 'C')).toEqual(['V7/V', 'V7', 'V7/IV', 'V7/ii', 'V7/iii', 'V7/vi']);
  });

  test('secondary ii-V', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setOptions({secondaryDominants: true});
    expect(romanAnalyzer.analyze(['Gm7', 'C7', 'F#dim7', 'B7', 'Bdim7', 'E7'], 'C'))
    .toEqual(['iim7/IV', 'V7/IV', 'iio7/iii', 'V7/iii', 'iio7/vi', 'V7/vi']);
  });

  test('sharp iv', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['F#dim7'], 'C')).toEqual(['#ivo7']);
  });

  test('backdoor dominant', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setOptions({secondaryDominants: true});
    expect(romanAnalyzer.analyze(['Fm7', 'Bb7'], 'C')).toEqual(['ivm7', 'BD7']);
  });

  test('tritone substitutions', () => { 
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setOptions({secondaryDominants: true});
    expect(romanAnalyzer.analyze(['Ab7', 'Db7', 'Gb7', 'Eb7', 'F7'], 'C')).toEqual(['TT7/V', 'TT7', 'TT7/IV', 'TT7/ii', 'TT7/iii']);
  });

});
