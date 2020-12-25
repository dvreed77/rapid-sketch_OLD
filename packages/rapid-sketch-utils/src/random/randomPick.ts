import { randomInt } from "./randomInt";

export function randomPick(array: any[]) {
  return array[randomInt(0, array.length - 1)];
}
