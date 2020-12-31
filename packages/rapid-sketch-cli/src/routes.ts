import { Router } from "express";
import multer from "multer";
import { createStream, IFfmpegStream } from "./ffmpeg/createStream";
import { bufferToStream } from "./utils/bufferToStream";
import bodyParser from "body-parser";
import { getNextFilepath } from "./utils/getNextFilepath";

export const router = ({ sketchFilePath }) => {
  const router = Router();

  router.use(bodyParser.json());

  let currentStream: IFfmpegStream;

  router.post("/startStream", async function (req, res) {
    const { type } = req.body;

    const sketchName = sketchFilePath.replace(/\.[^/.]+$/, "");

    const outputFilename = getNextFilepath(sketchName, type, "output");

    currentStream = await createStream({
      filename: outputFilename,
      type,
    });
    res.json({ msg: "start streaming" });
  });

  router.post("/endStream", function (req, res) {
    let p = Promise.resolve();
    if (currentStream) {
      p = currentStream.end();
    }
    res.json({ msg: "ending streaming" });
  });

  router.post(
    "/sendStreamBlob",
    multer({ storage: multer.memoryStorage() }).single("file"),
    (req, res) => {
      const readStream = bufferToStream(req.file.buffer);
      currentStream.writeFrame(readStream);
      res.json({ msg: "DONE!" });
    }
  );

  return router;
};
