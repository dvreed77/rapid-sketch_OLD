import * as math from "mathjs";

export function splitBezier(bez, z) {
  // https://pomax.github.io/bezierinfo/#matrixsplit
  const mat1 = [
    [1, 0, 0],
    [-(z - 1), z, 0],
    [Math.pow(z - 1, 2), -2 * (z - 1) * z, z * z],
  ];

  const bezA = math.multiply(mat1, [bez[2], bez[1], bez[0]]);

  const mat2 = [
    [Math.pow(z - 1, 2), -2 * (z - 1) * z, z * z],
    [0, -(z - 1), z],
    [0, 0, 1],
  ];

  const bezB = math.multiply(mat2, [bez[2], bez[1], bez[0]]);

  return { bezA, bezB };
}
