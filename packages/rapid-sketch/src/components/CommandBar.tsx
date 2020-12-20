import React from "react";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faFastBackward,
  faFastForward,
  faFileVideo,
} from "@fortawesome/free-solid-svg-icons";

export function CommandBar({
  settings,
  frame,
  setFrame,
  isPlaying,
  setIsPlaying,
  record,
}) {
  return settings.animation ? (
    <div className="mx-auto text-center mt-5">
      <span className="border rounded px-2 py-2 select-none">
        <span className="font-mono">
          Frame
          <span
            style={{ minWidth: "5rem" }}
            className="inline-block text-right"
          >
            {frame.current}/{settings.totalFrames}
          </span>
        </span>

        <FontAwesomeIcon
          className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
          onClick={() => setFrame(0)}
          icon={faFastBackward}
        />
        <FontAwesomeIcon
          className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
          onClick={() =>
            setFrame(frame.current > 0 ? frame.current - 1 : frame.current)
          }
          icon={faStepBackward}
        />
        {isPlaying ? (
          <FontAwesomeIcon
            className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
            onClick={() => setIsPlaying(false)}
            icon={faPause}
          />
        ) : (
          <FontAwesomeIcon
            className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
            onClick={() => setIsPlaying(frame.current < settings.totalFrames)}
            icon={faPlay}
          />
        )}
        <FontAwesomeIcon
          className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
          onClick={() =>
            setFrame(
              frame.current < settings.totalFrames
                ? frame.current + 1
                : frame.current
            )
          }
          icon={faStepForward}
        />

        <FontAwesomeIcon
          className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
          onClick={() => setFrame(settings.totalFrames)}
          icon={faFastForward}
        />

        <Tooltip title="Record Animation">
          <FontAwesomeIcon
            className="fill-current text-gray-500 hover:text-gray-600 cursor-pointer mx-1"
            onClick={() => record()}
            icon={faFileVideo}
          />
        </Tooltip>
      </span>
    </div>
  ) : null;
}
