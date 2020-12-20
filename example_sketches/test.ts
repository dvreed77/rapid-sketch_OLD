import { canvasSketch } from "../main";

canvasSketch(
  () => {
    return ({ context, width, height }) => {
      context.fillStyle = "green";
      context.arc(100, 100, 50, 0, 2 * Math.PI);
      context.fill();
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
    dimensions: [1000, 1000],
    name: "test",
  }
);
