import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
// import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [
    typescript(),
    postcss(),
    // babel({
    //   exclude: "node_modules/**",
    // }),
    nodeResolve(),
    commonjs(),
    json(),
  ],
};
