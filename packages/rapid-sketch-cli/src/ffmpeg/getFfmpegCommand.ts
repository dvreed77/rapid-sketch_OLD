import resolveGlobal from "resolve-global";
import resolve from "resolve";
import commandExists from "command-exists";

interface IProps {
  moduleName: string;
  cwd: string;
}

export async function getFfmpegCommand(
  { moduleName, cwd }: IProps = {
    moduleName: "@ffmpeg-installer/ffmpeg",
    cwd: process.cwd(),
  }
) {
  if (process.env.FFMPEG_PATH) {
    return process.env.FFMPEG_PATH;
  }

  // first resolve local version
  let modulePath: string;
  try {
    modulePath = resolve.sync(moduleName, { basedir: cwd });
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") throw err;
  }

  // try to resolve to globally installed version
  if (!modulePath) {
    modulePath = resolveGlobal.silent(moduleName);
  }

  if (modulePath) {
    // if module resolved let's require it and use that
    const moduleInstance = require(modulePath);
    return moduleInstance.path.replace("app.asar", "app.asar.unpacked");
  } else {
    // otherwise let's default to 'ffmpeg'
    const cmd = "ffmpeg";
    const valid = await hasCommand(cmd);
    if (!valid) {
      throw new Error(
        `Could not find '${cmd}' command - you may need to install it.\nTry the following:\n  npm i @ffmpeg-installer/ffmpeg --save-dev`
      );
    }
    return cmd;
  }
}

async function hasCommand(cmd) {
  let exists = false;
  try {
    exists = commandExists.sync(cmd);
  } catch (_) {}
  return exists;
}
