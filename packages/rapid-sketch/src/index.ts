import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import "./styles/index.css";

enum Unit {
  mm = "mm",
  cm = "cm",
  m = "m",
  pc = "pc",
  pt = "pt",
  in = "in",
  ft = "ft",
  px = "px",
}
export type T_ContextType = "2d" | "webgl";

export type T_UNITS = keyof typeof Unit;

export type ObjectType<T> = T extends "2d"
  ? CanvasRenderingContext2D
  : T extends "webgl"
  ? WebGLRenderingContext
  : never;

export interface ISketch<T extends T_ContextType> {
  context: ObjectType<T>;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
  units: T_UNITS;
  time: number;
  frame: number;
  pixelRatio: number;
}

export interface ISettings<T extends T_ContextType> {
  dimensions: [number, number];
  units?: T_UNITS;
  pixelsPerInch?: number;
  name: string;
  animation?: boolean;
  totalFrames?: number;
  context?: T;
  pixelated?: boolean;
  autoRepeat?: boolean;
  autoPlay?: boolean;
  duration?: number;
}

export function canvasSketch<T extends T_ContextType = "2d">(
  sketch: (d: ISketch<T>) => (arg0: ISketch<T>) => any,
  settings: ISettings<T>
) {
  const defaultSettings: Required<ISettings<T>> = {
    dimensions: [window.innerWidth, window.innerHeight],
    units: "px",
    pixelsPerInch: 72,
    name: "sketch",
    animation: false,
    totalFrames: 500,
    context: "2d" as T,
    pixelated: false,
    autoRepeat: true,
    autoPlay: true,
    duration: NaN,
  };

  function renderApp() {
    const rapidSketchSettings: Required<ISettings<T>> = {
      ...defaultSettings,
      ...settings,
    };
    render(
      React.createElement(App, { sketch, settings: rapidSketchSettings }),
      document.getElementById("root")
    );
  }
  renderApp();
}
