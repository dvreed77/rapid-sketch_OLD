// import { canvasSketch, ISettings } from "rapid-sketch";
import { throws } from "assert";
import { canvasSketch, ISettings } from "../main";

const settings: ISettings = {
  dimensions: [2000, 2000],
  name: "sketch2",
  animation: true,
  totalFrames: 90,
};

type Point = [number, number];
class Vector {
  x: number;
  y: number;
  angle: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.angle = Math.atan2(this.y, this.x);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  setAngle(angle: number) {
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);
    this.angle = angle;
  }

  normalize() {
    const a = this.angle;
    this.x = Math.cos(a);
    this.y = Math.sin(a);
  }

  setMagnitude(m: number) {
    const a = this.angle;
    this.x = m * Math.cos(a);
    this.y = m * Math.sin(a);
  }

  angleBetween(v: Vector) {
    const d1 = this.magnitude();
    const d2 = v.magnitude();

    const angle = Math.acos((this.x * v.x + this.y * v.y) / (d1 * d2));

    return angle;
  }

  rotate(angle: number) {
    const m = this.magnitude();
    const a1 = this.angle;
    this.x = m * Math.cos(a1 - angle);
    this.y = m * Math.sin(a1 - angle);
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  draw(
    context: CanvasRenderingContext2D,
    { origin = [0, 0], arrow = false, strokeColor = "black" } = {}
  ) {
    context.beginPath();
    context.moveTo(origin[0], origin[1]);
    context.lineTo(origin[0] + this.x, origin[1] + this.y);

    context.lineWidth = 4;
    context.strokeStyle = strokeColor;
    context.stroke();

    if (arrow) {
      context.beginPath();
      context.moveTo(origin[0] + this.x, origin[1] + this.y);
      context.arc(origin[0] + this.x, origin[1] + this.y, 8, 0, 2 * Math.PI);
      context.fillStyle = "green";
      context.fill();
    }
  }
}

function drawLine(context, line) {
  context.beginPath();
  context.moveTo(line[0][0], line[0][1]);

  for (let i = 1; i < line.length; i++) {
    context.lineTo(line[i][0], line[i][1]);
  }

  context.lineWidth = 2;
  context.stroke();
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function draw(context) {
  const poly = [
    [randomRange(-200, 200), randomRange(-200, 200)],
    [randomRange(-200, 200), randomRange(-200, 200)],
    [randomRange(-200, 200), randomRange(-200, 200)],
  ];

  // drawLine(context, poly);

  const v1 = new Vector(poly[0][0] - poly[1][0], poly[0][1] - poly[1][1]);
  const v2 = new Vector(poly[2][0] - poly[1][0], poly[2][1] - poly[1][1]);

  const vCorner = new Vector(1, 1);
  vCorner.setAngle((v1.angle + v2.angle) / 2);
  vCorner.setMagnitude(100);

  // const a = v1.angleBetween(v2);

  // console.log(
  //   (v1.angle * 180) / Math.PI,
  //   (v2.angle * 180) / Math.PI,
  //   (a * 180) / Math.PI
  // );

  // vCorner.rotate(a / 2);

  v1.draw(context, { origin: poly[1], strokeColor: "blue" });
  v2.draw(context, { origin: poly[1], strokeColor: "green" });
  vCorner.draw(context, { origin: poly[1], strokeColor: "red" });

  const v4 = v1.copy();
  v4.rotate(Math.PI / 4);

  const v2a = v2.copy();
  v2a.rotate(-Math.PI / 4);
  const v2b = v2a.copy();

  const v5 = v4.copy();

  const gap = randomRange(2, 40);
  for (let i = 0; i < 100; i++) {
    v5.setMagnitude(i * gap);
    vCorner.setMagnitude(i * gap);
    v2b.setMagnitude(i * gap);

    context.beginPath();

    context.moveTo(v5.x + v1.x, v5.y + v1.y);
    context.lineTo(vCorner.x, vCorner.y);

    context.moveTo(v2b.x + v2.x, v2b.y + v2.y);
    context.lineTo(vCorner.x, vCorner.y);
    context.lineWidth = 0.5;
    context.strokeStyle = "#aaa";
    context.stroke();
  }
}

canvasSketch(() => {
  return ({ context, width, height, frame }) => {
    context.clearRect(0, 0, width, height);
    context.save();

    context.translate(1000, 1000);

    draw(context);
    context.restore();
  };
}, settings);
