/*
 * dsl.js - tiny helpers used by the problem files (p01.js ... p05.js).
 *
 *   P({n, title, diff, desc, ex:[[input, output, note?]], sig, tests:[...], ...})
 *
 * Fields:
 *   n        LeetCode number (used for ordering / display)
 *   sig      Java signature the user must implement, e.g. 'int[] twoSum(int[] nums, int target)'.
 *            The class is always `Solution`. (Shown under the description.)
 *   cmp      'exact' (default) | 'unordered' (ignore order at every level) | 'setOuter' (ignore the order of the
 *            outer list only) | 'approx' (doubles)
 *   inPlace  index of the argument that the method modifies in place; that argument is what gets compared
 *   design   {ctor:'LRUCache(int capacity)', methods:['int get(int key)', ...]} for class-design problems
 *   args/ret/body  advanced: override the types used for test inputs / expected value, or supply the Java
 *            statements (using the variables a0, a1, ...) that call the solution and return the result
 *   tests    t(args, expected) visible sample, h(args, expected) hidden (only used by Submit);
 *            dt/dh(ops, args, expected) for design problems.
 *            An argument or expected value may be R('java expression', 'text to display').
 *
 * The reference solutions live in scripts/interview-solutions/ (not served with the site) and are only
 * used by scripts/verify-interview.js.
 */
(function (root) {
  var list = root.JK_PROBLEMS = root.JK_PROBLEMS || [];
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  root.JK = {
    P: function (p) { p.id = p.id || slug(p.title); list.push(p); },
    t: function (a, e, show) { return { a: a, e: e, show: show }; },
    h: function (a, e, show) { return { a: a, e: e, h: true, show: show }; },
    dt: function (ops, args, e) { return { ops: ops, args: args, e: e }; },
    dh: function (ops, args, e) { return { ops: ops, args: args, e: e, h: true }; },
    R: function (java, show) { return { java: java, show: show }; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.JK;
