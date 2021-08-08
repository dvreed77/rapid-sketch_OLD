import { canvasSketch } from "rapid-sketch";
import { random } from "rapid-sketch-utils";

const scale = 10;

const WIDTH = 166.5 * scale;
const HEIGHT = 244 * scale;
const w = 8 * scale;
const h = 2 * scale;

const colors = [
  { value: "#D3D8DB", weight: 800 }, //white
  { value: "#87181C", weight: 200 }, //red
  { value: "#8EBBD2", weight: 200 }, //lightblue
  { value: "#02444A", weight: 200 }, //green
  { value: "#0C1632", weight: 200 }, //darkblue
  { value: "#35151B", weight: 200 }, //plum
  { value: "#E1982D", weight: 200 }, //yellow orange
  { value: "#D8D49C", weight: 100 }, //sunflower
];

function drawPattern(
  context: CanvasRenderingContext2D,
  horizontal = true,
  x = 0,
  y = 0,
  cOffset = 0
) {
  for (let i = 0; i < 4; i++) {
    // context.fillStyle = random.weightedSet(colors)
    context.fillStyle = colors[i + cOffset].value;
    context.strokeStyle = "white";
    context.lineWidth = 2;

    context.beginPath();
    if (horizontal) {
      context.rect(i * h + x, i * h + y, w, h);
    } else {
      context.rect(i * h + x, i * h + y, h, w);
    }
    context.fill();
    context.stroke();
  }
}

canvasSketch(
  () => {
    return ({ context, width, height }) => {
      const nCols = Math.floor(WIDTH / w);
      const nRows = Math.floor(HEIGHT / (4 * w));

      // drawPattern(context, true, 0, 0)
      // drawPattern(context, false, 0, h)
      // drawPattern(context, false, 4*h, -3*h)
      // drawPattern(context, true, 8*h, 0)

      for (let j = 0; j < nRows + 1; j++) {
        const yOffset = j * 4 * w;
        for (let i = 0; i < nCols / 2 + 1; i++) {
          drawPattern(context, true, 8 * i * h, yOffset);
          drawPattern(context, false, 8 * i * h, yOffset + h);
          drawPattern(context, false, (8 * i + 4) * h, yOffset - 3 * h);
          drawPattern(context, true, 8 * i * h + w, yOffset + w);
        }

        for (let i = 0; i < nCols / 2 + 1; i++) {
          drawPattern(context, true, 8 * i * h, yOffset + 2 * w, 4);
          drawPattern(context, false, 8 * i * h, yOffset + h + 2 * w, 4);
          drawPattern(
            context,
            false,
            (8 * i + 4) * h,
            yOffset + -3 * h + 2 * w,
            4
          );
          drawPattern(context, true, 8 * i * h + w, yOffset + 2 * w + w, 4);
        }
      }

      return [
        // {
        //   data: "adas",
        //   ext: ".svg",
        // },
        // {
        //   data: JSON.stringify({ dave: "reed" }),
        //   ext: ".json",
        // },
      ];
    };
  },
  {
    dimensions: [WIDTH, HEIGHT],
    name: "test",
  }
);
