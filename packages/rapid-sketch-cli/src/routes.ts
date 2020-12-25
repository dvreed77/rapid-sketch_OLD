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
// define the home page route
router.get("/startStream", function (req, res) {
  currentStream = createStream({
    filename: `output/${"movie"}.${"mp4"}`,
  });
});
// define the about route
router.get("/endStream", function (req, res) {
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

// app.post("/endStreaming", (req, res) => {
//   let p = Promise.resolve();
//   if (currentStream) {
//     p = currentStream.end();
//   }
//   res.json({ msg: "ending streaming" });
// });

// app.post("/startStreaming", (req, res) => {
//   currentStream = createStream({
//     output: `output/${"movie"}-${getTimeStamp()}.${"mp4"}`,
//   });
//   res.json({ msg: "started streaming" });
// });

export { router };
