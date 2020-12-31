import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import json from "@rollup/plugin-json";

export default {
  external: [
    "parcel-bundler",
    "express",
    "body-parser",
    "multer",
    "commander",
    "mime-types",
    "resolve-global",
    "resolve",
    "glob",
  ],
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      banner: "#! /usr/bin/env node\n",
    },
  ],
  plugins: [
    typescript(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    json(),
    copy({
      targets: [{ src: "src/index.html", dest: "dist/" }],
    }),
  ],
};
