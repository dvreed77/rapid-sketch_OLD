// interface IProps {
//   start?: string;
//   time?: string;
//   fps?: string;
//   scale: string | number;
//   inputFps: number;
//   outputFps: number;
//   isStream: boolean;
//   encoding: string;
// }

// const initalArgs: IProps = {
//   inputFps: 20,
//   scale: "1",
//   encoding: "image/png",
// };

// function buildMP4Args({
//   start,
//   time,
//   fps,
//   scale,
//   inputFps,
//   outputFps,
//   isStream,
//   encoding,
// }: IProps = initalArgs) {
//   start = start ? `-ss ${start}` : "";
//   time = time ? `-t ${time}` : "";
//   fps = fps ? `fps=${fps}` : "";
//   scale = scale ? `scale=${fps}` : "";

//   // var ss = opt.start != null ? ["-ss", opt.start] : "";
//   // var t = opt.time != null ? ["-t", opt.time] : "";
//   // var fps = "fps=" + opt.fps + "";
//   // var scale = opt.scale != null ? "scale=" + opt.scale : "";
//   var filterStr = [fps, scale].filter(Boolean).join(",");
//   var filter1 = ["-vf", filterStr];
//   var inFPS, outFPS;

//   if (typeof opt.inputFPS === "number" && isFinite(opt.inputFPS)) {
//     // if user specifies --input-fps, take precedence over --fps / -r
//     inFPS = opt.inputFPS;
//   } else {
//     // otherwise, use --fps or the default 24 fps
//     inFPS = opt.fps;
//   }

//   // allow user to specify output rate, otherwise default to omitting it
//   if (typeof opt.outputFPS === "number" && isFinite(opt.outputFPS)) {
//     outFPS = opt.outputFPS;
//   }

//   // build FPS commands
//   var inFPSCommand = ["-framerate", String(inFPS)];
//   var outFPSCommand = outFPS != null ? ["-r", String(outFPS)] : false;

//   const streamFormat = parseMP4ImageEncoding(encoding);
//   const inputArgs = isStream
//     ? ["-f", "image2pipe", "-c:v", streamFormat, "-i", "-"]
//     : ["-i", opt.input];

//   return [
//     inFPSCommand,
//     inputArgs,
//     filter1,
//     "-y",
//     "-an",
//     "-preset",
//     "slow",
//     "-c:v",
//     "libx264",
//     "-movflags",
//     "faststart",
//     "-profile:v",
//     "high",
//     "-crf",
//     "18",
//     "-pix_fmt",
//     "yuv420p",
//     // '-x264opts', 'YCgCo',
//     // ss,
//     // t,
//     outFPSCommand,
//     opt.output,
//   ]
//     .filter(Boolean)
//     .reduce(flat, []);
// }

export function buildMp4Args({ output }) {
  return [
    // inFPSCommand,
    "-framerate",
    "30",

    // inputArgs,
    "-f",
    "image2pipe",

    "-c:v",
    "png",

    "-i",
    "-",
    // filter1,
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
    // '-x264opts', 'YCgCo',
    // ss,
    // t,
    // outFPSCommand,
    // opt.output,
    output,
  ];
}
