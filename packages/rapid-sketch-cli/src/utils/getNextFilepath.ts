import glob from "glob";
import path from "path";

export function getNextFilepath(
  basename: string,
  ext: string,
  directory: string
) {
  const existingFiles = glob.sync(path.join(directory, `${basename}*.${ext}`));

  const idRe = /(\d{3})\.[^/.]+$/;

  const lastId = existingFiles.reduce((agg: number, filename: string) => {
    if (idRe.test(filename)) {
      const id = parseInt(filename.match(idRe)[1]);
      if (id > agg) {
        return id;
      }
    }

    return agg;
  }, -1);

  const outputFilename = `${basename}_${(lastId + 1)
    .toString()
    .padStart(3, "0")}.${ext}`;

  return path.join(directory, outputFilename);
}
