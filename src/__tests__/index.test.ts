import {
  ChordRomanAnalyzer,
} from '../';
import { std }  from '../examples';
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
    expect(romanAnalyzer.analyze(['C', 'G', 'Am', 'F'], 'C')).toEqual([
      'I',
      'V',
      'vi',
      'IV',
    ]);
  });

  test('seventh chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['Dm7', 'G7', 'Cmaj7', 'Am7'], 'C')).toEqual([
      'iim7',
      'V7',
      'I',
      'vim7',
    ]);
  });

  test('key change', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['C', 'G', 'Am', 'D7'], 'G')).toEqual([
      'IV',
      'I',
      'ii',
      'V7',
    ]);
  });

  test('chords with flats', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(
      romanAnalyzer.analyze(['Dbmaj7', 'Bbm7', 'Eb7', 'Abmaj7'], 'Ab'),
    ).toEqual(['IV', 'iim7', 'V7', 'I']);
  });

  test('chords with sharps', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(
      romanAnalyzer.analyze(['C#m7', 'F#m7', 'B7', 'Emaj7'], 'E'),
    ).toEqual(['vim7', 'iim7', 'V7', 'I']);
  });

  test('non diatonic chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(
      romanAnalyzer.analyze(['Db', 'Gb7', 'Abmaj7', 'F#m7'], 'C'),
    ).toEqual(['bII', 'bV7', 'bVI', '#ivm7']);
  });

  test('secondary dominants', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['B7', 'E7', 'A7', 'D7', 'G7', 'C7'], 'C'),
    ).toEqual(['V7/iii', 'V7/vi', 'V7/ii', 'V7/V', 'V7', 'V7/IV']);
  });

  test('secondary ii-V', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['Gm7', 'C7', 'F#m7b5', 'B7', 'Bm7b5', 'E7'], 'C'),
    ).toEqual(['iim7/IV', 'V7/IV', 'iiø7/iii', 'V7/iii', 'iiø7/vi', 'V7/vi']);
  });

  test('sharp iv', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['F#dim7'], 'C')).toEqual(['#ivo7']);
  });

  test('backdoor dominant', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Fm7', 'Bb7'], 'C')).toEqual(['ivm7', 'BD7']);
  });

  test('major 7 chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Dbmaj7'], 'C')).toEqual(['IV/bVI']);
  });

  test('major 7 chords 2', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Abmaj7'], 'C')).toEqual(['IV/bIII']);
  });

  test('II7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['D7'], 'C')).toEqual(['V7/V']);
  });

  test('Ebmaj7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Ebmaj7'], 'Ab')).toEqual(['I/V']);
  });

  test('G7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['G7'], 'Ab')).toEqual(['V7/iii']);
  });

  test('D7 in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['D7'], 'C')).toEqual(['V7/V']);
  });

  test('Bb7 in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Bb7'], 'C')).toEqual(['BD7']);
  });

  // TODO: ?????
  test('F7 Em7 in C, should it be TT7/iii OR BD7/V', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['F7', 'Em7'], 'C')).toEqual([
      'TT7/iii',
      'iiim7',
    ]);
  });

  test('IV-V-I / bVI in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Dbmaj7', 'Eb7', 'Abmaj7'], 'C')).toEqual([
      'IV/bVI',
      'V7/bVI',
      'I/bVI',
    ]);
  });

  test('iiø7-V7/iii in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['F#m7b5', 'B7'], 'C')).toEqual([
      'iiø7/iii',
      'V7/iii',
    ]);
  });

  test('#ivm7b5-V7/ii in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Em7b5', 'A7'], 'C')).toEqual([
      'iiø7/ii',
      'V7/ii',
    ]);
  });

  // TODO: add voting for local key (modulation)
  // maybe with extra ii-V local voting
  test('F#m7b5-B7-Emaj7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['F#m7b5', 'B7', 'Emaj7'], 'Ab')).toEqual([
      'iiø7/bvi',
      'V7/bVI',
      'I/bVI',
    ]);
  });

  // voting will solve this as well
  test('Gm7b5-C7 in Ab', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Gm7b5', 'C7'], 'Ab')).toEqual([
      'iiø7/vi',
      'V7/vi',
    ]);
  });

  test('diminished chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['Cmaj7', 'C#dim7', 'Dm7', 'D#dim7', 'Em7'], 'C'),
    ).toEqual(['I', 'viio7/ii', 'iim7', 'viio7/iii', 'iiim7']);
  });

  test('iiim7-V7/ii-iim7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['Em7', 'A7', 'Dm7'], 'C'),
    ).toEqual(['iiim7', 'V7/ii', 'iim7']);
  });

  test('vim7-V7/V-V7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['Em7', 'A7', 'D7'], 'G'),
    ).toEqual(['vim7', 'V7/V', 'V7',]);
  });

  test('iiø7/vi V7/vi vim7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['Em7b5', 'A7', 'Dm7'], 'F'),
    ).toEqual(['iiø7/vi', 'V7/vi', 'vim7',]);
  });
});

describe('standards', () => {

  test('stella by starlight', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    // delete all '|' characters
    const chords = std.stellaByStarlightBars
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '');
    console.log('chords:', chords);
    console.log(romanAnalyzer.analyze(chords, 'Bb'));
    expect(romanAnalyzer.analyze(chords, 'Bb')).toEqual([
      'iiø7/iii',
      'V7/iii',
      'iim7',
      'V7',
      'iim7/IV',
      'V7/IV',
      'IV',
      'BD7',
      'I',
      'iiø7/iii',
      'V7/iii',
      'iiim7',
      'ivm7/V',
      'BD7/V',
      'I/V',
      'iiø7/iii',
      'V7/iii',
      'iiø7/vi',
      'V7/vi',
      'V7/ii',
      'iim7',
      'BD7',
      'I',
      'iiø7/iii',
      'V7/iii',
      'iiø7/ii',
      'V7/ii',
      'iiø7/i',
      'V7',
      'I',
    ]);
  });

  test('you stepped out of a dream first 16 bars', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    // delete all '|' characters
    const chords = std.yourSteppedBars1
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '')
      .slice(0, 13);
    console.log('chords:', chords);
    console.log(romanAnalyzer.analyze(chords, 'C'));
    expect(romanAnalyzer.analyze(chords, 'C')).toEqual([
      'I',
      'IV/bVI',
      'V7/bVI',
      'I/bVI',
      'iim7/IV',
      'V7/IV',
      'IV',
      'vim7',
      'V7/V',
      'ttm7/V',
      'TT7/V',
      'iim7',
      'V7',
    ]);
  });
});

describe('getScale', () => {
  test('F major', () => {
    expect(getScale('F')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F']);
  });
});

