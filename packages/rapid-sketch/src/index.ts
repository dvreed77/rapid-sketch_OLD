import { T_UNITS } from "./utils/convertDistance";
import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import "./styles/index.css";

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
}
declare const module: any;
export function canvasSketch(
  sketch: () => (arg0: ISketch) => any,
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

module.hot.accept();
