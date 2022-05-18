// import { Widget } from './model';

/**
 * Transforms a widget configutation into a flexlayout node descriptor
 */
export function widget2Node () {
  return 1;
}

/**
 * Deep object comparison
 * @param {*} a
 * @param {*} b
 */
export function isEqual (a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  if (a.prototype !== b.prototype) {
    return false;
  }
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((k) => isEqual(a[k], b[k]));
}
