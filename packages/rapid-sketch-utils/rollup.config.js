import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import json from "@rollup/plugin-json";

export default {
  external: ["d3", "seed-random", "jsts", "transformation-matrix", "mathjs"],
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
  ],
  plugins: [
    typescript(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    json(),
  ],
};
