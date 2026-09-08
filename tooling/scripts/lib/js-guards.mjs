/** JS-only type tags — `typeof` is forbidden outside TS type predicates. */

function tagOf(value) {
  return Object.prototype.toString.call(value);
}

export function isJsString(value) {
  return tagOf(value) === "[object String]";
}

export function isJsBoolean(value) {
  return tagOf(value) === "[object Boolean]";
}

export function isJsPlainObject(value) {
  return tagOf(value) === "[object Object]";
}
