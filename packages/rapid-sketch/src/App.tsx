import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import {
  createBlobFromDataURL,
  endStream,
  saveBlob,
  saveBlob2,
  saveBlob3,
  startStream,
} from "./utils";
import { ISettings } from "./main";
import mime from "mime-types";
import { CommandBar } from "./components/CommandBar";

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

export function App({
  sketch,
  settings,
}: {
  sketch: any;
  settings: ISettings;
}) {
  const [width, height] = settings.dimensions;
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useRefState(0);
  const [canvasProps, setCanvasProps] = useState({
    canvas: null,
    context: null,
    width: null,
    height: null,
  });
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

  useEffect(() => {
    function handleUserKeyPress(e: KeyboardEvent) {
      if (e.code === "KeyS" && !e.altKey && e.metaKey) {
        e.preventDefault();
        const dataURL = canvasProps.canvas.toDataURL();
        createBlobFromDataURL(dataURL).then((blob: any) => {
          saveBlob(blob, settings.name);
        });
      } else if (e.code === "KeyP" && !e.altKey && e.metaKey) {
        e.preventDefault();

        const { context, width, height } = canvasProps;

        // TODO: better name than r
        const r = sketch()({ context, width, height });

        r.forEach(({ data, extension }) => {
          const blob = new Blob([data], {
            type: mime.lookup(extension) as string,
          });
          saveBlob(blob, settings.name);
        });
      } else if (e.code === "KeyR") {
        render();
      }
    }

    window.addEventListener("keydown", handleUserKeyPress);

    if (canvasProps.context) {
      render();
    }

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [canvasProps]);

  const requestRef = React.useRef(null);

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
    const animate = () => {
      if (isPlaying) {
        // saveThisBlob();
        setFrame(
          frame.current < settings.totalFrames
            ? frame.current + 1
            : frame.current
        );
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  React.useEffect(() => {
    if (frame.current < settings.totalFrames) {
      render();
    } else {
      setIsPlaying(false);
    }
  }, [frame]);

  function render() {
    const { context, width, height } = canvasProps;
    if (!context) return;
    sketch()({ context, width, height, frame: frame.current });
  }

  async function record() {
    console.log("startStreaming");
    await startStream();

    for (let i = 0; i <= settings.totalFrames; i++) {
      setFrame(i);
      await sendCanvas();
    }

    await endStream();
  }

  async function _endStreaming() {
    await endStream();
  }

  return (
    <div>
      <div className="pt-5">
        <Canvas width={width} height={height} setCanvasProps={setCanvasProps} />
      </div>
      <CommandBar
        settings={settings}
        frame={frame}
        setFrame={setFrame}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        record={record}
      />
    </div>
  );
}
