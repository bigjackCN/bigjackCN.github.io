#!/usr/bin/env node
/*
 * Verifies the /interview/ problem bank locally.
 *
 * For every problem it builds the exact Java program the page would send (reference solution +
 * generated test harness), compiles it with your local JDK, runs every test in "submit" mode and checks
 * that all of them pass. Reference solutions live in scripts/interview-solutions/*.js and are never
 * served with the site.
 *
 * Usage (from the repo root):
 *   node scripts/verify-interview.js                 # all problems
 *   node scripts/verify-interview.js two-sum 3sum    # only these ids
 *   node scripts/verify-interview.js --selftest      # also check the harness reports WA / runtime error / TLE / compile error
 *
 * Needs a JDK (javac) on PATH, or a JRE that includes the jdk.compiler module.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');

const siteDir = process.env.JK_SITE_DIR || path.join(__dirname, '..', 'static', 'interview');
const solDir = process.env.JK_SOL_DIR || path.join(__dirname, 'interview-solutions');
require(path.join(siteDir, 'rt.js'));
require(path.join(siteDir, 'dsl.js'));
fs.readdirSync(siteDir).filter(f => /^p\d+\.js$/.test(f)).sort().forEach(f => require(path.join(siteDir, f)));
const PROBLEMS = globalThis.JK_PROBLEMS;
const Runner = require(path.join(siteDir, 'runner.js'));

const SOL = {};
if (fs.existsSync(solDir)) fs.readdirSync(solDir).filter(f => f.endsWith('.js')).sort().forEach(f => Object.assign(SOL, require(path.join(solDir, f))));

const args = process.argv.slice(2);
const selftest = args.includes('--selftest');
const only = args.filter(a => !a.startsWith('--'));

const HAS_JAVAC = cp.spawnSync('javac', ['-version'], { encoding: 'utf8' }).status === 0;
const noise = s => (s || '').split('\n').filter(l => !/^Picked up/.test(l)).join('\n');

function run(cmd, argv, input, timeout) {
  return new Promise(resolve => {
    const p = cp.spawn(cmd, argv, { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '', done = false;
    const timer = setTimeout(() => { if (!done) { p.kill('SIGKILL'); } }, timeout || 120000);
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => { done = true; clearTimeout(timer); resolve({ code, out, err }); });
    p.stdin.on('error', () => {});
    p.stdin.end(input || '');
  });
}

async function compileAndRun(source, stdin) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jk-'));
  try {
    fs.writeFileSync(path.join(tmp, 'Main.java'), source);
    const c = HAS_JAVAC
      ? await run('javac', ['-encoding', 'UTF-8', '-d', tmp, path.join(tmp, 'Main.java')])
      : await run('java', ['-m', 'jdk.compiler/com.sun.tools.javac.Main', '-encoding', 'UTF-8', '-d', tmp, path.join(tmp, 'Main.java')]);
    if (c.code !== 0) return { statusId: 6, compile: noise(c.out + c.err), stdout: '', stderr: '', statusText: 'Compilation Error', backend: 'local' };
    const r = await run('java', ['-Xss8m', '-cp', tmp, 'Main'], stdin, 120000);
    return { statusId: r.code === 0 ? 3 : 11, statusText: r.code === 0 ? 'Accepted' : 'Runtime Error', stdout: r.out, stderr: noise(r.err), compile: '', backend: 'local' };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

let failures = 0;
function report(name, res, wantKind) {
  const ok = wantKind ? res.kind === wantKind : res.kind === 'ok';
  if (!ok) failures++;
  const extra = ok ? '' : '  <-- ' + (res.compile || res.message || res.stderr ||
    res.cases.filter(c => c.verdict !== 'PASS').map(c => 'case ' + c.idx + ' ' + c.verdict + ': ' + c.input.slice(0, 100) + ' => ' + c.actual.slice(0, 200) + ' (expected ' + c.expected.slice(0, 200) + ')').join('; '));
  console.log((ok ? 'PASS ' : 'FAIL ') + name.padEnd(52) + (res.passed + '/' + res.total).padEnd(7) + res.status + extra);
}

async function pool(items, n, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; results[k] = await fn(items[k], k); } }));
  return results;
}

(async () => {
  // structural checks
  const ids = new Set(), nums = new Set();
  for (const p of PROBLEMS) {
    const problems = [];
    if (ids.has(p.id)) problems.push('duplicate id');
    if (p.n != null && nums.has(p.n)) problems.push('duplicate number ' + p.n);
    ids.add(p.id); nums.add(p.n);
    if (!p.title || !p.diff || !p.desc || !p.ex || !p.ex.length) problems.push('missing title/diff/desc/ex');
    if (!p.tests || p.tests.filter(t => !t.h).length < 1 || p.tests.filter(t => t.h).length < 2) problems.push('needs >=1 visible and >=2 hidden tests');
    if (!p.design && !p.sig) problems.push('missing sig');
    try { Runner.prep(p); } catch (e) { problems.push('bad definition: ' + e.message); }
    if (problems.length) { failures++; console.log('FAIL ' + (p.id || p.title) + ' -> ' + problems.join('; ')); }
  }

  const list = PROBLEMS.filter(p => !only.length || only.includes(p.id));
  console.log(list.length + ' problems, concurrency 4\n');
  await pool(list, 4, async p => {
    if (!SOL[p.id]) { failures++; console.log('FAIL ' + p.id + ' (no reference solution)'); return; }
    const prog = Runner.buildProgram(p, SOL[p.id], true);
    const res = Runner.interpret(await compileAndRun(prog.source, prog.stdin), prog);
    report(p.id, res);
  });

  if (selftest) {
    console.log('\n-- harness self-tests (two-sum) --');
    const p = PROBLEMS.find(x => x.id === 'two-sum');
    const cases = [
      ['wrong answer', 'class Solution { public int[] twoSum(int[] n, int t) { return new int[]{0, 0}; } }', 'wrong'],
      ['runtime exception', 'class Solution { public int[] twoSum(int[] n, int t) { int[] a = new int[1]; a[5] = 1; return a; } }', 'runtime'],
      ['infinite loop (TLE)', 'class Solution { public int[] twoSum(int[] n, int t) { while (true) {} } }', 'tle'],
      ['stack overflow', 'class Solution { int f(int x) { return f(x + 1) + 1; } public int[] twoSum(int[] n, int t) { f(0); return null; } }', 'runtime'],
      ['compile error', 'class Solution { public int[] twoSum(int[] n, int t) { return 1 } }', 'compile'],
      ['no imports written -> compile error (nothing is pre-imported)', 'class Solution { public int[] twoSum(int[] n, int t) { Map<Integer,Integer> m = new HashMap<>(); return null; } }', 'compile'],
      ['public class + prints + own imports', 'import java.util.*;\npublic class Solution { public int[] twoSum(int[] n, int t) { System.out.println("hello"); Map<Integer,Integer> m = new HashMap<>(); for (int i = 0; i < n.length; i++) { if (m.containsKey(t - n[i])) return new int[]{m.get(t - n[i]), i}; m.put(n[i], i); } return null; } }', 'ok']
    ];
    for (const [name, code, kind] of cases) {
      const prog = Runner.buildProgram(p, code, true);
      const res = Runner.interpret(await compileAndRun(prog.source, prog.stdin), prog);
      report(name, res, kind);
      if (name.includes('prints')) {
        const printed = res.cases.some(c => c.stdout.indexOf('hello') === 0);
        console.log('     captured user stdout per test: ' + (printed ? 'yes' : 'NO'));
        if (!printed) failures++;
      }
    }
    // line numbers in compile errors must match the editor (nothing is prepended)
    const prog = Runner.buildProgram(p, 'class Solution {\n  public int[] twoSum(int[] n, int t) {\n    return 1\n  }\n}\n', false);
    const res = Runner.interpret(await compileAndRun(prog.source, prog.stdin), prog);
    const lineOk = /Main\.java:3:/.test(res.compile);
    console.log((lineOk ? 'PASS ' : 'FAIL ') + 'compile error reports the editor line number (3)');
    if (!lineOk) failures++;
  }

  console.log(failures ? '\n' + failures + ' problem(s)' : '\nAll good.');
  process.exit(failures ? 1 : 0);
})();
