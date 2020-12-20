import fs, { createReadStream, ReadStream } from "fs";
import path from "path";
var glob = require("glob");
import spawn from "cross-spawn";
import { Stream } from "stream";
import { createStream } from "./createStream";

// options is optional

function* getImage() {
  const imageGlobPath = path.join(__dirname, "../../example/output/*.png");

  const files = glob.sync(imageGlobPath);

  for (let file of files) {
    yield createReadStream(file);
  }
  // , function (er, files) {
  //   console.log(files.slice(0, 10));

  //   const r = createReadStream(files[0]);

  //   console.log(r);
  // });

  // console.log(imageDirectory);
}

const cmd = `/Users/davidreed/Projects/rapid-sketch/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg`;

// /Users/davidreed/tmp/sketches/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -framerate 30 -f image2pipe -c:v png -i - -vf fps=30 -y -an -preset slow -c:v libx264 -movflags faststart -profile:v high -crf 18 -pix_fmt yuv420p tmp/2020.11.12-14.54.31.mp4

async function main() {
  const d = createStream();

  for (let image of getImage()) {
    await d.writeFrame(image);
  }
  d.end();
}

main();
