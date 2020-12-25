import { Router } from "express";
import multer from "multer";
import { createStream } from "./ffmpeg/createStream";
import { bufferToStream } from "./utils/bufferToStream";

const router = Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

let currentStream;

router.post("/startStream", function (req, res) {
  currentStream = createStream({
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
