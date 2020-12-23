import { drawPath } from "./drawPath";

export function drawExtent(
  context: CanvasRenderingContext2D,
  extent: PointType[],
  options
) {
  drawPath(
    context,
    [
      [extent[0][0], extent[0][1]],
      [extent[1][0], extent[0][1]],
      [extent[1][0], extent[1][1]],
      [extent[0][0], extent[1][1]],
    ],
    {
      ...options,
      closePath: true,
    }
  );
}
