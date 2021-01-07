import React, { useEffect, useRef } from "react";
import { ISettings, ObjectType, T_ContextType } from "./index";
import { useWindowSize } from "./hooks/useWindowResize";
import { convertDistance } from "./utils/convertDistance";
import { ICanvasProps } from "./App";

interface IProps<T extends T_ContextType> {
  width: number;
  height: number;
  setCanvasProps: React.Dispatch<
    React.SetStateAction<ICanvasProps<T> | undefined>
  >;
  contextType: T;
  settings: ISettings<T>;
}

function getContext<T extends T_ContextType>(
  canvas: HTMLCanvasElement,
  type: T
): ObjectType<T> {
  return canvas.getContext(type) as ObjectType<T>;
}

export function Canvas<T extends T_ContextType>({
  width,
  height,
  setCanvasProps,
  contextType,
  settings,
}: IProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    if (!canvas) return;

    canvas.width = realWidth;
    canvas.height = realHeight;

    canvas.style.width = `${styleWidth}px`;
    canvas.style.height = `${styleHeight}px`;

    const viewportWidth = Math.round(realWidth);
    const viewportHeight = Math.round(realHeight);

    // const context = canvas.getContext(contextType || "2d");

    const context = getContext(canvas, contextType);

    if (!context) return;

    // if (context && settings.pixelated) {
    //   context.imageSmoothingEnabled = false;
    //   canvas.style.imageRendering = "pixelated";
    // }

    setCanvasProps({
      canvas,
      context,
      width: viewportWidth,
      height: viewportHeight,
      viewportWidth,
      viewportHeight,
      pixelRatio,
    });
  }, []);

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

    if (windowAspect > aspect) {
      styleHeight = maxHeight;
      styleWidth = Math.round(styleHeight * aspect);
    } else {
      styleWidth = maxWidth;
      styleHeight = Math.round(styleWidth / aspect);
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.style.width = `${styleWidth}px`;
    canvas.style.height = `${styleHeight}px`;
  }, [windowWidth, windowHeight]);

  return <canvas ref={canvasRef}></canvas>;
}
