import { assertThat } from "./util";

const keyCircle = [
  'I', // 0 distance 0
  'IV', // 1 distance 1
  'V', // 2 distance 1
  'bVII', // 3 distance 3
  'II', // 4 distance 3
  'bIII',
  'VI',
  'bVI',
  'III',
  'bII',
  'VII',
  'bV',
];
const minorKeyCircle = [
  'vi',
  'ii',
  'iii',
  'v',
  'vii',
  'i',
  'bv',
  'iv',
  'bii',
  'bvii',
  'bvi',
  'biii',
];


function distanceFromIInCircle(key: string, circle: string[]): number {
  const index = circle.indexOf(key);
  assertThat(index >= 0, `key ${key} not found in keyCircle`);
  if (index == 0) return 0;
  if (index % 2 == 0) return index - 1;
  return index;
}

export function distanceFromI(key: string): number {
  return distanceFromIInCircle(key, keyCircle);
}

export function distanceFromIInMinor(key: string): number {
  return distanceFromIInCircle(key, minorKeyCircle);
}

export function toMinorKey(key: string) : string {
  return key.toLowerCase();
}
