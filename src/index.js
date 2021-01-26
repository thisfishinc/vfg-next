import _component from "./formGenerator.vue";
export const component = _component;

import _schema from "./utils/schema.js";
export const schema = _schema;

import _validators from "./utils/validators.js";
export const validators = _validators;

import _fieldComponents from "./utils/fieldsLoader";
export const fieldComponents = _fieldComponents;

import _abstractField from "./fields/abstractField";
export const abstractField = _abstractField;

export default {
	component,
	schema,
	validators,
	fieldComponents,
	abstractField,
	install(Vue, options) {
		Vue.component("VueFormGenerator", _component);
		if (options && options.validators) {
			for (let key in options.validators) {
				if ({}.hasOwnProperty.call(options.validators, key)) {
					validators[key] = options.validators[key];
				}
			}
		}
	}
	
};
