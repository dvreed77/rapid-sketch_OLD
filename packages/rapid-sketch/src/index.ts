import { SketchManager } from "./SketchManager";
import { T_UNITS } from "./utils/convertDistance";
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

import { App } from "./App";

// export * from "./utils/convertDistance";
// export * from "./utils/defined";

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

export function canvasSketch(
  sketch: () => (arg0: ISketch) => any,
  settings: ISettings
) {
  // const manager = new SketchManager(sketch, settings);

  // manager.setup();

  ReactDOM.render(
    React.createElement(App, { sketch, settings }),
    document.getElementById("root")
  );
  // manager.render();
  // manager.play();
}

// function save(text) {
//   const blob = new Blob([text], { type: "image/svg+xml" });

//   const link = document.createElement("a");
//   link.style.visibility = "hidden";
//   link.target = "_blank";
//   link.download = "filename";
//   link.href = window.URL.createObjectURL(blob);
//   document.body.appendChild(link);
//   link.onclick = () => {
//     link.onclick = () => {};
//     setTimeout(() => {
//       // window.URL.revokeObjectURL(blob);
//       if (link.parentElement) link.parentElement.removeChild(link);
//       link.removeAttribute("href");
//       // resolve({ filename, client: false });
//     });
//   };
//   link.click();
// }

// index.tsx
