// Handlebars helper registration
const Handlebars = require("handlebars");

// Helper function for deep equality comparison
function deepEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return a === b;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

// Register helpers
const helpers = {
  // Check if any of the arguments is true
  any: function (...args) {
    // Remove the last argument which is the Handlebars options object
    const boolArgs = args.slice(0, -1);
    return boolArgs.some((b) => Boolean(b));
  },

  // Check if all arguments are true
  all: function (...args) {
    // Remove the last argument which is the Handlebars options object
    const boolArgs = args.slice(0, -1);
    return boolArgs.every((b) => Boolean(b));
  },

  // Deep equality check
  eq: function (left, right) {
    return deepEqual(left, right);
  },

  // Deep inequality check
  ne: function (left, right) {
    return !deepEqual(left, right);
  },

  // Greater than
  gt: function (left, right) {
    return Number(left) > Number(right);
  },

  // Greater than or equal
  ge: function (left, right) {
    return Number(left) >= Number(right);
  },

  // Less than
  lt: function (left, right) {
    return Number(left) < Number(right);
  },

  // Less than or equal
  le: function (left, right) {
    return Number(left) <= Number(right);
  },

  // String starts with prefix
  pre: function (s, prefix) {
    return String(s).startsWith(String(prefix));
  },

  // String ends with suffix
  suf: function (s, suffix) {
    return String(s).endsWith(String(suffix));
  },

  // Check if value is in container (array or object)
  in: function (container, value) {
    if (container == null) return false;

    if (Array.isArray(container)) {
      return container.some((item) => deepEqual(item, value));
    }

    if (typeof container === "object") {
      return (
        container.hasOwnProperty(value) ||
        Object.values(container).some((item) => deepEqual(item, value))
      );
    }

    return false;
  },
};

// Register all helpers with Handlebars
Object.keys(helpers).forEach((name) => {
  Handlebars.registerHelper(name, helpers[name]);
});

// Export helpers for use in other modules
module.exports = helpers;

// Example usage:
// const template = Handlebars.compile('{{#if (any flag1 flag2)}}At least one is true{{/if}}');
// const result = template({ flag1: false, flag2: true }); // "At least one is true"
