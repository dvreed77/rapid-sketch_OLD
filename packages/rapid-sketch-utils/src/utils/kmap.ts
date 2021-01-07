import { fromTriangles, applyToPoints } from "transformation-matrix";
import * as d3 from "d3";
import { find, zipObject } from "lodash";
import { polygonHull } from "d3-polygon";

const SQRT_3 = Math.sqrt(3);
const isOdd = (d: number) => !!(d % 2);

function* GridGenerator(nCols: number, nRows: number) {
  // See page 68 of notes
  let cStart: number, cEnd: number;
  if (isOdd(nCols)) {
    cStart = -(nCols + 1) / 2;
    cEnd = (nCols + 1) / 2 - 1;
  } else {
    cStart = -nCols / 2 - 1;
    cEnd = nCols / 2;
  }

  let rStart: number, rEnd: number;
  if (isOdd(nRows)) {
    rStart = -(nRows + 1) / 2 + 1;
    rEnd = (nRows + 1) / 2;
  } else {
    rStart = -nRows / 2;
    rEnd = nRows / 2;
  }

  let idx = 0;
  for (let i = cStart; i <= cEnd; i++) {
    for (let j = rStart; j <= rEnd; j++) {
      yield [idx, i, j];
      idx++;
    }
  }
}

// Using https://github.com/chrvadala/transformation-matrix for transformations
export class KGrid {
  kPoints: KPoint[] = [];
  centers: KPoint[] = [];
  width: number;
  height: number;
  lines: any[] = [];
  qTree: d3.Quadtree<KPoint>;
  F: number;
  H: number;
  G: number;
  HEX_W: number;
  N_HEX_COLS: number;
  N_HEX_ROWS: number;

  constructor() {
    const qTree = d3
      .quadtree<KPoint>()
      .x((d) => d.x)
      .y((d) => d.y);

    this.qTree = qTree;
  }

  intitialize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.setup();
  }

  setup() {
    this.F = 20;
    this.H = 2 * this.F;
    this.G = SQRT_3 * this.F;

    this.HEX_W = 2 * this.G;
    this.N_HEX_COLS = Math.ceil(this.width / this.HEX_W);
    this.N_HEX_ROWS = Math.ceil(this.height / (this.F + this.H));

    this.genGrid();
  }

  createKPoint(kPoint) {
    if (Array.isArray(kPoint) && kPoint.length === 4) {
      kPoint = zipObject(["ant", "bat", "cat", "dog"], kPoint);
    }
    return find(this.kPoints, kPoint);
  }

  genGrid() {
    const kPoints = [];
    const lines = [];

    for (const [idx, i, j] of GridGenerator(this.N_HEX_COLS, this.N_HEX_ROWS)) {
      let x0, ant, bat;
      if (isOdd(j)) {
        x0 = i * this.HEX_W + this.HEX_W / 2;
        ant = (j + 1) / 2 + i;
        bat = (1 - j) / 2 + i;
      } else {
        x0 = i * this.HEX_W;
        ant = j / 2 + i;
        bat = i - j / 2;
      }

      for (let d = 0; d < 6; d++) {
        const cat = j;
        const dog = d;

        const y0 = j * (this.F + this.H);

        let dx, dy;
        if (d === 0) {
          dx = 0;
          dy = 0;
        } else {
          const angle = ((-30 * d + 150) * Math.PI) / 180;
          if (isOdd(d)) {
            dx = this.G * Math.cos(angle);
            dy = -this.G * Math.sin(angle);
          } else {
            dx = this.H * Math.cos(angle);
            dy = -this.H * Math.sin(angle);
          }
        }

        const xD = x0 + dx;
        const yD = y0 + dy;

        const kPt = new KPoint({
          idx: `${idx}.${d}`,
          i,
          j,
          x: xD,
          y: yD,
          ant,
          bat,
          cat,
          dog,
          kgrid: this,
        });

        if (d === 0) {
          this.centers.push(kPt);
        }

        kPoints.push(kPt);

        // Gen Spokes
        for (let d = 0; d < 12; d++) {
          const angle = (d * 2 * Math.PI) / 12;

          let dx, dy;

          if (d % 2) {
            dx = this.H * Math.cos(angle);
            dy = -this.H * Math.sin(angle);
          } else {
            dx = this.G * Math.cos(angle);
            dy = -this.G * Math.sin(angle);
          }

          lines.push([
            [x0, y0],
            [x0 + dx, y0 + dy],
          ]);
        }

        // Gen Edges
        // See Page 60 of notes
        for (let d = 0; d < 6; d++) {
          const angle1 = ((-30 * d + 150) * Math.PI) / 180;
          const angle2 = ((-30 * (d + 1) + 150) * Math.PI) / 180;

          let dx1, dy1, dx2, dy2;

          if (d % 2) {
            dx1 = this.G * Math.cos(angle1);
            dy1 = -this.G * Math.sin(angle1);
            dx2 = this.H * Math.cos(angle2);
            dy2 = -this.H * Math.sin(angle2);
          } else {
            dx1 = this.H * Math.cos(angle1);
            dy1 = -this.H * Math.sin(angle1);
            dx2 = this.G * Math.cos(angle2);
            dy2 = -this.G * Math.sin(angle2);
          }

          lines.push([
            [x0 + dx1, y0 + dy1],
            [x0 + dx2, y0 + dy2],
          ]);
        }
      }
    }

    this.qTree.addAll(kPoints);
    this.kPoints = kPoints;
    this.lines = lines;
  }

  getGrid() {
    return {
      pts: this.kPoints,
      lines: this.lines,
    };
  }
}

export class KPoint {
  idx: string;
  i: number;
  j: number;
  x: number;
  y: number;
  ant: number;
  bat: number;
  cat: number;
  dog: number;
  kgrid: KGrid;

  constructor(
    init: Required<Omit<KPoint, "rotate" | "translate" | "neighbors">>
  ) {
    Object.assign(this, init);
  }
  rotate(rotationAngle: number) {
    const { x, y } = this;

    const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const angle = Math.atan2(y, x);
    const newAngle = angle + rotationAngle;

    const newX = r * Math.cos(newAngle);
    const newY = r * Math.sin(newAngle);

    return this.kgrid.qTree.find(newX, newY);
  }

  translate({ dAnt = 0, dBat = 0, dCat = 0, dDog = 0 }) {
    const { ant, bat, cat, dog } = this;

    return this.kgrid.createKPoint({
      ant: ant + dAnt,
      bat: bat + dBat,
      cat: cat + dCat,
      dog: dog + dDog,
    });
  }

  neighbors() {
    const neighbors: KPoint[] = [];
    for (let d = 0; d < 12; d++) {
      const angle = (d * 2 * Math.PI) / 12;

      let dx, dy;

      const { H, G } = this.kgrid;

      if (d % 2) {
        dx = H * Math.cos(angle);
        dy = H * Math.sin(angle);
      } else {
        dx = G * Math.cos(angle);
        dy = G * Math.sin(angle);
      }

      neighbors.push(this.kgrid.qTree.find(this.x + dx, this.y + dy));
    }

    return neighbors;
  }
}

export class KPolygon {
  kPoints: KPoint[] = [];
  color: KPolygonGroup;
  constructor(kPoints: KPoint[], color: KPolygonGroup) {
    this.kPoints = kPoints;
    this.color = color;
  }

  tMat() {
    const hull1 = this.color.hull;
    const hull2 = this.kPoints;

    // get transMatrix from hull1 to hull2
    const triangle1: [number, number][] = hull1
      .slice(0, 3)
      .map((d) => [d.x, d.y]);
    const triangle2: [number, number][] = hull2
      .slice(0, 3)
      .map((d) => [d.x, d.y]);
    return fromTriangles(triangle1, triangle2);
  }

  copy() {
    return new KPolygon(this.kPoints, this.color);
  }

  rotate(rotationAngle) {
    this.kPoints = this.kPoints.map((d) => d.rotate(rotationAngle));
    return this;
  }

  translate(translation) {
    this.kPoints = this.kPoints.map((d) => d.translate(translation));
    return this;
  }

  position({ ant, bat, cat }) {
    const dAnt = ant - this.kPoints[0].ant;
    const dBat = bat - this.kPoints[0].bat;
    const dCat = cat - this.kPoints[0].cat;

    this.kPoints = this.kPoints.map((kPt) =>
      kPt.translate({ dAnt, dBat, dCat })
    );

    return this;
  }

  center() {
    const aMin = Math.min(...this.kPoints.map((d) => d.ant));
    const bMin = Math.min(...this.kPoints.map((d) => d.bat));
    const cMin = Math.min(...this.kPoints.map((d) => d.cat));

    const aMax = Math.max(...this.kPoints.map((d) => d.ant));
    const bMax = Math.max(...this.kPoints.map((d) => d.bat));
    const cMax = Math.max(...this.kPoints.map((d) => d.cat));

    this.kPoints = this.kPoints.map((d) =>
      d.translate({
        dAnt: -(aMin + aMax) / 2,
        dBat: -(bMin + bMax) / 2,
        dCat: -(cMin + cMax) / 2,
      })
    );
    return this;
  }

  pathString(tMat) {
    var path = d3.path();

    const points: [number, number][] = this.kPoints.map((d) => [d.x, d.y]);

    const newPoints = tMat ? applyToPoints(tMat, points) : points;

    if (newPoints.length) {
      path.moveTo(newPoints[0][0], newPoints[0][1]);
      newPoints.forEach(([x, y]) => path.lineTo(x, y));
      path.closePath();
    }

    return path.toString();
  }
}

export class KPolygonGroup {
  kPolygons: KPolygon[] = [];
  hull: KPoint[];
  constructor(kPolygons: KPolygon[] = [], hull: KPoint[] = []) {
    this.kPolygons = kPolygons;
    this.hull = hull;
  }

  add(kPolygon) {
    this.kPolygons.push(kPolygon);
  }

  copy() {
    return new KPolygonGroup(this.kPolygons.map((kP) => kP.copy()));
  }

  rotate(rotationAngle) {
    this.kPolygons = this.kPolygons.map((kP) => kP.rotate(rotationAngle));
    return this;
  }

  hullString() {
    const pts = this.kPolygons.flatMap((kPolygon) =>
      kPolygon.kPoints.map((kPoint) => kPoint)
    );

    const hull = polygonHull(pts.map((kPoint) => [kPoint.x, kPoint.y]));

    console.log(
      pts,
      hull,
      pts.find((pt) => pt.idx === "96.0")
    );

    var path = d3.path();

    if (this.hull.length) {
      path.moveTo(this.hull[0].x, this.hull[0].y);
      this.hull.forEach((kP) => path.lineTo(kP.x, kP.y));
      path.closePath();
    }

    return path.toString();
  }

  translate(translation) {
    this.kPolygons = this.kPolygons.map((kP) => kP.translate(translation));
    return this;
  }
}
