import { canvasSketch } from "../main";
// import {lerp} from 'canvas-sketch-util/math'
import { lerp, rangeFloor, random, color } from "rapid-sketch-util";

canvasSketch(
  () => {
    const palette = random.randomPick(color.palettes);
    function createGrid() {
      const steps = 6;
      const points = [];
      for (let i = 0; i < steps; i++) {
        for (let j = 0; j < steps; j++) {
          const u = i / (steps - 1);
          const v = j / (steps - 1);
          points.push({
            position: [u, v],
          });
        }
      }
      return points;
    }

    return ({ context, width, height }) => {
      const margin = width * 0.1;
      context.fillStyle = "white";
      context.fillRect(0, 0, width, height);

      const points = createGrid();

      // points.forEach((data) => {
      //   const {
      //     position: [u, v],
      //   } = data;

      //   context.beginPath();
      //   context.arc(
      //     lerp(margin, width - margin, u),
      //     lerp(margin, height - margin, v),
      //     10,
      //     0,
      //     2 * Math.PI
      //   );
      //   context.fillStyle = "red";
      //   context.fill();
      // });
      let points2 = [...points];

      const tops = [];
      while (points2.length) {
        const tmp = random.shuffle(points2);
        const [a, b] = tmp.slice(0, 2);
        points2 = [...tmp.slice(2)];
        tops.push([a, b]);
      }

      tops.sort(([a, b], [c, d]) => {
        const y1 = (a.position[1] + b.position[1]) / 2;
        const y2 = (c.position[1] + d.position[1]) / 2;

        return y1 - y2;
      });

      tops.forEach(([a, b]) => {
        const [u1, v1] = a.position;
        const [u2, v2] = b.position;

        context.beginPath();
        context.moveTo(
          lerp(margin, width - margin, u1),
          lerp(margin, width - margin, v1)
        );
        context.lineTo(
          lerp(margin, width - margin, u2),
          lerp(margin, width - margin, v2)
        );

        context.lineTo(
          lerp(margin, width - margin, u2),
          lerp(margin, width - margin, 1)
        );

        context.lineTo(
          lerp(margin, width - margin, u1),
          lerp(margin, width - margin, 1)
        );

        context.closePath();

        context.fillStyle = random.randomPick(palette);
        context.fill();
        context.strokeStyle = "white";
        context.lineWidth = width * 0.02;
        context.stroke();
      });
    };
  },
  {
    dimensions: [1000, 1000],
    name: "test1",
  }
);
