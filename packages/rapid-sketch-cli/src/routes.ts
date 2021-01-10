import { Router } from "express";
import multer from "multer";
import { createStream, IFfmpegStream } from "./ffmpeg/createStream";
import { bufferToStream } from "./utils/bufferToStream";
import bodyParser from "body-parser";
import { getNextFilepath } from "./utils/getNextFilepath";
import mime from "mime-types";
import path from "path";
import fs from "fs";

export const router = ({ sketchFilePath }) => {
  const sketchName = sketchFilePath.replace(/\.[^/.]+$/, "");
  const router = Router();

  router.use(bodyParser.json());

  let currentStream: IFfmpegStream;

  router.post("/startStream", async function (req, res) {
    const { type } = req.body;

    const outputFilename = getNextFilepath(sketchName, type, "output", true);

    const dirName = path.dirname(outputFilename);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }

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
      try {
        const readStream = bufferToStream(req.file.buffer);
        currentStream.writeFrame(readStream);
        res.json({ msg: "DONE!" });
      } catch (err) {
        currentStream.end();
        res.json({ msg: "ERROR!" });
      }
    }
  );

  const singleFileUpload = multer({
    storage: multer.diskStorage({
      destination: "output",
      filename: function (req, file, callback) {
        const ext = mime.extension(file.mimetype) as string;

        const outputFilename = getNextFilepath(sketchName, ext, "output");

        callback(null, outputFilename);
      },
    }),
  }).single("file");

  router.post("/saveBlob", singleFileUpload, (req, res) => {
    res.json({ msg: "DONE!" });
  });

  return router;
};
