import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { CommandBar } from "./components/CommandBar";
import { Canvas } from "./Canvas";
import { endStream, saveBlob, sendStreamBlob, startStream } from "./utils";
import { ISettings } from "./index";

function useRefState(
  initialState: any
): [React.MutableRefObject<any>, (state: any) => void] {
  const [state, _setState] = React.useState(initialState);

  const stateRef = React.useRef(state);
  const setState = (state: any) => {
    stateRef.current = state;
    _setState(state);
  };

  return [stateRef, setState];
}

const App = ({ sketch, settings }: { sketch: any; settings: ISettings }) => {
  const [width, height] = settings.dimensions;

  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useRefState(0);
  const [canvasProps, setCanvasProps] = useState({
    canvas: null,
    context: null,
    width: null,
    height: null,
    viewportWidth: null,
    viewportHeight: null,
    pixelRatio: null,
  });

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

    if (canvasProps.context) {
      render();
    }

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, []);

  function initialize() {
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
  }

  useEffect(() => {
    if (!canvasProps) return;

    initialize();
    function handleUserKeyPress(e: KeyboardEvent) {
      if (e.code === "KeyS" && !e.altKey && e.metaKey) {
        e.preventDefault();
        render();
        canvasProps.canvas.toBlob((blob) => {
          saveBlob(blob, settings.name);
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
  }, [canvasProps]);

  React.useEffect(() => {
    let raf;
    const animate = () => {
      if (isPlaying) {
        setCurrentFrame(
          frame.current < settings.totalFrames
            ? frame.current + 1
            : frame.current
        );
      }
      raf = requestAnimationFrame(animate);
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
      await sendStreamBlob(canvasProps.canvas);
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
