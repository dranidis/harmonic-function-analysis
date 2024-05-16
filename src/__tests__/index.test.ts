import { ChordRomanAnalyzer } from '../';
import { getScale } from '../scale';

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
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['D7', 'G7', 'C7', 'A7', 'B7', 'E7'], 'C')).toEqual([
      'V7/V',
      'V7',
      'V7/IV',
      'V7/ii',
      'V7/iii',
      'V7/vi',
    ]);
  });

  test('secondary ii-V', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Gm7', 'C7', 'F#m7b5', 'B7', 'Bm7b5', 'E7'], 'C')).toEqual([
      'iim7/IV',
      'V7/IV',
      'iim7b5/iii',
      'V7/iii',
      'iim7b5/vi',
      'V7/vi',
    ]);
  });

  test('sharp iv', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['F#dim7'], 'C')).toEqual(['#ivo7']);
  });

  test('backdoor dominant', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Fm7', 'Bb7'], 'C')).toEqual(['ivm7', 'BD7']);
  });

  test('tritone substitutions', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Ab7', 'Db7', 'Gb7'], 'C')).toEqual(['TT7/V', 'TT7', 'TT7/IV']);
  });

  test('major 7 chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Dbmaj7'], 'C')).toEqual(['IV/bVI']);
  });

  test('major 7 chords 2', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Abmaj7'], 'C')).toEqual(['IV/bIII']);
  });

  test('II7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['D7'], 'C')).toEqual(['V7/V']);
  });

  test('D7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['D7'], 'Ab')).toEqual(['TT7/IV']);
  });

  test('Am7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Am7'], 'Ab')).toEqual(['TTm7/IV']);
  });

  test('Ebmaj7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Ebmaj7'], 'Ab')).toEqual(['I/V']);
  });

  test('G7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['G7'], 'Ab')).toEqual(['V7/iii']);
  });

  test('D7 in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['D7'], 'C')).toEqual(['V7/V']);
  });

  test('Bb7 in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Bb7'], 'C')).toEqual(['BD7']);
  });

  // TODO: ?????
  test.skip('F7 Em7 in C, should it be TT7/iii OR BD7/V', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['F7', 'Em7'], 'C')).toEqual(['TT7/iii', 'iiim7']);
  });

  // TODO: add voting for local key (modulation)
  test.skip('ii-V-I-IV / V in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Am7', 'D7', 'Gmaj7', 'Cmaj7'], 'C')).toEqual(['iim7/V', 'V7/V', 'I/V', 'IV/V']);
  });

  // TODO: add voting for local key (modulation)

  test.skip('IV-V-I / bVI in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Dbmaj7', 'Eb7', 'Abmaj7'], 'C')).toEqual(['IV/bVI', 'V7/bVI', 'I/bVI']);
  });

  test('iim7b5-V7/iii in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['F#m7b5', 'B7'], 'C')).toEqual(['iim7b5/iii', 'V7/iii']);
  });

  test('#ivm7b5-V7/ii in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Em7b5', 'A7'], 'C')).toEqual(['iim7b5/ii', 'V7/ii']);
  });

    // TODO: add voting for local key (modulation)
    // maybe with extra ii-V local voting
  test.skip('F#m7b5-B7-Emaj7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['F#m7b5', 'B7', 'Emaj7'], 'Ab')).toEqual(['iim7b5/bVI', 'V7/bVI', 'I/bVI']);
  });

  // voting will solve this as well
  test.skip('Gm7b5-C7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Gm7b5', 'C7'], 'Ab')).toEqual(['ivm7b5/vi', 'V7/vi']);
  });

  test('diminished chords', () => { 
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.setSecondaryDominants(true);
    expect(romanAnalyzer.analyze(['Cmaj7', 'C#dim7', 'Dm7', 'D#dim7', 'Em7'], 'C')).toEqual(['I', 'viio7/ii', 'iim7', 'viio7/iii', 'iiim7']);
  });

});


describe('getScale', () => {

  test('F major', () => {
    expect(getScale('F')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F']);
  });

});
