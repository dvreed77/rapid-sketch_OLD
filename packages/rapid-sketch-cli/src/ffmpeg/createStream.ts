import spawn from "cross-spawn";

const cmd = `/Users/davidreed/Projects/rapid-sketch/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg`;

const mp4Args = [
  "-framerate",
  "30",
  "-f",
  "image2pipe",
  "-c:v",
  "png",
  "-i",
  "-",
  "-vf",
  "fps=30",
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
  "test_movie.mp4",
];

const gifArgs = [
  "-f",
  "image2pipe",
  "-i",
  "-",
  "-filter_complex",
  "[0:v] fps=30,scale=600:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse",
  "test_gif5.gif",
];

interface IProps {
  filename: string;
}

export function createStream({ filename }: IProps) {
  let ffmpegStdin;

  const promise = new Promise<void>((resolve, reject) => {
    console.log(cmd, gifArgs.join(" "));
    const ffmpeg = spawn(cmd, gifArgs);
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
    writeFrame(readableStream) {
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
