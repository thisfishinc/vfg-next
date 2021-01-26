import { defineAsyncComponent } from "vue";

const fieldCheckbox = defineAsyncComponent(() => import( "../fields/core/fieldCheckbox.vue"));
const fieldChecklist = defineAsyncComponent(() => import( "../fields/core/fieldChecklist.vue"));
const fieldInput = defineAsyncComponent(() => import("../fields/core/fieldInput.vue"));
const fieldLabel = defineAsyncComponent(() => import( "../fields/core/fieldLabel.vue"));
const fieldRadios = defineAsyncComponent(() => import( "../fields/core/fieldRadios.vue"));
const fieldSelect = defineAsyncComponent(() => import( "../fields/core/fieldSelect.vue"));
const fieldSubmit = defineAsyncComponent(() => import( "../fields/core/fieldSubmit.vue"));
const fieldTextArea = defineAsyncComponent(() => import( "../fields/core/fieldTextArea.vue"));
const fieldUpload = defineAsyncComponent(() => import( "../fields/core/fieldUpload.vue"));

const fieldCleave = defineAsyncComponent(() => import( "../fields/optional/fieldCleave.vue"));
const fieldDateTimePicker = defineAsyncComponent(() => import( "../fields/optional/fieldDateTimePicker.vue"));
const fieldGoogleAddress = defineAsyncComponent(() => import( "../fields/optional/fieldGoogleAddress.vue"));
const fieldImage = defineAsyncComponent(() => import( "../fields/optional/fieldImage.vue"));
const fieldMasked = defineAsyncComponent(() => import( "../fields/optional/fieldMasked.vue"));
const fieldNoUiSlider = defineAsyncComponent(() => import( "../fields/optional/fieldNoUiSlider.vue"));
const fieldPikaday = defineAsyncComponent(() => import( "../fields/optional/fieldPikaday.vue"));
const fieldRangeSlider = defineAsyncComponent(() => import( "../fields/optional/fieldRangeSlider.vue"));
const fieldSelectEx = defineAsyncComponent(() => import( "../fields/optional/fieldSelectEx.vue"));
const fieldSpectrum = defineAsyncComponent(() => import( "../fields/optional/fieldSpectrum.vue"));
const fieldStaticMap = defineAsyncComponent(() => import( "../fields/optional/fieldStaticMap.vue"));
const fieldSwitch = defineAsyncComponent(() => import( "../fields/optional/fieldSwitch.vue"));
const fieldVueMultiSelect = defineAsyncComponent(() => import( "../fields/optional/fieldVueMultiSelect.vue"));

let fieldComponents = {
	fieldCheckbox,
	fieldChecklist,
	fieldInput,
	fieldLabel,
	fieldRadios,
	fieldSelect,
	fieldSubmit,
	fieldTextArea,
	fieldUpload
};

if (process.env.FULL_BUNDLE) {
	fieldComponents = Object.assign(fieldComponents,{
		fieldCleave,
		fieldDateTimePicker,
		fieldGoogleAddress,
		fieldImage,
		fieldMasked,
		fieldNoUiSlider,
		fieldPikaday,
		fieldRangeSlider,
		fieldSelectEx,
		fieldSpectrum,
		fieldStaticMap,
		fieldSwitch,
		fieldVueMultiSelect
	});
}

export default fieldComponents;
