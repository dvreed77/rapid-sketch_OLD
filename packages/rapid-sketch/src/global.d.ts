type T_UNITS = "mm" | "cm" | "m" | "pc" | "pt" | "in" | "ft" | "px";
interface ISketch {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  units: T_UNITS;
  deltaTime: number;
  frame: number;
}

interface ISettings {
  dimensions?: [number, number];
  units?: T_UNITS;
  pixelsPerInch?: number;
  name: string;
  animation?: boolean;
  totalFrames?: number;
  context?: string;
}
