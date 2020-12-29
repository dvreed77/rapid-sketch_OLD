import React, { useEffect, useRef } from "react";
import { useWindowSize } from "./hooks/useWindowResize";
import { convertDistance } from "./utils/convertDistance";

export function Canvas({ width, height, setCanvasProps, contextType }) {
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
    if (styleWidth > maxWidth || styleHeight > maxHeight) {
      if (windowAspect > aspect) {
        styleHeight = maxHeight;
        styleWidth = Math.round(styleHeight * aspect);
      } else {
        styleWidth = maxWidth;
        styleHeight = Math.round(styleWidth / aspect);
      }
    }

    const pixelRatio = window.devicePixelRatio;

    // Calculate Canvas Width
    let canvasWidth = Math.round(pixelRatio * styleWidth);
    let canvasHeight = Math.round(pixelRatio * styleHeight);

    // Calculate Scale
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;

    canvasRef.current.width = canvasWidth;
    canvasRef.current.height = canvasHeight;

    canvasRef.current.style.width = `${styleWidth}px`;
    canvasRef.current.style.height = `${styleHeight}px`;

    const viewportWidth = Math.round(styleWidth);
    const viewportHeight = Math.round(styleHeight);

    const context = canvasRef.current.getContext(contextType || "2d");

    setCanvasProps({
      canvas: canvasRef.current,
      context,
      width: canvasWidth,
      height: canvasHeight,
      viewportWidth,
      viewportHeight,
      pixelRatio,
    });
  }, [windowWidth, windowHeight]);

  return <canvas ref={canvasRef}></canvas>;
}
