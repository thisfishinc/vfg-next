import {
  get as objGet,
  defaults,
  isNil,
  isNumber,
  isInteger,
  isString,
  isArray,
  isFunction,
  isFinite,
} from "lodash";
import fecha from "fecha";
let _app;

export const resources = {
  fieldIsRequired: "{field} is required!",
  invalidFormat: "Invalid format!",
  numberTooSmall: "The number is too small! Minimum: {min}",
  numberTooBig: "The number is too big! Maximum: {max}",
  invalidNumber: "Invalid number",
  invalidInteger: "The value is not an integer",
  needAvailabilityCheck : "{field} availability needs to be checked",
  textIsNotSameAs: "{field} must be same with {reference}",
  textTooSmall:
    "The length of text is too small! Current: {current}, Minimum: {min}",
  textTooBig:
    "The length of text is too big! Current: {current}, Maximum: {max}",
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

  invalidTextContainNumber:
    "Invalid text! Cannot contains numbers or special characters",
  invalidTextContainSpec: "Invalid text! Cannot contains special characters",
};

function msg(text, args = {}) {
  return text?text.replace(/{(.*?)}/g, (m, c) => args[c.trim().toLowerCase()]):text;
}

export function translate(key, args, res) {
  res = resources ? Object.assign(resources,res) : resources
  const i18n =
    _app && "__VUE_I18N__" in _app ? _app["__VUE_I18N__"].global : null;
  if (args) {
    if("field" in args) {
      if (!("min" in args) && "min" in args.field) args.min = args.field.min;
      if (!("max" in args) && "max" in args.field) args.max = args.field.max;
      args.fieldName = args.field.name || args.field.label;
    }
    if("refField" in args) {
      args.refFieldName = args.refField.name || args.refField.label;
    }
  }
  args = {
    ...args,
    get field() {
      return this.fieldName ? i18n.te(this.fieldName) ? i18n.tm(this.fieldName) : this.fieldName : "";
    },
    get reference() {
      return this.refFieldName ? i18n.te(this.refFieldName) ? i18n.tm(this.refFieldName) : this.refFieldName : "";
    }
  }
  return i18n
    ? {
        key: "vfg." + key,
        args: args,
        message: msg(res[key], args),
      }
    : msg(res[key], args);
}

function checkEmpty(field, value, required, form) {

  return isNil(value) || value === "" || value==false
    ? required
      ? [translate("fieldIsRequired", { field: field, value },form.resources)]
      : []
    : null;
}

const validators = {

  required(value, field, model, form) {
    return checkEmpty(field, value, field.required, form);
  },

  number(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let err = [];
    if (isFinite(value)) {
      if (!isNil(field.min) && value < field.min) {
        err.push(
          translate("numberTooSmall", { field: field, value },form.resources)
        );
      }

      if (!isNil(field.max) && value > field.max) {
        err.push(translate("numberTooBig", { field: field, value },form.resources));
      }
    } else {
      err.push(translate("invalidNumber", { field: field, value },form.resources));
    }

    return err;
  },

  integer(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;
    let errs = validators.number(value, field, model, form);

    if (!isInteger(value)) {
      errs.push(translate("invalidInteger", { field: field, value },form.resources));
    }

    return errs;
  },

  double(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    if (!isNumber(value) || isNaN(value)) {
      return [translate("invalidNumber", { field: field, value },form.resources)];
    }
  },

  string(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let err = [];
    if (isString(value)) {
      if (!isNil(field.min) && value.length < field.min) {
        err.push(
          translate("textTooSmall", {
            field: field,
            value,
            current: value.length,
          },form.resources)
        );
      }

      if (!isNil(field.max) && value.length > field.max) {
        err.push(
          translate("textTooBig", {
            field: field,
            value,
            current: value.length,
          },form.resources)
        );
      }
      if ("reference" in field) {
        var reference = objGet(form.record,field.reference)
        //console.log(field.reference,value,reference,"rec",record)
        if (reference!==value)
          err.push(
            translate("textIsNotSameAs", {
              field: field,
              refField: form.fields[field.reference],
              value,
              current: value.length,
            },form.resources)
          );
      }
    } else {
      err.push(translate("thisNotText", { field: field, value,refere },form.resources));
    }

    return err;
  },

  array(value, field, model, form) {
    if (field.required) {
      if (!isArray(value)) {
        return [translate("thisNotArray", { field: field, value },form.resources)];
      }

      if (value.length === 0) {
        return [
          translate("fieldIsRequired", { field: field, value },form.resources),
        ];
      }
    }

    if (!isNil(value)) {
      if (!isNil(field.min) && value.length < field.min) {
        return [translate("selectMinItems", { field: field, value },form.resources)];
      }

      if (!isNil(field.max) && value.length > field.max) {
        return [translate("selectMaxItems", { field: field, value },form.resources)];
      }
    }
  },

  date(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let m = new Date(value);
    if (isNaN(m.getDate())) {
      return [translate("invalidDate", { field: field, value },form.resources)];
    }

    let err = [];

    if (!isNil(field.min)) {
      let min = new Date(field.min);
      if (m.valueOf() < min.valueOf()) {
        err.push(
          translate("dateIsEarly", {
            field: field,
            value,
            current: fecha.format(m),
            min: fecha.format(min),
          },form.resources)
        );
      }
    }

    if (!isNil(field.max)) {
      let max = new Date(field.max);
      if (m.valueOf() > max.valueOf()) {
        err.push(
          translate("dateIsLate", {
            field: field,
            value,
            current: fecha.format(m),
            max: fecha.format(max),
          },form.resources)
        );
      }
    }

    return err;
  },

  regexp(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    if (!isNil(field.pattern)) {
      let re = new RegExp(field.pattern);
      if (!re.test(value)) {
        return [translate("invalidFormat", { field: field, value },form.resources)];
      }
    }
  },
  availability(value, field, model, form) {
    if(value&&field.unavailable)
        return [translate("needAvailabilityCheck", { field: field, value },form.resources)];
  },
  email(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
    if (!re.test(value)) {
      return [translate("invalidEmail", { field: field, value },form.resources)];
    }
  },

  url(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g; // eslint-disable-line no-useless-escape
    if (!re.test(value)) {
      return [translate("invalidURL", { field: field, value },form.resources)];
    }
  },

  creditCard(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    /*  From validator.js code
			https://github.com/chriso/validator.js/blob/master/src/lib/isCreditCard.js
		*/
    const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    const sanitized = value.replace(/[^0-9]+/g, "");
    if (!creditCard.test(sanitized)) {
      return [translate("invalidCard", { field: field, value },form.resources)];
    }
    let sum = 0;
    let digit;
    let tmpNum;
    let shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, i + 1);
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        if (tmpNum >= 10) {
          sum += (tmpNum % 10) + 1;
        } else {
          sum += tmpNum;
        }
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }

    if (!(sum % 10 === 0 ? sanitized : false)) {
      return [
        translate("invalidCardNumber", { field: field, value },form.resources),
      ];
    }
  },

  alpha(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let re = /^[a-zA-Z]*$/;
    if (!re.test(value)) {
      return [
        translate("invalidTextContainNumber", {
          field: field,
          value,
        },form.resources),
      ];
    }
  },

  alphaNumeric(value, field, model, form) {
    let res = checkEmpty(field, value, field.required, form);
    if (res != null) return res;

    let re = /^[a-zA-Z0-9]*$/;
    if (!re.test(value)) {
      return [
        translate("invalidTextContainSpec", { field: field, value },form.resources),
      ];
    }
  },
  init(app) {
    _app = app;
  },
};

let _validators = {};

Object.keys(validators).forEach((name) => {
  _validators[name] = validators[name];
  const fn = validators[name];
  /*
  if (isFunction(fn)) {
    fn.locale = (customMessages) => (value, field, model) =>
      fn(value, field, model, defaults(customMessages, resources));
  }
  */
});

export default _validators;
