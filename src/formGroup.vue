<template>
  <div
    v-if="getFieldType(field)"
    class="form-group"
    :class="getFieldRowClasses(field)"
  >
    <label
      v-if="fieldTypeHasLabel(field)"
      :for="getFieldID(field)"
      :class="field.labelClasses"
    >
      <span>
        <template v-if="options.i18n">
          {{ $te(field.label)?$t(field.label):field.label }}
        </template>
        <template v-else>
          {{ field.label }}
        </template>
      </span>
      <span v-if="field.help" class="help">
        <i class="icon" />
        <div class="helpText">
          <template v-if="options.i18n">
            {{ $te(field.help)?$t(field.help):field.help }}
          </template>
          <template v-else>
            {{ field.help }}
          </template>
        </div>
      </span>
    </label>
    <div class="field-wrap">
      <component
        :is="getFieldType(field)"
        ref="child"
        :vfg="vfg"
        :disabled="fieldDisabled(field)"
        :model="model"
        :schema="field"
        :form-options="options"
        @model-updated="onModelUpdated"
        @validated="onFieldValidated"
      />
      <div v-if="buttonVisibility(field)" class="buttons">
          <button
            v-for="(btn, index) in field.buttons"
            :key="index"
            :class="btn.classes"
            :type="getButtonType(btn)"
            @click="buttonClickHandler(btn, field, $event)"
            v-text="options.i18n?$te(btn.label)?$t(btn.label):btn.label:btn.label"
          />
      </div>
    </div>
    <div v-if="field.hint" class="hint">
      <template v-if="options.i18n">
        <template v-if="isString(fieldHint(field))">
          {{ $te(fieldHint(field)) ? $t(fieldHint(field)):fieldHint(field) }}
        </template>
        <template v-else>
          {{ $te(fieldHint(field).key) ? $t(fieldHint(field).key,fieldHint(field).args):fieldHint(field).key }}
        </template>
      </template>
      <template v-else>
        {{ fieldHint(field) }}
      </template>
    </div>
    <div v-if="field.success" class="success help-block">
      <span>
        <template v-if="options.i18n">
          <template v-if="isString(fieldSuccess(field))">
            {{ $te(fieldSuccess(field)) ? $t(fieldSuccess(field)):fieldSuccess(field) }}
          </template>
          <template v-else>
            {{ $te(fieldSuccess(field).key) ? $t(fieldSuccess(field).key,fieldSuccess(field).args):fieldSuccess(field).key }}
          </template>
        </template>
        <template v-else>
          {{ fieldSuccess(field) }}
        </template>
      </span>
    </div>
    <div v-if="fieldErrors(field).length > 0" class="errors help-block">
      <span v-for="(error, index) in fieldErrors(field)" :key="index">
        <template v-if="options.i18n">
          {{ isString(error) ? error : $te(error.key)?$t(error.key, error.args):error.message }}
        </template>
        <template v-else>
          {{ isString(error) ? error : error.message }}
        </template>
      </span>
    </div>
  </div>
  <div v-else>Invalid field type [{{ field.type }}]</div>
</template>
<script>
import {
  get as objGet,
  isNil,
  isFunction,
  camelCase,
  isString as _isString,
} from "lodash";
import { slugifyFormID, fieldComponents } from "./utils/schema";
import formMixin from "./formMixin.js";

import { defineComponent } from "vue";

export default defineComponent({
  name: "FormGroup",
  mixins: [formMixin],
  props: {
    vfg: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    field: {
      type: Object,
      required: true,
    },
    errors: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ["validated", "model-updated"],
  created() {
    this.options.formData.components.push(this);
    this.field.component = this;
  },
  methods: {
    // Should field type have a label
    isString(obj) {
      return _isString(obj);
    },
    fieldTypeHasLabel(field) {
      if (isNil(field.label)) return false;

      let relevantType = "";
      if (field.type === "input") {
        relevantType = field.inputType;
      } else {
        relevantType = field.type;
      }
      switch (relevantType) {
        case "button":
        case "submit":
        case "reset":
          return false;
        default:
          return true;
      }
    },
    getFieldID(schema) {
      const idPrefix = objGet(this.options, "fieldIdPrefix", "");
      return slugifyFormID(schema, idPrefix);
    },
    // Get type of field 'field-xxx'. It'll be the name of HTML element
    getFieldType(fieldSchema) {
      var fieldComponent = "field-" + fieldSchema.type;
      if (camelCase(fieldComponent) in fieldComponents) return fieldComponent;
      return undefined;
    },
    // Get type of button, default to 'button'
    getButtonType(btn) {
      return objGet(btn, "type", "button");
    },
    // Child field executed validation
    onFieldValidated(res, errors, field) {
      this.$emit("validated", res, errors, field);
    },
    buttonVisibility(field) {
      return field.buttons && field.buttons.length > 0;
    },
    buttonClickHandler(btn, field, event) {
      return btn.onclick.call(this, this.model, field, event, this);
    },
    // Get current hint.
    fieldHint(field) {
      if (isFunction(field.hint))
        return field.hint.call(this, this.model, field, this);
      return field.hint;
    },
    fieldSuccess(field) {
      if (isFunction(field.success))
        return field.success.call(this, this.model, field, this);
      return field.success;
    },
    fieldErrors(field) {
      return this.errors
        .filter((e) => e.field === field)
        .map((item) => item.error);
    },
    onModelUpdated(newVal, schema) {
      this.$emit("model-updated", newVal, schema);
    },
    validate(calledParent) {
      return this.$refs.child.validate(calledParent);
    },
    clearValidationErrors() {
      if (this.$refs.child) {
        return this.$refs.child.clearValidationErrors();
      }
    },
  },
});
</script>
<style lang="scss">
$errorColor: #f00;
$successColor: #080;
.form-group:not([class*=" col-"]) {
  width: 100%;
}
.form-group {
  display: inline-block;
  vertical-align: top;
  // width: 100%;
  // margin: 0.5rem 0.26rem;
  margin-bottom: 1rem;

  label {
    font-weight: 400;
    & > :first-child {
      display: inline-block;
    }
  }

  &.featured {
    > label {
      font-weight: bold;
    }
  }

  &.required {
    > label:after {
      content: "*";
      font-weight: normal;
      color: Red;
      // position: absolute;
      padding-left: 0.2em;
      font-size: 1em;
    }
  }

  &.disabled {
    > label {
      color: #666;
      font-style: italic;
    }
  }
  &.error {
    input:not([type="checkbox"]),
    textarea,
    select {
      border: 1px solid $errorColor;
      background-color: rgba($errorColor, 0.15);
    }

    .errors {
      color: $errorColor;
      font-size: 0.8em;
      span {
        display: block;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiklEQVR4Xt2TMQoCQQxF3xdhu72MpZU3GU/meBFLOztPYrVWsQmEWSaMsIXgK8P8RyYkMjO2sAN+K9gTIAmDAlzoUzE7p4IFytvDCQWJKSStYB2efcAvqZFM0BcstMx5naSDYFzfLhh/4SmRM+6Agw/xIX0tKEDFufeDNRUc4XqLRz3qabVIf3BMHwl6Ktexn3nmAAAAAElFTkSuQmCC");
        background-repeat: no-repeat;
        padding-left: 17px;
        padding-top: 0px;
        margin-top: 0.2em;
        font-weight: 600;
      }
    }
  }
  .success {
    color: $successColor;
    font-size: 0.8em;
    span {
      display: block;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAABVklEQVQ4T62Sv0oDQRCHd2ZPfBEbS8FOTaLF3WEZLlEU/JPKQiVgZWuvgoXaqI2ickdscxElF5EgwRfwCezTmMvtjOzhxXgSMOC2+/u+2ZlZEEMeGDIvBgH4JaK08AeQcc1lBFFmARM6yAyvLOjwqVC7ScAekHGtE4m4kTYSkxIKjoOF6ra+iwFtligv02FmeldhZMkRYw8lXD3mq24M5DyzBSAn+wEd7oSd2eZS/S3jmhcCYKzh+FMawKxnhcDcJoCKBCylwxLlimIKG44/+g0IsVl3/NOsa++G3Y87bc559jkArOrK/YDIuPYLCh5njqyg+NDUVXOefQYAa8kzmdVz3alNxz3MuOaigfKaidpdVvMGyBIirvf3RCrKB8X7u95Ys7f2ERqwpZhIAiaLixliOggcf6c31sQ0V7ELEXFZCBFPDAW3mHhfm38t7q9/6t8+38CCnxD8mxFtcSSxAAAAAElFTkSuQmCC");
      background-repeat: no-repeat;
      padding-left: 17px;
      padding-top: 0px;
      margin-top: 0.2em;
      font-weight: 600;
    }
  }

}
</style>
