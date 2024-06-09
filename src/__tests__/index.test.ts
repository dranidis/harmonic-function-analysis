import { ChordRomanAnalyzer } from '../';
import { standards } from '../examples';
import { ENABLE_MIN_MODE_MIXTURE } from '../harmonicFunction';
import { getScale } from '../scale';

describe('RomanAnalyzer', () => {
  test('RomanAnalyzer exists', () => {
    expect(ChordRomanAnalyzer).toBeDefined();
  });

  test('empty chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze([], 'C')).toEqual([]);
  });

  test('6 chord I', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    expect(romanAnalyzer.analyze(['C6'], 'C')).toEqual(['I']);
  });

  test('6 chord I/IV', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    expect(romanAnalyzer.analyze(['F6'], 'C')).toEqual(['IV']);
  });

  test('6 chord I/bVI', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    expect(romanAnalyzer.analyze(['Ab6'], 'C')).toEqual(['bVI']);
  });

  test('6 chord I/bIII', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    expect(romanAnalyzer.analyze(['Eb6'], 'C')).toEqual(['bIII']);
  });

  test('m6 chord i', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    expect(romanAnalyzer.analyze(['Cm6'], 'C')).toEqual(['i']);
  });

  test.skip('simple chords', () => {
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
      'ii',
      'V7',
      'I',
      'vi',
    ]);
  });

  test('chords with flats', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(
      romanAnalyzer.analyze(['Dbmaj7', 'Bbm7', 'Eb7', 'Abmaj7'], 'Ab'),
    ).toEqual(['IV', 'ii', 'V7', 'I']);
  });

  test('chords with sharps', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(
      romanAnalyzer.analyze(['C#m7', 'F#m7', 'B7', 'Emaj7'], 'E'),
    ).toEqual(['vi', 'ii', 'V7', 'I']);
  });

  test('non diatonic chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(
      romanAnalyzer.analyze(['Db', 'Gb7', 'Abmaj7', 'F#m7'], 'C'),
    ).toEqual(['bII', 'bV7', 'bVI', '#iv']);
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
    ).toEqual(['ii/IV', 'V7/IV', 'iiø7/iii', 'V7/iii', 'iiø7/vi', 'V7/vi']);
  });

  test('sharp iv', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    expect(romanAnalyzer.analyze(['F#o7'], 'C')).toEqual(['#ivo7']);
  });

  test('backdoor dominant', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Fm7', 'Bb7'], 'C')).toEqual(['iv', 'BD7']);
  });

  test.skip('major 7 chords', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Dbmaj7'], 'C')).toEqual(['IV/bVI']);
  });

  test('bVI', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    if (ENABLE_MIN_MODE_MIXTURE)
      expect(romanAnalyzer.analyze(['Abmaj7'], 'C')).toEqual(['bVI']);
  });

  test('bIII', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    if (ENABLE_MIN_MODE_MIXTURE)
      expect(romanAnalyzer.analyze(['Ebmaj7'], 'C')).toEqual(['bIII']);
  });

  test('II7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['D7'], 'C')).toEqual(['V7/V']);
  });

  test.skip('Ebmaj7 in Ab', () => {
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
      'iii',
    ]);
  });

  test.skip('IV-V-I / bVI in C', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Dbmaj7', 'Eb7', 'Abmaj7'], 'C')).toEqual([
      'IV/bVI',
      'V7/bVI',
      'bVI',
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
      'V7/bvi',
      ENABLE_MIN_MODE_MIXTURE ? 'bVI' : 'I/bVI',
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
      romanAnalyzer.analyze(['Cmaj7', 'C#o7', 'Dm7', 'D#o7', 'Em7'], 'C'),
    ).toEqual(['I', 'viio7/ii', 'ii', 'viio7/iii', 'iii']);
  });

  test('iii-V7/ii-ii', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Em7', 'A7', 'Dm7'], 'C')).toEqual([
      'iii',
      'V7/ii',
      'ii',
    ]);
  });

  test('vi-V7/V-V7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Em7', 'A7', 'D7'], 'G')).toEqual([
      'vi',
      'V7/V',
      'V7',
    ]);
  });

  test('iiø7/vi V7/vi vi', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Em7b5', 'A7', 'Dm7'], 'F')).toEqual([
      'iiø7/vi',
      'V7/vi',
      'vi',
    ]);
  });

  test('iv-BD7/V I/V', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Bbm7', 'Eb7', 'Fmaj7'], 'Bb')).toEqual([
      ENABLE_MIN_MODE_MIXTURE ? 'i' : 'iv/V',
      'BD7/V',
      'I/V',
    ]);
  });

  test('| Bbmaj7  | Em7 A7   | Dmaj7  in F', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(['Bbmaj7', 'Em7', 'A7', 'Dmaj7'], 'F'),
    ).toEqual(['IV', 'ii/VI', 'V7/VI', 'I/VI']);
  });

  test('Am7b5 D7 Gmaj7 in Abmaj7', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Am7b5', 'D7', 'Gmaj7'], 'Ab')).toEqual([
      'iiø7/vii',
      'V7/vii',
      'I/VII',
    ]);
  });

  test("Cm7 F7 Bbmaj7 in Gmaj7 (I'll remember April)", () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['Cm7', 'F7', 'Bbmaj7'], 'G')).toEqual([
      'ii/bIII',
      'V7/bIII',
      'I/bIII',
    ]);
  });

  test("G7 Cm7 F7 Bbmaj7 in Gmaj7 (I'll remember April)", () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(romanAnalyzer.analyze(['G7', 'Cm7', 'F7', 'Bbmaj7'], 'G')).toEqual([
      'V7/iv',
      'ii/bIII',
      'V7/bIII',
      'I/bIII',
    ]);
  });

  test('do not use a diatonic chord within a change of key Remember April', () => {
    const romanAnalyzer = new ChordRomanAnalyzer().showAnalysis(true);
    romanAnalyzer.showFunctions(true);
    expect(
      romanAnalyzer.analyze(
        ['F7', 'Bbmaj7', 'Gm7', 'Cm7', 'F7', 'Bbmaj7'],
        'G',
      ),
    ).toEqual(['V7/bIII', 'I/bIII', 'vi/bIII', 'ii/bIII', 'V7/bIII', 'I/bIII']);
  });
});

describe('standards', () => {
  test('stella by starlight', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    // delete all '|' characters
    const chords = standards.stellaByStarlightBars
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '');
    expect(romanAnalyzer.analyze(chords, 'Bb')).toEqual([
      'iiø7/iii',
      'V7/iii',
      'ii',
      'V7',
      'ii/IV',
      'V7/IV',
      'IV',
      'BD7',
      'I',
      'iiø7/iii',
      'V7/iii',
      'iii',
      'iv/V',
      'BD7/V',
      'I/V',
      'iiø7/iii',
      'V7/iii',
      'iiø7/vi',
      'V7/vi',
      'V7/ii',
      'ii',
      'BD7',
      'I',
      'iiø7/iii',
      'V7/iii',
      'iiø7/ii',
      'V7/ii',
      'iiø7/i',
      'V7/i',
      'I',
    ]);
  });

  test('I remember you', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true).showAnalysis(true);
    // delete all '|' characters
    const chords = standards.iRememberYouBars
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '');
    console.log(romanAnalyzer.analyze(chords, 'F'));
    expect(romanAnalyzer.analyze(chords, 'F')).toEqual([
      'I',
      'iiø7/iii',
      'V7/iii',
      'I',
      'ii/IV',
      'V7/IV',
      'IV',
      'iv',
      'BD7',
      'I',
      'ii',
      'V7',
      'I',
      'iiø7/iii',
      'V7/iii',
      'I',
      'ii/IV',
      'V7/IV',
      'IV',
      'iv',
      'BD7',
      'I',
      'ii/IV',
      'V7/IV',
      'IV',
      'ii/VI',
      'V7/VI',
      'I/VI',
      'ii/VI',
      'V7/VI',
      'I/VI',
      'vi',
      'V7/V',
      'I/V',
      'ii',
      'V7',
      'I',
      'iiø7/iii',
      'V7/iii',
      'I',
      'iiø7/ii',
      'V7/ii',
      'ii',
      'iv',
      'BD7',
      'iii',
      'V7/ii',
      'ii',
      'V7',
      'I',
      'V7/ii',
      'ii',
      'V7',
    ]);
  });

  test('All of me', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true).showAnalysis(true);
    // delete all '|' characters
    const chords = standards.allOfMeBars
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '');
    console.log(romanAnalyzer.analyze(chords, 'C'));
    expect(romanAnalyzer.analyze(chords, 'C')).toEqual([
      'I',
      'V7/vi',
      'V7/ii',
      'ii',
      'V7/vi',
      'vi',
      'V7/V',
      'ii',
      'V7',
      'I',
      'V7/vi',
      'V7/ii',
      'ii',
      'IV',
      'iv',
      'I',
      'iiø7/ii',
      'V7/ii',
      'ii',
      'V7',
      'I',
      'viio7/iii',
      'ii',
      'V7',
    ]);
  });

  test('the days of wine and roses', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    // delete all '|' characters
    const chords = standards.theDaysOfWineAndRosesBars
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '');
    console.log(romanAnalyzer.analyze(chords, 'F'));
    expect(romanAnalyzer.analyze(chords, 'F')).toEqual([
      'I',
      'BD7',
      'iii',
      'V7/ii',
      'ii',
      'iv',
      'BD7',
      'iii',
      'vi',
      'ii',
      'V7',
      'iiø7/vi',
      'V7/vi',
      'vi',
      'V7/V',
      'ii',
      'V7',
      'I',
      'BD7',
      'iii',
      'V7/ii',
      'ii',
      'iv',
      'BD7',
      'iii',
      'vi',
      'iiø7/iii',
      'V7/iii',
      'iii',
      'vi',
      'ii',
      'V7',
      'I',
      'ii',
      'V7',
    ]);
  });

  test('all of me', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    const chords = standards.allOfMeBars
      .replace(/\|/g, '')
      .split(' ')
      .filter((chord) => chord !== '');
    console.log(romanAnalyzer.analyze(chords, 'C'));
    expect(romanAnalyzer.analyze(chords, 'C')).toEqual([
      'I',
      'V7/vi',
      'V7/ii',
      'ii',
      'V7/vi',
      'vi',
      'V7/V',
      'ii',
      'V7',
      'I',
      'V7/vi',
      'V7/ii',
      'ii',
      'IV',
      'iv',
      'I',
      'iiø7/ii',
      'V7/ii',
      'ii',
      'V7',
      'I',
      'viio7/iii',
      'ii',
      'V7',
    ]);
  });

  test('you stepped out of a dream first 16 bars', () => {
    const romanAnalyzer = new ChordRomanAnalyzer();
    romanAnalyzer.showFunctions(true);
    // delete all '|' characters
    const chords = standards.yourSteppedBars1
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
      'ii/IV',
      'V7/IV',
      'IV',
      'vi',
      'V7/V',
      'tt/V',
      'TT7/V',
      'ii',
      'V7',
    ]);
  });
});

describe('getScale', () => {
  test('F major', () => {
    expect(getScale('F')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F']);
  });
});
