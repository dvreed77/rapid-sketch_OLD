import { T_UNITS, convertDistance } from "./utils/convertDistance";
import { ISettings } from "./main";
// import { createBlobFromDataURL, saveBlob } from "./utils";
// import mime from "mime-types";
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

export class SketchManager {
  //   dimensions: [number, number];
  //   units: T_UNITS = "px";
  //   pixelsPerInch = 72;
  //   name = "UNK";
  //   context: CanvasRenderingContext2D;
  //   renderOuput: any;

  sketch: any;

  //   private _raf: number;
  //   private _lastTime: number;
  //   private _animateHandler: any;

  //   playing = false;

  //   deltaTime: number;
  //   time: number = 0;
  //   playhead: number;
  //   frame: number;

  constructor(sketch: any, settings: ISettings) {
    this.sketch = sketch;
    //     Object.assign(this, settings);
    //     this._animateHandler = () => this.animate();
  }

  setup() {
    // ReactDOM.render(
    //   React.createElement(App, { sketch: this.sketch }),
    //   document.getElementById("root")
    // );
    //     const [width, height] = this.dimensions;
    //     document.title = `${this.name} | RapidSketch`;
    //     const realWidth = convertDistance(width, this.units, "px", {
    //       pixelsPerInch: this.pixelsPerInch,
    //       precision: 4,
    //     });
    //     const realHeight = convertDistance(height, this.units, "px", {
    //       pixelsPerInch: this.pixelsPerInch,
    //       precision: 4,
    //     });
    //     // Calculate Canvas Style Size
    //     const [parentWidth, parentHeight] = [window.innerWidth, window.innerHeight];
    //     let styleWidth = Math.round(realWidth);
    //     let styleHeight = Math.round(realHeight);
    //     const aspect = width / height;
    //     const windowAspect = parentWidth / parentHeight;
    //     const scaleToFitPadding = 40;
    //     const maxWidth = Math.round(parentWidth - scaleToFitPadding * 2);
    //     const maxHeight = Math.round(parentHeight - scaleToFitPadding * 2);
    //     if (styleWidth > maxWidth || styleHeight > maxHeight) {
    //       if (windowAspect > aspect) {
    //         styleHeight = maxHeight;
    //         styleWidth = Math.round(styleHeight * aspect);
    //       } else {
    //         styleWidth = maxWidth;
    //         styleHeight = Math.round(styleWidth / aspect);
    //       }
    //     }
    //     // Calculate Canvas Width
    //     let canvasWidth = Math.round(2 * realWidth);
    //     let canvasHeight = Math.round(2 * realHeight);
    //     // Calculate Scale
    //     const scaleX = canvasWidth / width;
    //     const scaleY = canvasHeight / height;
    //     // Get Canvas Element and adjust all sizing
    //     const canvas = document.getElementsByTagName("canvas").item(0);
    //     const context = canvas.getContext("2d");
    //     canvas.width = canvasWidth;
    //     canvas.height = canvasHeight;
    //     canvas.style.width = `${styleWidth}px`;
    //     canvas.style.height = `${styleHeight}px`;
    //     context.scale(scaleX, scaleY);
    //     this.context = context;
    //     const handler = (ev) => {
    //       ev.preventDefault();
    //       // if (!opt.enabled()) return;
    //       if (ev.keyCode === 32) {
    //         this.playing = !this.playing;
    //         this.play();
    //       }
    //       if (ev.keyCode === 83 && !ev.altKey && (ev.metaKey || ev.ctrlKey)) {
    //         // Cmd + S
    //         console.log("SAVE Dave");
    //         // Save Canvas
    //         const dataURL = canvas.toDataURL();
    //         createBlobFromDataURL(dataURL).then((blob: any) => {
    //           saveBlob(blob, this.name);
    //         });
    //         if (this.renderOuput) {
    //           this.renderOuput.forEach(({ data, ext }) => {
    //             const blob = new Blob([data], { type: mime.lookup(ext) as string });
    //             saveBlob(blob, this.name);
    //           });
    //         }
    //       }
    //     };
    //     window.addEventListener("keydown", handler);
    //     window.addEventListener("resize", () => console.log("resize"));
    //     return context;
  }

  //   mount() {}

  //   render() {
  //     this.renderOuput = this.sketch()({
  //       context: this.context,
  //       width: this.dimensions[0],
  //       height: this.dimensions[1],
  //       units: this.units,
  //       deltaTime: this.deltaTime,
  //     });
  //   }

  //   play() {
  //     this._lastTime = performance.now();
  //     this._raf = window.requestAnimationFrame(this._animateHandler);
  //   }

  //   animate() {
  //     if (!this.playing) return;
  //     this._raf = window.requestAnimationFrame(this._animateHandler);

  //     const now = performance.now();

  //     const deltaTimeMS = now - this._lastTime;
  //     this._lastTime = now;

  //     this.deltaTime = deltaTimeMS / 1000;

  //     this.time = this.time + this.deltaTime;

  //     this.render();
  //   }
}
