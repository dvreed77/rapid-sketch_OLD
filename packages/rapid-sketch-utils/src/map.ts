import { constrain } from "./constrain";

export function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds = false
) {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
}
