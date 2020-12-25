/*
  Constrain given number N between min and max
*/
export function constrain(n: number, low: number, high: number) {
  return Math.max(Math.min(n, high), low);
}
