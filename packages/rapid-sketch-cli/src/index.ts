import ParcelBundler from "parcel-bundler";
import path from "path";
import express from "express";
import { program } from "commander";

program.version("0.0.1");

program
  .arguments("<sketchFile>")
  .option("-p, --port <port>", "server port")
  .option("-o, --open", "open browser");

program.parse(process.argv);
const sketchFilePath = program.args[0];

// Bundler options
const options = {
  outDir: "./dist",
  outFile: "entry.js",
  publicUrl: "/",
  watch: true,
  cache: true,
  cacheDir: ".cache",
  contentHash: false,
  global: "moduleName",
  minify: false,
  scopeHoist: false,
  target: "browser",
  bundleNodeModules: true,
  https: false,
  logLevel: 3,
  hmr: true,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: "",
  detailedReport: false,
  autoInstall: false,
} as ParcelBundler.ParcelOptions;

(async function () {
  const app = express();
  app.use(express.static("dist"));
  // Initializes a bundler using the entrypoint location and options provided
  const bundler = new ParcelBundler(sketchFilePath, options);

  app.use(bundler.middleware());

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  });
  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  // const bundle = await bundler.bundle();
  // bundler.serve();
  app.listen(1567, () => {
    console.log(`Example app listening at http://localhost:${1567}`);
  });
})();
