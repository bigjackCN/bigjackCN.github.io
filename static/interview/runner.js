/*
 * runner.js - builds a runnable Java program from a problem + the user's code,
 * sends it to a remote Java runner (Judge0 CE, with a Wandbox fallback) and
 * turns the raw output back into per-test-case results.
 *
 * Works in the browser (window.JKRunner) and in Node (module.exports) so that
 * scripts/verify-interview.js can reuse buildProgram().
 */
(function (root) {
  'use strict';

  var JUDGE0_DEFAULT = 'https://ce.judge0.com';
  var JAVA17_ID = 91; // "Java (JDK 17.0.6)" on Judge0 CE
  var MARK = '@@JK@@';

  // Auto-imported on line 1 of the combined source, so the user's line numbers are unchanged.
  var IMPORTS = 'import java.util.*;import java.util.function.*;import java.util.stream.*;import java.util.concurrent.*;';

  /* ---------------------------------------------------------------- Java literals */

  function jstr(s) {
    return JSON.stringify(String(s)); // JSON string syntax is valid Java string syntax for our inputs
  }
  function jchar(c) {
    if (c === "'") return "'\\''";
    if (c === '\\') return "'\\\\'";
    return "'" + c + "'";
  }
  function jnum(v, type) {
    if (type === 'long') return String(v) + 'L';
    if (type === 'double') return Number.isInteger(v) ? v + '.0' : String(v);
    return String(v);
  }
  // Generic "boxed object" literal, used for expected List<...> values.
  function objLit(v) {
    if (Array.isArray(v)) return 'JKRT.L(' + v.map(objLit).join(',') + ')';
    if (typeof v === 'string') return jstr(v);
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
    if (typeof v === 'boolean') return String(v);
    if (v === null) return 'null';
    throw new Error('objLit: unsupported ' + typeof v);
  }

  // JSON value -> Java expression for the given Java type.
  function lit(type, v) {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.java === 'string') return v.java;
    switch (type) {
      case 'int': case 'long': case 'double': return jnum(v, type);
      case 'boolean': return String(v);
      case 'String': return jstr(v);
      case 'char': return jchar(v);
      case 'int[]': case 'long[]': case 'double[]': case 'boolean[]':
        return 'new ' + type + '{' + v.map(function (x) { return lit(type.slice(0, -2), x); }).join(',') + '}';
      case 'String[]':
        return 'new String[]{' + v.map(jstr).join(',') + '}';
      case 'char[]':
        return 'new char[]{' + v.map(jchar).join(',') + '}';
      case 'int[][]':
        return 'new int[][]{' + v.map(function (r) { return lit('int[]', r); }).join(',') + '}';
      case 'char[][]': // JSON form: array of row strings
        return 'new char[][]{' + v.map(function (r) {
          return 'new char[]{' + Array.from(r).map(jchar).join(',') + '}';
        }).join(',') + '}';
      case 'List<Integer>': case 'List<String>':
        return 'new ArrayList<>(Arrays.asList(' + v.map(function (x) { return typeof x === 'string' ? jstr(x) : x; }).join(',') + '))';
      case 'ListNode':
        return 'JKRT.list(' + lit('int[]', v) + ')';
      case 'ListNode[]':
        return 'new ListNode[]{' + v.map(function (l) { return lit('ListNode', l); }).join(',') + '}';
      case 'TreeNode':
        return 'JKRT.tree(new Integer[]{' + v.map(function (x) { return x === null ? 'null' : x; }).join(',') + '})';
      default:
        if (/^List</.test(type)) return objLit(v);
        throw new Error('Unsupported type ' + type);
    }
  }

  // Human-readable form of one argument (what the user sees as "Input").
  function showArg(v) {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.java === 'string') return v.show || v.java;
    return JSON.stringify(v);
  }
  function showInput(problem, t) {
    if (t.show) return t.show;
    return problem.sig.params.map(function (p, i) { return p[1] + ' = ' + showArg(t.a[i]); }).join(', ');
  }

  /* ---------------------------------------------------------------- program builder */

  function retKind(problem) {
    var r = problem.sig.ret;
    return r === 'ListNode' ? 'list' : r === 'TreeNode' ? 'tree' : '';
  }

  function sanitizeUserCode(code) {
    // Judge0 saves the file as Main.java, so a public Solution class would not compile.
    return String(code).replace(/\bpublic\s+(?=(?:final\s+|abstract\s+)?class\s)/g, '');
  }

  function buildProgram(problem, userCode, submit, rt) {
    var tests = problem.tests.filter(function (t) { return submit || !t.h; });
    var lines = tests.map(function (t) {
      var call = 'new Solution().' + problem.sig.method + '(' +
        problem.sig.params.map(function (p, i) { return lit(p[0], t.a[i]); }).join(', ') + ')';
      return '        JKRT.t(' + (t.h ? 'true' : 'false') + ', ' + jstr(showInput(problem, t)) +
        ', () -> ' + call + ', ' + lit(problem.sig.ret, t.e) + ');';
    });
    var main =
      'class Main {\n' +
      '    public static void main(String[] args) throws Exception {\n' +
      '        Scanner sc = new Scanner(System.in);\n' +
      '        boolean submit = sc.hasNextLine() && sc.nextLine().trim().equals("SUBMIT");\n' +
      '        JKRT.begin(submit, ' + jstr(problem.compare || 'exact') + ', ' + jstr(retKind(problem)) + ', ' + (problem.timeMs || 3000) + 'L);\n' +
      lines.join('\n') + '\n' +
      '        JKRT.end();\n' +
      '    }\n' +
      '}\n';
    var code = sanitizeUserCode(userCode);
    var source = IMPORTS + code + '\n' + (rt || root.JK_RT) + '\n' + main;
    return {
      source: source,
      stdin: submit ? 'SUBMIT\n' : 'RUN\n',
      tests: tests,
      userLines: code.split('\n').length
    };
  }

  /* ---------------------------------------------------------------- backends */

  function b64e(s) {
    var bytes = new TextEncoder().encode(s), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  }
  function b64d(s) {
    if (!s) return '';
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  async function postJson(url, body) {
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, 45000);
    try {
      return await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
        signal: ctl.signal
      });
    } finally { clearTimeout(timer); }
  }

  async function runJudge0(source, stdin, base) {
    base = (base || JUDGE0_DEFAULT).replace(/\/+$/, '');
    var url = base + '/submissions?base64_encoded=true&wait=true';
    var body = {
      language_id: JAVA17_ID, source_code: b64e(source), stdin: b64e(stdin),
      cpu_time_limit: 10, wall_time_limit: 20, memory_limit: 512000
    };
    var r = await postJson(url, body);
    if (r.status === 400 || r.status === 422) { // instance has tighter limits: retry with its defaults
      r = await postJson(url, { language_id: JAVA17_ID, source_code: body.source_code, stdin: body.stdin });
    }
    if (!r.ok) throw new Error('Judge0 HTTP ' + r.status);
    var j = await r.json();
    if (!j.status) throw new Error('Judge0 returned no status');
    return {
      backend: 'Judge0',
      statusId: j.status.id,
      statusText: j.status.description,
      stdout: b64d(j.stdout), stderr: b64d(j.stderr),
      compile: b64d(j.compile_output), message: b64d(j.message),
      timeMs: j.time ? Math.round(parseFloat(j.time) * 1000) : null
    };
  }

  async function runWandbox(source, stdin) {
    var r = await postJson('https://wandbox.org/api/compile.json', {
      compiler: 'openjdk-jdk-22+36', code: source, stdin: stdin, save: false
    });
    if (!r.ok) throw new Error('Wandbox HTTP ' + r.status);
    var j = await r.json();
    var compileErr = /error:/.test(j.compiler_error || '') && !j.program_output;
    var statusId = compileErr ? 6 : (String(j.status) === '0' ? 3 : 11);
    return {
      backend: 'Wandbox',
      statusId: statusId,
      statusText: compileErr ? 'Compilation Error' : (statusId === 3 ? 'Accepted' : 'Runtime Error'),
      stdout: j.program_output || '', stderr: j.program_error || '',
      compile: compileErr ? (j.compiler_error || j.compiler_message || '') : '', message: '',
      timeMs: null
    };
  }

  /* ---------------------------------------------------------------- output parsing */

  function unesc(s) {
    return s.replace(/\\(\\|t|n)/g, function (_, c) { return c === 't' ? '\t' : c === 'n' ? '\n' : '\\'; });
  }

  function interpret(raw, prog) {
    var res = {
      backend: raw.backend, compile: '', message: '', stderr: raw.stderr || '', console: '',
      cases: [], total: prog.tests.length, passed: 0, status: '', kind: '', timeMs: raw.timeMs
    };
    if (raw.statusId === 6) {
      res.kind = 'compile'; res.status = 'Compile Error'; res.compile = raw.compile || raw.message || '';
      return res;
    }
    var extra = [];
    (raw.stdout || '').split('\n').forEach(function (line) {
      if (line.indexOf(MARK + '\t') === 0) {
        var f = line.split('\t');
        var idx = parseInt(f[1], 10);
        res.cases.push({
          idx: idx, verdict: f[2], ms: parseInt(f[3], 10),
          input: unesc(f[4] || ''), expected: unesc(f[5] || ''), actual: unesc(f[6] || ''), stdout: unesc(f[7] || ''),
          hidden: !!(prog.tests[idx - 1] && prog.tests[idx - 1].h)
        });
      } else if (line.indexOf('@@END@@') !== 0 && line !== '') {
        extra.push(line);
      }
    });
    res.console = extra.join('\n');
    res.passed = res.cases.filter(function (c) { return c.verdict === 'PASS'; }).length;
    var firstBad = res.cases.filter(function (c) { return c.verdict !== 'PASS'; })[0];
    var complete = res.cases.length === res.total;

    if (complete && !firstBad) { res.kind = 'ok'; res.status = 'Accepted'; return res; }
    if (firstBad) {
      res.kind = firstBad.verdict === 'TLE' ? 'tle' : firstBad.verdict === 'ERR' ? 'runtime' : 'wrong';
      res.status = firstBad.verdict === 'TLE' ? 'Time Limit Exceeded' : firstBad.verdict === 'ERR' ? 'Runtime Error' : 'Wrong Answer';
      return res;
    }
    // The program died before reporting every case.
    var id = raw.statusId;
    if (id === 5) { res.kind = 'tle'; res.status = 'Time Limit Exceeded'; }
    else if (id >= 7 && id <= 12) { res.kind = 'runtime'; res.status = 'Runtime Error'; }
    else { res.kind = 'internal'; res.status = raw.statusText || 'Execution Error'; }
    res.message = raw.message || raw.stderr || raw.statusText || '';
    return res;
  }

  /* ---------------------------------------------------------------- public API */

  async function run(problem, userCode, submit, opts) {
    opts = opts || {};
    var prog = buildProgram(problem, userCode, submit);
    var raw, primaryErr = null;
    try {
      raw = await runJudge0(prog.source, prog.stdin, opts.endpoint);
    } catch (e) {
      primaryErr = e;
      if (opts.endpoint) throw new Error('Custom endpoint failed: ' + (e && e.message || e));
      try { raw = await runWandbox(prog.source, prog.stdin); }
      catch (e2) {
        throw new Error('Could not reach a Java runner (Judge0: ' + (primaryErr.message || primaryErr) +
          '; Wandbox: ' + (e2.message || e2) + ').');
      }
    }
    var res = interpret(raw, prog);
    res.userLines = prog.userLines;
    return res;
  }

  var api = { buildProgram: buildProgram, run: run, interpret: interpret, MARK: MARK, IMPORTS: IMPORTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.JKRunner = api;
})(typeof window !== 'undefined' ? window : globalThis);
