# vfg-next

This is a [vue-form-generator](https://github.com/vue-generators/vue-form-generator) refactor to work with VueJS 3

vue-form-generator is a schema-based form generator component for Vue.js

## Demo

[JSFiddle simple example](https://jsfiddle.net/zoul0813/d8excp36/)

[CodePen simple example](https://codepen.io/zoul0813/pen/OrNVNw)

[![Screenshot](https://github.com/vue-generators/vue-form-generator-docs/raw/master/assets/vfg-example1.png)](https://jsfiddle.net/zoul0813/d8excp36/)

## Features

*   reactive forms based on schemas
*   multiple object editing
*   21 field types
*   built-in validators
*   core & full bundles (41kb and 50kb gzipped)
*   Bootstrap friendly templates
*   customizable styles
*   can be extended easily with custom fields
*   ...etc

## Documentation

[Online documentation on Gitbook](https://vue-generators.gitbook.io/vue-generators/)

## Dependencies

vue-form-generator uses [fecha](https://github.com/taylorhakes/fecha) and [lodash](https://lodash.com/) internally.

While built-in fields don't need external dependencies, optional fields may need other libraries.
These dependencies fall into two camps: jQuery or Vanilla. You can find almost the same functionality in both flavors.
In the end, it's your choice to depend on jQuery or not.

You can find details about dependencies in the official [documentation](https://vue-generators.gitbook.io/vue-generators/) under each specific component.

## Installation

### NPM

You can install it via [NPM](http://npmjs.org/) or [yarn](https://yarnpkg.com/).

#### Latest version for Vue 3.x

```
$ npm install vfg-next
```

#### Latest version for Vue 2.x

```
$ npm install vue-form-generator
```

#### Legacy version for Vue 1.0.x

```
$ npm install vue-form-generator@0.6.1
```

### Manual

Download zip package and unpack and add the vfg-next.css and vfg-next.min.js file to your project from dist folder.

```
https://github.com/bagus/vfg-next/archive/master.zip
```

FILES            GZIP     BROTLI
vfg-next.min.js  39.40KB  35.19KB
vfg-next.esm.js  16.33KB  14.44KB


### Core vs Full version

VueFormGenerator come in two version : `core` and `full`.
Core is a more minimal version with only half the fields.
Full is core + other fields.

```js
// the "full" way
<script>
  import VueFormGenerator, { fullComponents } from "vfg-next";
  import "vfg-next/dist/vfg-next.css";  // optional full css additions
  ...
  app.use(VueFormGenerator,{ components: fullComponents })
</script>

// the "core" way
<script>
  import VueFormGenerator, { coreComponents } from "vfg-next";
  import "vfg-next/dist/vfg-next.css";  // optional full css additions
  ...
  app.use(VueFormGenerator,{ components: coreComponents })
</script>

// or you can add certain components only in "tree shaking" way,

// core:
// fieldCheckbox,  fieldChecklist,  fieldInput,  fieldLabel,  fieldRadios,
// fieldSelect, fieldSubmit, fieldTextArea, fieldUpload
// optional:
// fieldCleave, fieldDateTimePicker, fieldGoogleAddress, fieldImage, fieldMasked,
// fieldNoUiSlider, fieldPikaday, fieldRangeSlider, fieldSelectEx, fieldSpectrum,
// fieldStaticMap, fieldSwitch, fieldVueMultiSelect

<script>
  import VueFormGenerator, { fieldInput,  fieldRadios } from "vfg-next";
  import "vfg-next/dist/vfg-next.css";  // optional full css additions
  ...
  app.use(VueFormGenerator,{ components: { fieldInput, fieldRadios } })
</script>

```

### CDN Version

```html

<script src="https://unpkg.com/vue@next"></script>
<script src="https://cdn.jsdelivr.net/npm/vfg-next@3.0.6/dist/vfg-next.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/vfg-next@3.0.6/dist/vfg-next.css">

<script>
  const importGlobal = (module) => window[module]
  const {createApp,defineComponent} = importGlobal("Vue");
  const VFG = importGlobal("vfg-next")
  const { validators, component, fieldInput, fieldSelect, fieldCheckbox} = VFG
  const App = defineComponent({
    components:{"vue-form-generator":component},
    data(){return {
      model: {
        ...
      },
      schema: {
        ...
      },
      formOptions: {
        ...
      }
    }}
  })
  const app = createApp(App)
  app.use(VFG.default,{
    components:{
      fieldInput, fieldSelect, fieldCheckbox
    }
  })
  app.mount("#app")    
</script>

```

## Usage

```html
<template>
  <div class="panel-body">
    <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
  </div>
</template>

<script>
import { createApp } from "vue"
import VueFormGenerator, { validators, fieldInput, fieldSelect, fieldCheckbox } from "vfg-next";
import "vfg-next/dist/vfg-next.css";  // optional full css additions
...
const app = createApp(...)
app.use(VueFormGenerator, components: { fieldInput, fieldSelect, fieldCheckbox } )
app.mount(...)

export default {
  data () {
    return {
      model: {
        id: 1,
        name: 'John Doe',
        password: 'J0hnD03!x4',
        skills: ['Javascript', 'VueJS'],
        email: 'john.doe@gmail.com',
        status: true
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'ID (disabled text field)',
            model: 'id',
            readonly: true,
            disabled: true
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Name',
            model: 'name',
            placeholder: 'Your name',
            featured: true,
            required: true
          },
          {
            type: 'input',
            inputType: 'password',
            label: 'Password',
            model: 'password',
            min: 6,
            required: true,
            hint: 'Minimum 6 characters',
            validator: validators.string
          },
          {
            type: 'select',
            label: 'Skills',
            model: 'skills',
            values: ['Javascript', 'VueJS', 'CSS3', 'HTML5']
          },
          {
            type: 'input',
            inputType: 'email',
            label: 'E-mail',
            model: 'email',
            placeholder: 'User\'s e-mail address'
          },
          {
            type: 'checkbox',
            label: 'Status',
            model: 'status',
            default: true
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      }
    }
  }
}
</script>

```

[vue-i18n-next](https://github.com/intlify/vue-i18n-next) integration
```js

// literal
// {field} field name can be defined in fields data as "name"
// {current} current value
// {min} {max} minimum or maximum value / length

const messages = {
  en: {
    vfg: {
      fieldIsRequired: "{field} is required!",
      invalidFormat: "Invalid format!",
      numberTooSmall: "The number is too small! Minimum: {min}",
      numberTooBig: "The number is too big! Maximum: {max}",
      invalidNumber: "Invalid number",
      invalidInteger: "The value is not an integer",
      textTooSmall: "The length of text is too small! Current: {current}, Minimum: {min}",
      textTooBig: "The length of text is too big! Current: {current}, Maximum: {max}",
      thisNotText: "This is not a text!",
      thisNotArray: "This is not an array!",
      selectMinItems: "Select minimum {min} items!",
      selectMaxItems: "Select maximum {max} items!",
      invalidDate: "Invalid date!",
      dateIsEarly: "The date is too early! Current: {current}, Minimum: {min}",
      dateIsLate: "The date is too late! Current: {current}, Maximum: {max}",
      invalidEmail: "Invalid e-mail address!",
      invalidURL: "Invalid URL!",
      invalidCard: "Invalid card format!",
      invalidCardNumber: "Invalid card number!",
      invalidTextContainNumber: "Invalid text! Cannot contains numbers or special characters",
      invalidTextContainSpec: "Invalid text! Cannot contains special characters",
    }
  }
}

```

## Development

This command will start a `webpack-dev-server` with content of `dev` folder.

```bash
npm run dev
```

## Build

This command will build a distributable version in the `dist` directory.

```bash
npm run build
```

## Test

```bash
npm test
```

or

```bash
npm run ci
```

## More fields _new_

VueFormGenerator supports custom fields. If you decide to release your custom field into the wild, please open a new issue so we can add you to a list here! Please try to use this naming convention for your custom field : vfg-field-\* Example :

*   `vfg-field-myfield`
*   `vfg-field-calendar`
*   `vfg-field-awesome-dropdown`

This way, it will be easier for everyone to find it. Thank you !

### Public Custom Fields

* [vue-tel-input](https://github.com/EducationLink/vue-tel-input) - International Telephone Input Boilerplate with Vue (integrated with VueFormGenerator).
* [vfg-field-sourcecode](https://github.com/gwenaelp/vfg-field-sourcecode) - A source code field for vue-form-generator
* [vfg-field-array](https://github.com/gwenaelp/vfg-field-array) - A vue-form-generator field to handle arrays of items of any type.
* [vfg-field-object](https://github.com/gwenaelp/vfg-field-object) - A vue-form-generator field to handle objects, with or without schemas.
* [vfg-field-matrix](https://github.com/shwld/vfg-field-matrix) - A matrix field for vue-form-generator.

## Contribution

Please send pull requests improving the usage and fixing bugs, improving documentation and providing better examples, or providing some testing, because these things are important.

## License

vue-form-generator is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact

Copyright (C) 2017 Icebob

[![@icebob](https://img.shields.io/badge/github-icebob-green.svg)](https://github.com/icebob) [![@icebob](https://img.shields.io/badge/twitter-Icebobcsi-blue.svg)](https://twitter.com/Icebobcsi)
