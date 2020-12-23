export function drawBezierPolygon(context, b1, b2, options_) {
  const options = {
    fill: "red",
    ...options_,
  };

  context.beginPath();
  context.moveTo(b1[2][0], b1[2][1]);
  context.quadraticCurveTo(b1[1][0], b1[1][1], b1[0][0], b1[0][1]);
  context.lineTo(b2[0][0], b2[0][1]);
  context.quadraticCurveTo(b2[1][0], b2[1][1], b2[2][0], b2[2][1]);
  context.closePath();
  context.fillStyle = options.fill;
  context.fill();
}
