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

const banner = () => {
  const text = "{name}\n{description}\nv{version}\n@license {license} License";
  return (
    "/** \n * " +
    text
      .replace(/\n/g, "\n * ")
      .replace(/{(.*?)}/g, (m, c) => pkg[c.trim().toLowerCase()]) +
    "\n */\n"
  );
};

console.log(banner());

const cjs_options = {
  include: "node_modules/**",
  namedExports: {
    vue: ["defineComponent"],
    lodash: [
      "get",
      "set",
      "objGet",
      "defaults",
      "each",
      "clone",
      "find",
      "cloneDeep",
      "forEach",
      "debounce",
      "uniqueId",
      "uniq",
      "isNil",
      "isFinite",
      "isFunction",
      "isArray",
      "isString",
      "isInteger",
      "isNumber",
      "isObject",
      "isEmpty",
      "camelCase",
    ],
  },
};

const plugins = (mode) => {
  const _plugins = [
    resolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    commonJS(mode == "esm" ? {} : cjs_options),
    Vue({
      preprocessStyles: true,
      normalizer: "~vue-runtime-helpers/dist/normalize-component.js",
      styleInjector: "~vue-runtime-helpers/dist/inject-style/browser.js",
    }),
    postcss({
      minimize: mode == "esm" ? true : false,
      extract: mode == "esm" ? false : path.resolve(pkg.style),
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".vue", ".css"],
      exclude: "node_modules/**",
    }),
    cleanup(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: function (node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
          }
        },
      },
    }),
    sizes(),
  ];
  return _plugins;
};
export default [
  {
    inlineDynamicImports: true,
    external: ["vue"],
    input: "src/index.js",
    output: {
      file: pkg.main,
      compact: true,
      name: pkg.name,
      format: "umd",
      sourcemap: true,
      exports: "named",
      globals: { vue: "Vue" },
      banner,
    },
    plugins: plugins("umd"),
  },
  {
    inlineDynamicImports: true,
    external: ["vue", "lodash", "fecha"],
    input: "src/index.js",
    output: {
      file: pkg.module,
      compact: true,
      name: pkg.name,
      format: "es",
      sourcemap: true,
      exports: "named",
      globals: { vue: "vue", lodash: "lodash", fecha: "fecha" },
      banner,
    },
    plugins: plugins("esm"),
  },
];
