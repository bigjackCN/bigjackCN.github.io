#!/usr/bin/env node
/*
 * Verifies the /interview/ problem bank locally: for every problem it builds the exact
 * Java program the page would send (reference solution + test harness), compiles it with
 * your local JDK, runs all tests in "submit" mode and checks that every test passes.
 *
 * Usage (from the repo root):
 *   node scripts/verify-interview.js              # all problems
 *   node scripts/verify-interview.js two-sum 3sum # just these ids
 *   node scripts/verify-interview.js --selftest   # also check the harness reports WA / runtime error / TLE correctly
 *
 * Needs a JDK (javac) on PATH, or a JRE that includes the jdk.compiler module.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const dir = path.join(__dirname, '..', 'static', 'interview');
require(path.join(dir, 'rt.js'));
const PROBLEMS = require(path.join(dir, 'problems.js'));
const Runner = require(path.join(dir, 'runner.js'));

const args = process.argv.slice(2);
const selftest = args.includes('--selftest');
const only = args.filter(a => !a.startsWith('--'));

function hasCmd(c) {
  return cp.spawnSync(c, ['-version'], { encoding: 'utf8' }).status === 0;
}
function compileAndRun(source, stdin) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jk-'));
  fs.writeFileSync(path.join(tmp, 'Main.java'), source);
  let c;
  if (hasCmd('javac')) c = cp.spawnSync('javac', ['-encoding', 'UTF-8', '-d', tmp, path.join(tmp, 'Main.java')], { encoding: 'utf8' });
  else c = cp.spawnSync('java', ['-m', 'jdk.compiler/com.sun.tools.javac.Main', '-encoding', 'UTF-8', '-d', tmp, path.join(tmp, 'Main.java')], { encoding: 'utf8' });
  const cerr = ((c.stdout || '') + (c.stderr || '')).split('\n').filter(l => !/^Picked up/.test(l)).join('\n');
  if (c.status !== 0) return { statusId: 6, compile: cerr, stdout: '', stderr: '', statusText: 'Compilation Error', backend: 'local' };
  const r = cp.spawnSync('java', ['-Xss8m', '-cp', tmp, 'Main'], { input: stdin, encoding: 'utf8', timeout: 120000, maxBuffer: 1 << 28 });
  fs.rmSync(tmp, { recursive: true, force: true });
  const stderr = (r.stderr || '').split('\n').filter(l => !/^Picked up/.test(l)).join('\n');
  return { statusId: r.status === 0 ? 3 : 11, statusText: r.status === 0 ? 'Accepted' : 'Runtime Error', stdout: r.stdout || '', stderr, compile: '', backend: 'local' };
}

let failures = 0;
function report(name, res, wantKind) {
  const ok = wantKind ? res.kind === wantKind : res.kind === 'ok';
  if (!ok) failures++;
  const extra = ok ? '' : '  <-- ' + (res.compile || res.message || res.stderr || res.cases.filter(c => c.verdict !== 'PASS').map(c => 'case ' + c.idx + ' ' + c.verdict + ': ' + c.input + ' => ' + c.actual + ' (expected ' + c.expected + ')').join('; '));
  console.log((ok ? 'PASS ' : 'FAIL ') + name.padEnd(48) + res.passed + '/' + res.total + ' ' + res.status + extra);
}

for (const p of PROBLEMS) {
  if (only.length && !only.includes(p.id)) continue;
  const prog = Runner.buildProgram(p, p.solution, true);
  const res = Runner.interpret(compileAndRun(prog.source, prog.stdin), prog);
  report(p.id, res);
}

if (selftest) {
  console.log('\n-- harness self-tests (two-sum) --');
  const p = PROBLEMS.find(x => x.id === 'two-sum');
  const cases = [
    ['wrong answer', 'class Solution { public int[] twoSum(int[] n, int t) { return new int[]{0, 0}; } }', 'wrong'],
    ['runtime exception', 'class Solution { public int[] twoSum(int[] n, int t) { int[] a = new int[1]; a[5] = 1; return a; } }', 'runtime'],
    ['infinite loop (TLE)', 'class Solution { public int[] twoSum(int[] n, int t) { while (true) {} } }', 'tle'],
    ['stack overflow', 'class Solution { int f(int x) { return f(x + 1) + 1; } public int[] twoSum(int[] n, int t) { f(0); return null; } }', 'runtime'],
    ['compile error', 'class Solution { public int[] twoSum(int[] n, int t) { return 1 } }', 'compile'],
    ['public class + prints', 'public class Solution { public int[] twoSum(int[] n, int t) { System.out.println("hello"); Map<Integer,Integer> m = new HashMap<>(); for (int i = 0; i < n.length; i++) { if (m.containsKey(t - n[i])) return new int[]{m.get(t - n[i]), i}; m.put(n[i], i); } return null; } }', 'ok']
  ];
  for (const [name, code, kind] of cases) {
    const prog = Runner.buildProgram(p, code, true);
    const res = Runner.interpret(compileAndRun(prog.source, prog.stdin), prog);
    report(name, res, kind);
    if (name.includes('prints')) {
      const printed = res.cases.some(c => c.stdout.indexOf('hello') === 0);
      console.log('     captured user stdout per test: ' + (printed ? 'yes' : 'NO'));
      if (!printed) failures++;
    }
  }
}

console.log(failures ? '\n' + failures + ' problem(s)' : '\nAll good.');
process.exit(failures ? 1 : 0);
