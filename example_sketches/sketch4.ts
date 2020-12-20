import { canvasSketch, ISettings } from "../main";
import { drawPath, map } from "rapid-sketch-util";
import * as d3 from "d3";

const settings: ISettings = {
  dimensions: [2000, 2000],
  name: "sketch2",
};

function genPolygon(nSides: number, radius: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i < nSides; i++) {
    const angle = (i / nSides) * 2 * Math.PI;
    pts.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return pts;
}

function draw(context: CanvasRenderingContext2D) {
  const nOffsets = 100;

  const lineWidthScale = d3
    .scalePow()
    .exponent(1 / 2)
    .domain([0, nOffsets])
    .range([30, 1]);

  const offsetScale = d3
    .scalePow()
    .exponent(0.9)
    .domain([0, nOffsets])
    .range([100, 5000]);

  for (let i = 0; i < nOffsets; i++) {
    const polygonPts = genPolygon(3, offsetScale(i));
    context.rotate(Math.PI * -0.004);
    drawPath(context, polygonPts, {
      strokeColor: "#219ebc",
      lineWidth: lineWidthScale(i),
      closePath: true,
      fillColor: null,
    });
  }
}

canvasSketch(() => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.save();

    context.globalCompositeOperation = "multiply";
    context.translate(300, 1700);

    draw(context);
    context.restore();
  };
}, settings);
