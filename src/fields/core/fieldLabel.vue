<template>
  <div v-attributes="'wrapper'" class="wrapper">
    <span
      :id="getFieldID(schema)"
      v-attributes="'label'"
      :class="schema.fieldClasses"
      v-html="schema.text || value"
    >
    </span>
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
.vue-form-generator .field-label .wrapper {
  display: block;
  width: 100%;
  margin-left: 12px;
}
</style>
