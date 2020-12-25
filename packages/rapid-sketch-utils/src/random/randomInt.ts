import { randomFloat } from "./randomFloat";

export function randomInt(min: number, max: number) {
  return Math.floor(randomFloat(min, max + 1));
}
