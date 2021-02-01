import _VFG, {
  component,
  schema,
  validators,
  fieldComponents,
  abstractField,
  registerComponent,
  fullComponents
} from "./index_esm.js";

import { defineComponent } from "vue";
//(function () ())
export default defineComponent({
  install(app, options) {
    _VFG.install(app, options);
    registerComponent(fullComponents);
  },
  get component() {
    return component;
  },
  schema,
  validators,
  fieldComponents,
  abstractField,
  registerComponent
});
