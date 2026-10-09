/*
 * whiteboard.js - a plain Java editor that only reports whether the code compiles.
 * No highlighting, no autocomplete, no indentation help, no test cases: like coding on a whiteboard
 * or in a shared doc during an interview.
 *
 * The code is sent to Judge0 CE (Wandbox as fallback), the same runners /interview/ uses.
 * If the code has a `public static void main` in a class called Main, its output is shown too.
 */
(function () {
  'use strict';

  var JUDGE0 = 'https://ce.judge0.com';
  var JAVA17_ID = 91; // "Java (JDK 17.0.6)" on Judge0 CE
  var KEY = 'jk:whiteboard';

  var code = document.getElementById('code');
  var status = document.getElementById('status');
  var output = document.getElementById('output');
  var btnCompile = document.getElementById('btn-compile');
  var btnClear = document.getElementById('btn-clear');

  try { code.value = localStorage.getItem(KEY) || ''; } catch (e) { /* ignore */ }
  code.addEventListener('input', function () {
    try { localStorage.setItem(KEY, code.value); } catch (e) { /* ignore */ }
  });
  code.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') e.preventDefault(); // Tab does nothing: indent with spaces yourself
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); compile(); }
  });
  btnCompile.addEventListener('click', compile);
  btnClear.addEventListener('click', function () {
    if (code.value && !confirm('Clear the editor?')) return;
    code.value = '';
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    show('', 'Write Java, then press Compile. Only the compiler speaks here.', '');
    code.focus();
  });

  function show(kind, text, detail) {
    status.className = 'wb-status ' + (kind || 'muted');
    status.textContent = text;
    output.hidden = !detail;
    output.textContent = detail || '';
  }

  // The runner compiles the file as Main.java, so a top-level `public class Solution` would not compile.
  // Drop `public` from top-level types (column 0) only; line numbers stay the same.
  function prepare(src) {
    return src.replace(/^public\s+((?:final\s+|abstract\s+|sealed\s+)*(?:class|interface|enum|record)\s+(?!Main\b))/gm, '$1');
  }

  function noMain(text) {
    return /Could not find or load main class|Main method not found|ClassNotFoundException: Main/.test(text || '');
  }

  async function compile() {
    var src = code.value;
    if (!src.trim()) { show('warn', 'Nothing to compile yet.', ''); return; }
    btnCompile.disabled = true;
    show('', 'Compiling…', '');
    try {
      var r;
      try { r = await runJudge0(prepare(src)); }
      catch (e) { r = await runWandbox(prepare(src)); }
      report(r);
    } catch (e) {
      show('bad', 'Could not reach a Java compiler. Check your connection and try again.', String(e && e.message || e));
    } finally {
      btnCompile.disabled = false;
    }
  }

  function report(r) {
    if (r.compileError) { show('bad', '✗ Compile error', r.compile.trim()); return; }
    if (noMain(r.stderr)) { show('ok', '✓ Compiles', ''); return; }
    var out = [r.stdout, r.stderr].filter(Boolean).join('\n').trim();
    if (r.runtimeError) { show('warn', '✓ Compiles, but the program threw at runtime', out); return; }
    show('ok', '✓ Compiles' + (out ? ' and ran' : ''), out);
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

  async function runJudge0(source) {
    var r = await postJson(JUDGE0 + '/submissions?base64_encoded=true&wait=true',
      { language_id: JAVA17_ID, source_code: b64e(source), stdin: '' });
    if (!r.ok) throw new Error('Judge0 HTTP ' + r.status);
    var j = await r.json();
    if (!j.status) throw new Error('Judge0 returned no status');
    var id = j.status.id;
    return {
      compileError: id === 6,
      runtimeError: id >= 7 && id <= 12,
      compile: b64d(j.compile_output) || b64d(j.message),
      stdout: b64d(j.stdout), stderr: b64d(j.stderr)
    };
  }

  async function runWandbox(source) {
    var r = await postJson('https://wandbox.org/api/compile.json', { compiler: 'openjdk-jdk-22+36', code: source, stdin: '', save: false });
    if (!r.ok) throw new Error('Wandbox HTTP ' + r.status);
    var j = await r.json();
    var compileErr = /error:/.test(j.compiler_error || '') && !j.program_output;
    return {
      compileError: compileErr,
      runtimeError: !compileErr && String(j.status) !== '0',
      compile: j.compiler_error || j.compiler_message || '',
      stdout: j.program_output || '', stderr: j.program_error || ''
    };
  }
})();
