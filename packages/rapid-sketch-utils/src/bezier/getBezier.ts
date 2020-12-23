import { lineBezierIntersection } from "./lineBezierIntersection";
import { splitBezier } from "./splitBezier";

export function getBezier([l1, l2], bez, bottom = true) {
  const a1 = Math.atan2(l1[1][1] - l1[0][1], l1[1][0] - l1[0][0]);
  const a2 = Math.atan2(l2[1][1] - l2[0][1], l2[1][0] - l2[0][0]);

  if (bottom) {
    if (a2 > a1) {
      const { ts: tsA } = lineBezierIntersection(l2, bez);
      const { bezB } = splitBezier(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l1, bezB);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezB: bezD } = splitBezier(bezB, z);

      return bezD;
    } else {
      const { ts: tsA } = lineBezierIntersection(l1, bez);
      const { bezB } = splitBezier(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l2, bezB);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezB: bezD } = splitBezier(bezB, z);

      return bezD;
    }
  } else {
    if (a2 < a1) {
      const { ts: tsA } = lineBezierIntersection(l2, bez);
      const { bezA } = splitBezier(bez, tsA[1]);
      const { ts: tsB } = lineBezierIntersection(l1, bezA);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezA: bezC } = splitBezier(bezA, z);

      return bezC;
    } else {
      const { ts: tsA } = lineBezierIntersection(l1, bez);
      const { bezA } = splitBezier(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l2, bezA);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezA: bezC } = splitBezier(bezA, z);

      return bezC;
    }
  }
}
