import { Router } from "express";
import multer from "multer";
import { createStream, IFfmpegStream } from "./ffmpeg/createStream";
import { bufferToStream } from "./utils/bufferToStream";

const router = Router();

let currentStream: IFfmpegStream;

router.post("/startStream", async function (req, res) {
  currentStream = await createStream({
    filename: `output/${"movie"}.${"mp4"}`,
    type: "mp4",
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

export { router };
