import Vue from "rollup-plugin-vue";
import babel from "@rollup/plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonJS from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import cleanup from "rollup-plugin-cleanup";
import sizes from "@atomico/rollup-plugin-sizes";
import postcss from "rollup-plugin-postcss";
const path = require("path");
const pkg = require("./package.json");
const banner = `/*
 * ${pkg.name}
 * ${pkg.description}
 * v${pkg.version}
 * ${pkg.license} License
 */
`;

const plugins = [
  resolve(),
  replace({
    "process.env.NODE_ENV": JSON.stringify("production")
  }),
  commonJS(),
  Vue({
    preprocessStyles: true,
    normalizer: "~vue-runtime-helpers/dist/normalize-component.js",
    styleInjector: "~vue-runtime-helpers/dist/inject-style/browser.js"
  }),
  postcss({
    minimize: true,
    extract: path.resolve(pkg.style)
  }),
  babel({
    babelHelpers: "bundled",
    extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".vue", ".css"],
    exclude: "node_modules/**"
  }),
  cleanup(),
  terser({
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  }),
  sizes()
];

export default {
  inlineDynamicImports: true,
  external: ['vue', 'lodash', 'fecha'],
  input: "src/index_esm.js",
  output: {
    banner,
    file: pkg.module,
    compact: true,
    name: pkg.name,
    format: "es",
    sourcemap: true,
    exports: "named",
    globals: { vue: 'vue', lodash: 'lodash', fecha: 'fecha' }
  },
  plugins
};
