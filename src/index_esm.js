export * from "./utils/fieldsLoader";

export { default as fullComponents } from "./utils/fullComponents";
export { default as coreComponents } from "./utils/coreComponents";

export { default as schema } from "./utils/schema";
export { default as abstractField } from "./fields/abstractField";
export { default as dateFieldHelper } from "./utils/dateFieldHelper";

import _component from "./formGenerator.vue";
export const component = _component;
import _validators from "./utils/validators";
export const validators = _validators;
import { fieldComponents as _fieldComponents } from "./utils/schema";
export const fieldComponents = _fieldComponents;

let _app;

export const registerComponent = components => {
  Object.keys(components).forEach(key => {
    _app.component(key, components[key]);
    _fieldComponents[key] = components[key];
  });
};

export default {
  install(app, options) {
    console.log("VFG install", app, options);
    _app = app;
    _app.component("VueFormGenerator", component);
    _app.config.globalProperties.VFG = {
      component: _component,
      validators: _validators
    };
    if (options) {
      if (options.components) registerComponent(options.components);
      if (options.validators) {
        for (let key in options.validators) {
          if ({}.hasOwnProperty.call(options.validators, key)) {
            _validators[key] = options.validators[key];
          }
        }
      }
    }
  }
};
