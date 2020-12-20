import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    banner: "#! /usr/bin/env node\n",
  },
  plugins: [
    typescript(),
    copy({
      targets: [{ src: "src/index.html", dest: "dist/" }],
    }),
  ],
};
