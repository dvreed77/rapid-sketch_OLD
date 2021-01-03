import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { CommandBar } from "./components/CommandBar";
import { Canvas } from "./Canvas";
import { endStream, saveBlob, sendStreamBlob, startStream } from "./utils";
import { ISettings } from "./index";
import { useRefState } from "./utils/useRefState";

interface IProps {
  sketch: any;
  settings: Required<ISettings>;
}

interface ICanvasProps {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
}
const App = ({ sketch, settings }: IProps) => {
  const [width, height] = settings.dimensions;

  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useRefState(0);

  const [canvasProps, setCanvasProps] = useState<ICanvasProps>();

  const renderFunc = useRef();
  document.title = `${settings.name} | RapidSketch`;

  useEffect(() => {
    function handleUserKeyPress(e: KeyboardEvent) {
      if (settings.animation && e.code === "Space") {
        if (frame.current < settings.totalFrames) {
          setIsPlaying((isPlaying) => !isPlaying);
        } else {
          setIsPlaying(false);
        }
      }
    }

    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, []);

  function initialize() {
    if (!canvasProps) return;
    console.log("init", canvasProps);
    const {
      context,
      width,
      height,
      viewportWidth,
      viewportHeight,
      pixelRatio,
    } = canvasProps;
    if (!context) return;

    const rFunc = sketch({
      context,
      width,
      height,
      viewportWidth,
      viewportHeight,
      pixelRatio,
    });
    rFunc({
      context,
      width,
      height,
      frame: frame.current,
      viewportWidth,
      viewportHeight,
    });
    renderFunc.current = rFunc;

    if (settings.animation && settings.autoPlay) setIsPlaying(true);
  }

  useEffect(() => {
    if (!canvasProps) return;

    console.dir(canvasProps);
    initialize();
    function handleUserKeyPress(e: KeyboardEvent) {
      if (e.code === "KeyS" && !e.altKey && e.metaKey) {
        e.preventDefault();

        if (!canvasProps?.canvas) return;
        render();
        canvasProps.canvas.toBlob((blob) => {
          if (blob) saveBlob(blob, settings.name);
        });
      } else if (e.code === "KeyR") {
        initialize();
        render();
      } else if (e.code === "KeyP") {
        render();
        console.log("PRESSED P");
      }
    }
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [canvasProps?.canvas]);

  React.useEffect(() => {
    let raf = NaN;
    const animate = () => {
      const nextFrame = frame.current + 1;

      if (nextFrame <= settings.totalFrames) {
        setCurrentFrame(nextFrame);
        raf = requestAnimationFrame(animate);
      } else {
        if (settings.autoRepeat) {
          setCurrentFrame(0);
          raf = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
        }
      }
    };

    if (isPlaying) {
      raf = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [isPlaying]);

  async function render() {
    if (!canvasProps) return;
    const { context, width, height } = canvasProps;
    const rFunc = renderFunc.current as any;
    if (rFunc !== undefined) {
      await rFunc({ context, width, height, frame: frame.current });
    }
  }

  async function record() {
    await startStream({ type: "mp4" });

    for (let i = 0; i <= settings.totalFrames; i++) {
      setCurrentFrame(i);
      if (canvasProps?.canvas) await sendStreamBlob(canvasProps.canvas);
    }

    await endStream();
  }

  function setCurrentFrame(frame: number) {
    setFrame(frame);
    render();
  }

  return (
    <div>
      <div className="pt-5">
        <Canvas
          width={width}
          height={height}
          setCanvasProps={setCanvasProps}
          contextType={settings.context}
          settings={settings}
        />
      </div>
      <CommandBar
        settings={settings}
        frame={frame}
        setFrame={setCurrentFrame}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        record={record}
      />
    </div>
  );
};

export default App;
