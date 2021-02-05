<template>
  <div>
    <input
      :id="getFieldID(schema)"
      v-model="value"
      v-attributes="'input'"
      type="checkbox"
      :autocomplete="schema.autocomplete"
      :disabled="disabled"
      :name="schema.inputName"
      :class="schema.fieldClasses"
      :required="schema.required"
    />&nbsp;
    <template v-if="formOptions.i18n">
      {{ $te(schema.text) ? $t(schema.text) : schema.text }}
    </template>
    <template v-else>
      {{ schema.text }}
    </template>
  </div>
</template>

<script>
import abstractField from "../abstractField";
import { defineComponent } from "vue";

export default defineComponent({
  mixins: [abstractField],
});
</script>

<style lang="scss">
.vue-form-generator .field-checkbox input {
  margin-left: 12px;
}
</style>
