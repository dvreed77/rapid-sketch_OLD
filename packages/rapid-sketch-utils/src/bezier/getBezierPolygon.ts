import { getBezier } from "./getBezier";

export function getBezierPolygon([l1, l2], [bez1, bez2]) {
  const b1 = getBezier([l1, l2], bez1);
  const b2 = getBezier([l1, l2], bez2, false);

  return [b1, b2];
}
