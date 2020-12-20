// import { canvasSketch, ISettings } from "rapid-sketch";
import { canvasSketch, ISettings } from "../main";

const settings: ISettings = {
  dimensions: [2000, 2000],
  name: "sketch2",
  animation: true,
  totalFrames: 90,
};

canvasSketch(() => {
  return ({ context, width, height, frame }) => {
    const playhead = frame / 90;
    // Fill the canvas with pink
    context.fillStyle = "pink";
    context.fillRect(0, 0, width, height);

    // Get a seamless 0..1 value for our loop
    const t = Math.sin(playhead * Math.PI);

    // Animate the thickness with 'playhead' prop
    const thickness = Math.max(5, Math.pow(t, 0.55) * width * 0.5);

    // Rotate with PI to create a seamless animation
    const rotation = playhead * Math.PI;

    // Draw a rotating white rectangle around the center
    const cx = width / 2;
    const cy = height / 2;
    const length = height * 0.5;
    context.fillStyle = "white";
    context.save();
    context.translate(cx, cy);
    context.rotate(rotation);
    context.fillRect(-thickness / 2, -length / 2, thickness, length);
    context.restore();
  };
}, settings);
