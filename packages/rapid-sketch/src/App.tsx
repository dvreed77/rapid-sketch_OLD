import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { CommandBar } from "./components/CommandBar";
import { Canvas } from "./Canvas";
import {
  createBlobFromDataURL,
  endStream,
  saveBlob,
  saveBlob2,
  saveBlob3,
  startStream,
} from "./utils";
import mime from "mime";

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
        const dataURL = canvasProps.canvas.toDataURL();
        createBlobFromDataURL(dataURL).then((blob: any) => {
          saveBlob(blob, settings.name);
        });
      } else if (e.code === "KeyP" && !e.altKey && e.metaKey) {
        e.preventDefault();

        // TODO: better name than r
        // const r = renderFunc({ context, width, height });

        // r.forEach(({ data, extension }) => {
        //   const blob = new Blob([data], {
        //     type: mime.getType(extension) as string,
        //   });
        //   saveBlob(blob, settings.name);
        // });
      } else if (e.code === "KeyR") {
        initialize();
        render();
      } else if (e.code === "KeyP") {
        for (let i = 0; i <= settings.totalFrames; i++) {
          setCurrentFrame(i);
          canvasProps.canvas.toBlob((blob) => {
            console.log(blob);
            saveBlob(blob, `frame_${i.toString().padStart(4, "0")}`);
          });
        }

        // render();

        console.log("PRESSED P");
      }
    }

    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [canvasProps]);

  function saveThisBlob() {
    const dataURL = canvasProps.canvas.toDataURL();
    createBlobFromDataURL(dataURL).then((blob: any) => {
      const fname = `${settings.name}_${frame.current
        .toString()
        .padStart(3, "0")}`;
      saveBlob2(blob, fname);
    });
  }

  async function sendCanvas() {
    const dataURL = canvasProps.canvas.toDataURL();
    const blob = await createBlobFromDataURL(dataURL);

    const fname = `${settings.name}_${frame.current
      .toString()
      .padStart(3, "0")}`;
    return saveBlob3(blob, fname);
  }

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
    console.log("startStreaming");
    await startStream();

    for (let i = 0; i <= settings.totalFrames; i++) {
      console.log("ff", i);
      setCurrentFrame(i);
      await sendCanvas();
    }

    await endStream();
  }

  async function _endStreaming() {
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
