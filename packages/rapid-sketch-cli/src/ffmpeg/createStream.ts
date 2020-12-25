import spawn from "cross-spawn";
import { Readable, Writable } from "stream";

const cmd = `/Users/dreed/tmp/rapid-sketch/packages/rapid-sketch-cli/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg`;

function getFFMPEGArgs({ filename, type }) {
  const fps = 30;
  const outputWidth = 600;
  const mp4Args = [
    "-framerate",
    `${fps}`,
    "-f",
    "image2pipe",
    "-c:v",
    "png",
    "-i",
    "-",
    "-vf",
    `fps=${fps}`,
    "-y",
    "-an",
    "-preset",
    "slow",
    "-c:v",
    "libx264",
    "-movflags",
    "faststart",
    "-profile:v",
    "high",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    `${filename}.mp4`,
  ];

  const gifArgs = [
    "-f",
    "image2pipe",
    "-i",
    "-",
    "-filter_complex",
    `[0:v] fps=${fps},scale=${outputWidth}:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse`,
    `${filename}.gif`,
  ];

  return type === "mp4" ? mp4Args : gifArgs;
}

interface IProps {
  filename: string;
  type: string;
}

export function createStream({ filename, type }: IProps) {
  let ffmpegStdin: Writable;

  const args = getFFMPEGArgs({ filename, type });
  const promise = new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn(cmd, args);
    const { stdin, stdout, stderr } = ffmpeg;
    ffmpegStdin = stdin;

    // if (!quiet) {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
    // }
    stdin.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code !== "EPIPE") {
        return reject(err);
      }
    });
    ffmpeg.on("exit", async (status) => {
      if (status) {
        return reject(new Error(`FFmpeg exited with status ${status}`));
      } else {
        return resolve();
      }
    });
  });

  return {
    encoding: "image/png",
    stream: ffmpegStdin,
    writeFrame(readableStream: Readable) {
      return new Promise((resolve, reject) => {
        if (ffmpegStdin && ffmpegStdin.writable) {
          readableStream.pipe(ffmpegStdin, { end: false });
          readableStream.once("end", resolve);
          readableStream.once("error", reject);
        } else {
          reject(new Error("WARN: MP4 stream is no longer writable"));
        }
      });
    },
    async end() {
      ffmpegStdin.end();
      await promise;
    },
  };
}

module.exports = {
  createStream,
};
