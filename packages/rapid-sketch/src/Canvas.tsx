import React, { useEffect, useRef } from "react";
import { convertDistance } from "./utils/convertDistance";

export function Canvas({ width, height, setCanvasProps }) {
  const canvasRef = useRef(null);

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
    const [parentWidth, parentHeight] = [window.innerWidth, window.innerHeight];
    let styleWidth = Math.round(realWidth);
    let styleHeight = Math.round(realHeight);
    const aspect = width / height;
    const windowAspect = parentWidth / parentHeight;
    const scaleToFitPadding = 40;
    const maxWidth = Math.round(parentWidth - scaleToFitPadding * 2);
    const maxHeight = Math.round(parentHeight - scaleToFitPadding * 2);
    if (styleWidth > maxWidth || styleHeight > maxHeight) {
      if (windowAspect > aspect) {
        styleHeight = maxHeight;
        styleWidth = Math.round(styleHeight * aspect);
      } else {
        styleWidth = maxWidth;
        styleHeight = Math.round(styleWidth / aspect);
      }
    }

    // Calculate Canvas Width
    let canvasWidth = Math.round(1 * realWidth);
    let canvasHeight = Math.round(1 * realHeight);

    // Calculate Scale
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;

    canvasRef.current.width = canvasWidth;
    canvasRef.current.height = canvasHeight;

    canvasRef.current.style.width = `${styleWidth}px`;
    canvasRef.current.style.height = `${styleHeight}px`;

    const context = canvasRef.current.getContext("2d");

    setCanvasProps({
      canvas: canvasRef.current,
      context,
      width: canvasWidth,
      height: canvasHeight,
    });

    // context.scale(scaleX, scaleY);

    // render({ context, width, height });
    // sketch()({ context, width, height });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
