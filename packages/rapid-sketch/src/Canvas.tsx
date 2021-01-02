import React, { useEffect, useRef } from "react";
import { ISettings } from "./index";
import { useWindowSize } from "./hooks/useWindowResize";
import { convertDistance } from "./utils/convertDistance";

interface IProps {
  width: number;
  height: number;
  setCanvasProps: any;
  contextType: any;
  settings: ISettings;
}

export function Canvas({
  width,
  height,
  setCanvasProps,
  contextType,
  settings,
}: IProps) {
  const canvasRef = useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();

  useEffect(() => {
    const units = "px";
    const pixelsPerInch = 72;
    const realWidth = convertDistance(width, units, "px", {
      pixelsPerInch,
      precision: 4,
    });
    const realHeight = convertDistance(height, units, "px", {
      pixelsPerInch,
      precision: 4,
    });
    // Calculate Canvas Style Size
    let styleWidth = Math.round(realWidth);
    let styleHeight = Math.round(realHeight);
    const aspect = width / height;
    const windowAspect = windowWidth / windowHeight;
    const scaleToFitPadding = 40;
    const maxWidth = Math.round(windowWidth - scaleToFitPadding * 2);
    const maxHeight = Math.round(windowHeight - scaleToFitPadding * 2);
    // if (styleWidth > maxWidth || styleHeight > maxHeight) {
    if (windowAspect > aspect) {
      styleHeight = maxHeight;
      styleWidth = Math.round(styleHeight * aspect);
    } else {
      styleWidth = maxWidth;
      styleHeight = Math.round(styleWidth / aspect);
    }
    // }

    const pixelRatio = window.devicePixelRatio;

    // Calculate Canvas Width
    let canvasWidth = Math.round(pixelRatio * styleWidth);
    let canvasHeight = Math.round(pixelRatio * styleHeight);

    // Calculate Scale
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;

    const canvas = canvasRef.current;

    canvas.width = realWidth;
    canvas.height = realHeight;

    canvas.style.width = `${styleWidth}px`;
    canvas.style.height = `${styleHeight}px`;

    const viewportWidth = Math.round(realWidth);
    const viewportHeight = Math.round(realHeight);

    const context = canvas.getContext(contextType || "2d");

    if (settings.pixelated) {
      context.imageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.oImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      canvas.style["image-rendering"] = "pixelated";
    }

    setCanvasProps({
      canvas: canvasRef.current,
      context,
      width: viewportWidth,
      height: viewportHeight,
      viewportWidth,
      viewportHeight,
      pixelRatio,
    });
  }, [windowWidth, windowHeight]);

  return <canvas ref={canvasRef}></canvas>;
}
