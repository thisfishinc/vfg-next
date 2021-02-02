import {
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

const resources = {
  fieldIsRequired: "This field is required!",
  invalidFormat: "Invalid format!",

  numberTooSmall: "The number is too small! Minimum: {min}",
  numberTooBig: "The number is too big! Maximum: {max}",
  invalidNumber: "Invalid number",
  invalidInteger: "The value is not an integer",

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
  return text.replace(/{(.*?)}/g, (m, c) => args[c.trim().toLowerCase()]);
}

function translate(messages, key, args) {
  if (args && "field" in args) {
    var field = args.field;
    if (!("min" in args) && "min" in field) args.min = field.min;
    if (!("max" in args) && "max" in field) args.max = field.max;
    args.field = field.name || field.label || field.model;
  }
  if (_app && "__VUE_I18N__" in _app) {
    var translated = "vfg." + key;
    translated = _app["__VUE_I18N__"].global.t(translated, args);
    if (translated !== "vfg." + key) return translated;
  }
  return msg(messages[key], args);
}

function checkEmpty(field, value, required, messages = resources) {
  if (isNil(value) || value === "") {
    if (required) {
      return [translate(messages, "fieldIsRequired", { field: field })];
      //return [msg(messages.fieldIsRequired)];
    } else {
      return [];
    }
  }
  return null;
}

const validators = {
  resources,

  required(value, field, model, messages = resources) {
    return checkEmpty(field, value, field.required, messages);
  },

  number(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let err = [];
    if (isFinite(value)) {
      if (!isNil(field.min) && value < field.min) {
        err.push(
          translate(messages, "numberTooSmall", { field: field, value })
        );
      }

      if (!isNil(field.max) && value > field.max) {
        err.push(translate(messages, "numberTooBig", { field: field, value }));
      }
    } else {
      err.push(translate(messages, "invalidNumber", { field: field, value }));
    }

    return err;
  },

  integer(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;
    let errs = validators.number(value, field, model, messages);

    if (!isInteger(value)) {
      errs.push(translate(messages, "invalidInteger", { field: field, value }));
    }

    return errs;
  },

  double(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    if (!isNumber(value) || isNaN(value)) {
      return [translate(messages, "invalidNumber", { field: field, value })];
    }
  },

  string(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let err = [];
    if (isString(value)) {
      if (!isNil(field.min) && value.length < field.min) {
        err.push(
          translate(messages, "textTooSmall", {
            field: field,
            value,
            current: value.length,
          })
        );
      }

      if (!isNil(field.max) && value.length > field.max) {
        err.push(
          translate(messages, "textTooBig", {
            field: field,
            value,
            current: value.length,
          })
        );
      }
    } else {
      err.push(translate(messages, "thisNotText", { field: field, value }));
    }

    return err;
  },

  array(value, field, model, messages = resources) {
    if (field.required) {
      if (!isArray(value)) {
        return [translate(messages, "thisNotArray", { field: field, value })];
      }

      if (value.length === 0) {
        return [
          translate(messages, "fieldIsRequired", { field: field, value }),
        ];
      }
    }

    if (!isNil(value)) {
      if (!isNil(field.min) && value.length < field.min) {
        return [translate(messages, "selectMinItems", { field: field, value })];
      }

      if (!isNil(field.max) && value.length > field.max) {
        return [translate(messages, "selectMaxItems", { field: field, value })];
      }
    }
  },

  date(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let m = new Date(value);
    if (isNaN(m.getDate())) {
      return [translate(messages, "invalidDate", { field: field, value })];
    }

    let err = [];

    if (!isNil(field.min)) {
      let min = new Date(field.min);
      if (m.valueOf() < min.valueOf()) {
        err.push(
          translate(messages, "dateIsEarly", {
            field: field,
            value,
            current: fecha.format(m),
            min: fecha.format(min),
          })
        );
      }
    }

    if (!isNil(field.max)) {
      let max = new Date(field.max);
      if (m.valueOf() > max.valueOf()) {
        err.push(
          translate(messages, "dateIsLate", {
            field: field,
            value,
            current: fecha.format(m),
            max: fecha.format(max),
          })
        );
      }
    }

    return err;
  },

  regexp(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    if (!isNil(field.pattern)) {
      let re = new RegExp(field.pattern);
      if (!re.test(value)) {
        return [translate(messages, "invalidFormat", { field: field, value })];
      }
    }
  },

  email(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
    if (!re.test(value)) {
      return [translate(messages, "invalidEmail", { field: field, value })];
    }
  },

  url(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g; // eslint-disable-line no-useless-escape
    if (!re.test(value)) {
      return [translate(messages, "invalidURL", { field: field, value })];
    }
  },

  creditCard(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    /*  From validator.js code
			https://github.com/chriso/validator.js/blob/master/src/lib/isCreditCard.js
		*/
    const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    const sanitized = value.replace(/[^0-9]+/g, "");
    if (!creditCard.test(sanitized)) {
      return [translate(messages, "invalidCard", { field: field, value })];
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
        translate(messages, "invalidCardNumber", { field: field, value }),
      ];
    }
  },

  alpha(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let re = /^[a-zA-Z]*$/;
    if (!re.test(value)) {
      return [
        translate(messages, "invalidTextContainNumber", {
          field: field,
          value,
        }),
      ];
    }
  },

  alphaNumeric(value, field, model, messages = resources) {
    let res = checkEmpty(field, value, field.required, messages);
    if (res != null) return res;

    let re = /^[a-zA-Z0-9]*$/;
    if (!re.test(value)) {
      return [
        translate(messages, "invalidTextContainSpec", { field: field, value }),
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
  if (isFunction(fn)) {
    fn.locale = (customMessages) => (value, field, model) =>
      fn(value, field, model, defaults(customMessages, resources));
  }
});

export default _validators;
