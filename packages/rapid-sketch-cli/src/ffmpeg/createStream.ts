import spawn from "cross-spawn";
import internal, { Readable } from "stream";
import { createReadStream, ReadStream } from "fs";
import { buildMp4Args } from "./buildMp4Args";

const cmd = `/Users/davidreed/Projects/rapid-sketch/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg`;

// /Users/davidreed/tmp/sketches/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -framerate 30 -f image2pipe -c:v png -i - -vf fps=30 -y -an -preset slow -c:v libx264 -movflags faststart -profile:v high -crf 18 -pix_fmt yuv420p tmp/2020.11.12-14.54.31.mp4
function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });

  return readableInstanceStream;
}

function logCommand(cmd: string, args: string[]) {
  // if (String(process.env.FFMPEG_DEBUG) === "1") {
  console.log(cmd, args.join(" "));
  // }
}

interface IProps {
  format?: string;
  encoding?: string;
  quiet?: boolean;
  fps?: number;
  output?: string;
}

const initialArgs: IProps = {
  format: "image/png",
  encoding: "image/png",
  quiet: true,
  fps: 30,
  output: "~/tmp/movie.mp4",
};

export function createStream(opts: IProps = initialArgs) {
  let ffmpegStdin;

  opts = {
    ...initialArgs,
    ...opts,
  };

  const { output, quiet } = opts;

  const args = buildMp4Args({ output });

  const promise = new Promise<void>((resolve, reject) => {
    //   logCommand(cmd, args);
    const ffmpeg = spawn(cmd, args);
    const { stdin, stdout, stderr } = ffmpeg;
    ffmpegStdin = stdin;

    if (!quiet) {
      stdout.pipe(process.stdout);
      stderr.pipe(process.stderr);
    }
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
    writeFrame(readableStream: ReadStream) {
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
