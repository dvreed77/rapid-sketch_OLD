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

export type T_UNITS = keyof typeof Unit;

export interface ISketch {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  units: T_UNITS;
  deltaTime: number;
  frame: number;
}

export interface ISettings {
  dimensions: [number, number];
  units?: T_UNITS;
  pixelsPerInch?: number;
  name: string;
  animation?: boolean;
  totalFrames?: number;
  context?: string;
  pixelated?: boolean;
  autoRepeat?: boolean;
  autoPlay?: boolean;
  duration?: number;
}

const defaultSettings: Required<ISettings> = {
  dimensions: [window.innerWidth, window.innerHeight],
  units: "px",
  pixelsPerInch: 72,
  name: "sketch",
  animation: false,
  totalFrames: 500,
  context: "2d",
  pixelated: false,
  autoRepeat: true,
  autoPlay: true,
  duration: NaN,
};

export function canvasSketch(
  sketch: (d: ISketch) => (arg0: ISketch) => any,
  settings: ISettings
) {
  function renderApp() {
    const rapidSketchSettings: Required<ISettings> = {
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
