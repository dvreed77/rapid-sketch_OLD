import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import "./styles/index.css";

export type T_UNITS = "mm" | "cm" | "m" | "pc" | "pt" | "in" | "ft" | "px";
export interface ISketch {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  units: T_UNITS;
  deltaTime: number;
  frame: number;
}

export interface ISettings {
  dimensions?: [number, number];
  units?: T_UNITS;
  pixelsPerInch?: number;
  name: string;
  animation?: boolean;
  totalFrames?: number;
  context?: string;
  pixelated?: boolean;
}

export function canvasSketch(
  sketch: (d: ISketch) => (arg0: ISketch) => any,
  settings: ISettings
) {
  function renderApp() {
    render(
      React.createElement(App, { sketch, settings }),
      document.getElementById("root")
    );
  }
  renderApp();
}
