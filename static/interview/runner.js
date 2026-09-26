/*
 * runner.js - turns a problem definition + the user's code into one runnable Java source,
 * sends it to a remote Java runner (Judge0 CE, Wandbox as fallback) and parses the results.
 * Works in the browser (window.JKRunner) and in Node (module.exports, used by scripts/verify-interview.js).
 *
 * Nothing is added in front of the user's code (no imports, no template), so line numbers match the editor.
 */
(function (root) {
  'use strict';

  var JUDGE0_DEFAULT = 'https://ce.judge0.com';
  var JAVA17_ID = 91; // "Java (JDK 17.0.6)" on Judge0 CE
  var MARK = '@@JK@@';

  /* ---------------------------------------------------------------- Java literals */

  function jstr(s) { return JSON.stringify(String(s)); }
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
  function isRaw(v) { return v && typeof v === 'object' && !Array.isArray(v) && typeof v.java === 'string'; }

  // Generic boxed literal (used for expected List<...> values and design-problem outputs).
  function objLit(v) {
    if (isRaw(v)) return v.java;
    if (Array.isArray(v)) return 'JKRT.L(new Object[]{' + v.map(objLit).join(',') + '})';
    if (typeof v === 'string') return jstr(v);
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
    if (typeof v === 'boolean') return String(v);
    if (v === null) return 'null';
    throw new Error('objLit: unsupported ' + typeof v);
  }

  // JSON value -> Java expression for a Java type.
  function lit(type, v) {
    if (isRaw(v)) return v.java;
    switch (type) {
      case 'int': case 'long': case 'double': return jnum(v, type);
      case 'Integer': return v === null ? 'null' : String(v);
      case 'boolean': return String(v);
      case 'String': return v === null ? 'null' : jstr(v);
      case 'char': return jchar(v);
      case 'int[]': case 'long[]': case 'double[]': case 'boolean[]':
        return 'new ' + type + '{' + v.map(function (x) { return lit(type.slice(0, -2), x); }).join(',') + '}';
      case 'String[]': return 'new String[]{' + v.map(jstr).join(',') + '}';
      case 'char[]': return 'new char[]{' + v.map(jchar).join(',') + '}';
      case 'int[][]': return 'new int[][]{' + v.map(function (r) { return lit('int[]', r); }).join(',') + '}';
      case 'char[][]': // JSON form: array of row strings
        return 'new char[][]{' + v.map(function (r) { return 'new char[]{' + Array.from(r).map(jchar).join(',') + '}'; }).join(',') + '}';
      case 'String[][]':
        return 'new String[][]{' + v.map(function (r) { return 'new String[]{' + r.map(jstr).join(',') + '}'; }).join(',') + '}';
      case 'List<Integer>': case 'List<String>':
        return 'new java.util.ArrayList<>(java.util.Arrays.asList(' + v.map(function (x) { return typeof x === 'string' ? jstr(x) : x; }).join(',') + '))';
      case 'ListNode': return 'JKL.list(' + lit('int[]', v) + ')';
      case 'ListNode[]': return 'new ListNode[]{' + v.map(function (l) { return lit('ListNode', l); }).join(',') + '}';
      case 'TreeNode': return 'JKT.tree(new Integer[]{' + v.map(function (x) { return x === null ? 'null' : x; }).join(',') + '})';
      case 'Node': // random-pointer list: [[val, randomIndex|null], ...]
        return 'JKN.build(new Integer[][]{' + v.map(function (p) { return 'new Integer[]{' + p[0] + ',' + (p[1] === null ? 'null' : p[1]) + '}'; }).join(',') + '})';
      default:
        if (/^List</.test(type)) return objLit(v);
        throw new Error('Unsupported type ' + type);
    }
  }

  // Java declaration form of a type (harness code is fully qualified).
  function decl(type) { return type.replace(/\bList</g, 'java.util.List<'); }

  function showArg(v) { return isRaw(v) ? (v.show || v.java) : JSON.stringify(v); }

  /* ---------------------------------------------------------------- problem preparation */

  function splitTop(s) {
    var out = [], depth = 0, cur = '';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '<') depth++;
      if (c === '>') depth--;
      if (c === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += c;
    }
    if (cur.trim()) out.push(cur);
    return out;
  }
  function parseParams(str) {
    if (!str || !str.trim()) return [];
    return splitTop(str).map(function (p) {
      var m = p.trim().match(/^(.*\S)\s+(\w+)$/);
      if (!m) throw new Error('Bad parameter: ' + p);
      return [m[1].replace(/\s+/g, ''), m[2]];
    });
  }
  function parseSig(s) {
    var m = s.trim().match(/^([\w<>\[\]]+)\s+(\w+)\s*\((.*)\)\s*;?$/);
    if (!m) throw new Error('Bad signature: ' + s);
    return { ret: m[1], method: m[2], params: parseParams(m[3]) };
  }

  function prep(p) {
    if (p._prep) return p._prep;
    var q = { design: null, params: [], ret: '', method: '' };
    var text = [p.sig || '', p.args || '', p.ret || '', p.body || ''].join(' ');
    if (p.design) {
      var c = parseSig('void ' + p.design.ctor);
      q.design = { cls: c.method, ctor: c.params, methods: {} };
      p.design.methods.forEach(function (m) { var s = parseSig(m); q.design.methods[s.method] = s; text += ' ' + m; });
      q.ret = 'List<Object>';
    } else {
      if (p.body) { q.method = ''; } else { var s = parseSig(p.sig); q.method = s.method; q.params = s.params; q.ret = s.ret; }
      if (p.args) q.params = parseParams(p.args);
      if (p.ret) q.ret = p.ret;
    }
    q.needs = { list: /\bListNode\b/.test(text), tree: /\bTreeNode\b/.test(text), node: /\bNode\b/.test(text.replace(/TreeNode|ListNode/g, '')) };
    q.kind = q.ret === 'ListNode' ? 'list' : q.ret === 'TreeNode' ? 'tree' : q.ret === 'Node' ? 'node' : '';
    p._prep = q;
    return q;
  }

  function showInput(p, t) {
    if (t.show) return t.show;
    var q = prep(p);
    if (q.design) return JSON.stringify(t.ops) + ' ' + JSON.stringify(t.args);
    return q.params.map(function (x, i) { return x[1] + ' = ' + showArg(t.a[i]); }).join(', ');
  }

  // Java lambda body (a Callable<Object>) for one test.
  function testLambda(p, t) {
    var q = prep(p);
    if (q.design) {
      var d = q.design, lines = ['java.util.List<Object> r = new java.util.ArrayList<Object>();'];
      t.ops.forEach(function (op, i) {
        var args = t.args[i] || [];
        if (i === 0) {
          lines.push(d.cls + ' o = new ' + d.cls + '(' + d.ctor.map(function (x, k) { return lit(x[0], args[k]); }).join(', ') + ');');
          lines.push('r.add(null);');
        } else {
          var m = d.methods[op];
          if (!m) throw new Error('Unknown design method ' + op);
          var call = 'o.' + op + '(' + m.params.map(function (x, k) { return lit(x[0], args[k]); }).join(', ') + ')';
          if (m.ret === 'void') lines.push(call + '; r.add(null);'); else lines.push('r.add(' + call + ');');
        }
      });
      lines.push('return r;');
      return '() -> { ' + lines.join(' ') + ' }';
    }
    var decls = q.params.map(function (x, i) { return decl(x[0]) + ' a' + i + ' = ' + lit(x[0], t.a[i]) + ';'; }).join(' ');
    var names = q.params.map(function (x, i) { return 'a' + i; }).join(', ');
    var body;
    if (p.body) body = p.body;
    else if (typeof p.inPlace === 'number') body = 'new Solution().' + q.method + '(' + names + '); return a' + p.inPlace + ';';
    else body = 'return new Solution().' + q.method + '(' + names + ');';
    return '() -> { ' + decls + ' ' + body + ' }';
  }

  function expectedLit(p, t) {
    var q = prep(p);
    return q.design ? objLit(t.e) : lit(q.ret, t.e);
  }

  /* ---------------------------------------------------------------- program builder */

  function sanitizeUserCode(code) {
    // Judge0 saves the file as Main.java, so a public Solution class would not compile.
    return String(code).replace(/\bpublic\s+(?=(?:final\s+|abstract\s+)?class\s)/g, '');
  }

  function buildProgram(problem, userCode, submit) {
    var q = prep(problem);
    var tests = problem.tests.filter(function (t) { return submit || !t.h; });
    var lines = tests.map(function (t) {
      return '        JKRT.t(' + (t.h ? 'true' : 'false') + ', ' + jstr(showInput(problem, t)) + ', ' + testLambda(problem, t) + ', ' + expectedLit(problem, t) + ');';
    });
    var main =
      'class Main {\n' +
      '    public static void main(String[] args) throws Exception {\n' +
      '        java.util.Scanner sc = new java.util.Scanner(System.in);\n' +
      '        boolean submit = sc.hasNextLine() && sc.nextLine().trim().equals("SUBMIT");\n' +
      '        JKRT.begin(submit, ' + jstr(problem.cmp || 'exact') + ', ' + jstr(q.kind) + ', ' + (problem.timeMs || 3000) + 'L);\n' +
      lines.join('\n') + '\n' +
      '        JKRT.end();\n' +
      '    }\n' +
      '}\n';
    var code = sanitizeUserCode(userCode);
    var source = code + '\n' + root.JK_RT_BUILD(q.needs) + '\n' + main;
    return { source: source, stdin: submit ? 'SUBMIT\n' : 'RUN\n', tests: tests, userLines: code.split('\n').length };
  }

  /* ---------------------------------------------------------------- backends */

  function b64e(s) {
    var bytes = new TextEncoder().encode(s), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
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
    var body = { language_id: JAVA17_ID, source_code: b64e(source), stdin: b64e(stdin), cpu_time_limit: 10, wall_time_limit: 20, memory_limit: 512000 };
    var r = await postJson(url, body);
    if (r.status === 400 || r.status === 422) { // instance has tighter limits: retry with its defaults
      r = await postJson(url, { language_id: JAVA17_ID, source_code: body.source_code, stdin: body.stdin });
    }
    if (!r.ok) throw new Error('Judge0 HTTP ' + r.status);
    var j = await r.json();
    if (!j.status) throw new Error('Judge0 returned no status');
    return {
      backend: 'Judge0', statusId: j.status.id, statusText: j.status.description,
      stdout: b64d(j.stdout), stderr: b64d(j.stderr), compile: b64d(j.compile_output), message: b64d(j.message),
      timeMs: j.time ? Math.round(parseFloat(j.time) * 1000) : null
    };
  }

  async function runWandbox(source, stdin) {
    var r = await postJson('https://wandbox.org/api/compile.json', { compiler: 'openjdk-jdk-22+36', code: source, stdin: stdin, save: false });
    if (!r.ok) throw new Error('Wandbox HTTP ' + r.status);
    var j = await r.json();
    var compileErr = /error:/.test(j.compiler_error || '') && !j.program_output;
    var statusId = compileErr ? 6 : (String(j.status) === '0' ? 3 : 11);
    return {
      backend: 'Wandbox', statusId: statusId,
      statusText: compileErr ? 'Compilation Error' : (statusId === 3 ? 'Accepted' : 'Runtime Error'),
      stdout: j.program_output || '', stderr: j.program_error || '',
      compile: compileErr ? (j.compiler_error || j.compiler_message || '') : '', message: '', timeMs: null
    };
  }

  /* ---------------------------------------------------------------- output parsing */

  function unesc(s) { return s.replace(/\\(\\|t|n)/g, function (_, c) { return c === 't' ? '\t' : c === 'n' ? '\n' : '\\'; }); }

  function interpret(raw, prog) {
    var res = { backend: raw.backend, compile: '', message: '', stderr: raw.stderr || '', console: '', cases: [], total: prog.tests.length, passed: 0, status: '', kind: '', timeMs: raw.timeMs };
    if (raw.statusId === 6) { res.kind = 'compile'; res.status = 'Compile Error'; res.compile = raw.compile || raw.message || ''; return res; }
    var extra = [];
    (raw.stdout || '').split('\n').forEach(function (line) {
      if (line.indexOf(MARK + '\t') === 0) {
        var f = line.split('\t'), idx = parseInt(f[1], 10);
        res.cases.push({
          idx: idx, verdict: f[2], ms: parseInt(f[3], 10),
          input: unesc(f[4] || ''), expected: unesc(f[5] || ''), actual: unesc(f[6] || ''), stdout: unesc(f[7] || ''),
          hidden: !!(prog.tests[idx - 1] && prog.tests[idx - 1].h)
        });
      } else if (line.indexOf('@@END@@') !== 0 && line !== '') { extra.push(line); }
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
    var id = raw.statusId; // the program died before reporting anything
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
        throw new Error('Could not reach a Java runner (Judge0: ' + (primaryErr.message || primaryErr) + '; Wandbox: ' + (e2.message || e2) + ').');
      }
    }
    var res = interpret(raw, prog);
    res.userLines = prog.userLines;
    return res;
  }

  // What the page shows under the description: the exact class/method(s) the harness will call.
  function signatureText(problem) {
    var q = prep(problem);
    if (problem.design) return 'class ' + q.design.cls + '\n' + [problem.design.ctor].concat(problem.design.methods).join('\n');
    return problem.sig;
  }
  function providedText(problem) {
    var n = prep(problem).needs, out = [];
    if (n.list) out.push('ListNode { int val; ListNode next; ListNode(int val) }');
    if (n.tree) out.push('TreeNode { int val; TreeNode left, right; TreeNode(int val) }');
    if (n.node) out.push('Node { int val; Node next, random; Node(int val) }');
    return out;
  }

  var api = { buildProgram: buildProgram, run: run, interpret: interpret, prep: prep, signatureText: signatureText, providedText: providedText, MARK: MARK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.JKRunner = api;
})(typeof window !== 'undefined' ? window : globalThis);
