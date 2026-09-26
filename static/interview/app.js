/* app.js - UI for the Java Interview Simulator. */
(function () {
  'use strict';

  var PROBLEMS = window.JK_PROBLEMS.slice().sort(function (a, b) { return a.n - b.n; });
  PROBLEMS.forEach(function (p) { p.difficulty = p.diff; });
  var Runner = window.JKRunner;
  var $ = function (id) { return document.getElementById(id); };

  /* ------------------------------------------------------------ storage */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('jk:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem('jk:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del: function (k) { try { localStorage.removeItem('jk:' + k); } catch (e) { /* ignore */ } }
  };

  /* ------------------------------------------------------------ helpers */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var mm = String(m).padStart(2, '0'), ss = String(s).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }
  function byId(id) { return PROBLEMS.filter(function (p) { return p.id === id; })[0]; }
  function starterFor() { return ''; } // the editor always starts empty
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  /* ------------------------------------------------------------ state */
  var S = {
    problem: null,
    active: store.get('active', null),   // running interview: {pid, start, limitSec, best, submits, runs, timeupShown}
    busy: false,
    tick: null,
    cfg: store.get('cfg', { font: 14, endpoint: '' }),
    lastRes: null
  };

  function history() { return store.get('history', []); }
  function solvedSet() {
    var set = {};
    history().forEach(function (h) { if (h.result === 'accepted' || h.result === 'overtime') set[h.pid] = true; });
    return set;
  }

  /* ------------------------------------------------------------ theme */
  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('pref-theme', t); } catch (e) { /* ignore */ }
    if (window.monaco) window.monaco.editor.setTheme(t === 'dark' ? 'vs-dark' : 'vs');
  }

  /* ------------------------------------------------------------ editor (Monaco, with a textarea fallback) */
  var Ed = {
    m: null, ta: null, onChange: function () {},
    get: function () { return this.m ? this.m.getValue() : this.ta ? this.ta.value : ''; },
    set: function (v) {
      if (this.m) this.m.setValue(v);
      else if (this.ta) this.ta.value = v;
    },
    focus: function () { if (this.m) this.m.focus(); else if (this.ta) this.ta.focus(); },
    markers: function (list) {
      if (!this.m || !window.monaco) return;
      window.monaco.editor.setModelMarkers(this.m.getModel(), 'jk', list.map(function (x) {
        return { startLineNumber: x.line, endLineNumber: x.line, startColumn: 1, endColumn: 1000, message: x.message, severity: 8 };
      }));
    },
    setFont: function (px) {
      if (this.m) this.m.updateOptions({ fontSize: px });
      if (this.ta) this.ta.style.fontSize = px + 'px';
    }
  };

  function initFallbackEditor(host, note) {
    host.textContent = '';
    var ta = el('textarea', { class: 'fallback', spellcheck: 'false', 'aria-label': 'Java code' });
    ta.style.fontSize = S.cfg.font + 'px';
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        Ed.onChange();
      }
    });
    ta.addEventListener('input', function () { Ed.onChange(); });
    host.appendChild(ta);
    Ed.ta = ta;
  }

  function loadMonaco() {
    return new Promise(function (resolve, reject) {
      var base = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min';
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; reject(new Error('timeout')); } }, 15000);
      var s = document.createElement('script');
      s.src = base + '/vs/loader.js';
      s.onerror = function () { if (!done) { done = true; clearTimeout(timer); reject(new Error('load')); } };
      s.onload = function () {
        window.MonacoEnvironment = {
          getWorkerUrl: function () {
            return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(
              "self.MonacoEnvironment={baseUrl:'" + base + "/'};importScripts('" + base + "/vs/base/worker/workerMain.js');");
          }
        };
        window.require.config({ paths: { vs: base + '/vs' } });
        window.require(['vs/editor/editor.main'], function () {
          if (done) return;
          done = true; clearTimeout(timer); resolve(window.monaco);
        }, function (e) { if (!done) { done = true; clearTimeout(timer); reject(e); } });
      };
      document.head.appendChild(s);
    });
  }

  function initEditor(initial) {
    var host = $('editor');
    host.textContent = 'Loading editor...';
    return loadMonaco().then(function (monaco) {
      host.textContent = '';
      Ed.m = monaco.editor.create(host, {
        value: initial, language: 'java', theme: currentTheme() === 'dark' ? 'vs-dark' : 'vs',
        automaticLayout: true, minimap: { enabled: false }, fontSize: S.cfg.font, tabSize: 4, insertSpaces: true,
        scrollBeyondLastLine: false, renderLineHighlight: 'line', padding: { top: 8 }, wordWrap: 'off',
        lineNumbersMinChars: 3, fixedOverflowWidgets: true
      });
      Ed.m.onDidChangeModelContent(function () { Ed.onChange(); });
      Ed.m.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote, function () { runCode(false); });
      Ed.m.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () { runCode(true); });
    }).catch(function () {
      initFallbackEditor(host, 'Basic editor (Monaco could not be loaded)');
      Ed.set(initial);
    });
  }

  /* ------------------------------------------------------------ dialogs */
  function closeOnBackdrop(d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    Array.prototype.forEach.call(d.querySelectorAll('[data-close]'), function (b) {
      b.addEventListener('click', function () { d.close(); });
    });
  }

  // Simple message/confirm dialog; buttons = [{label, value, cls}], resolves with the clicked value.
  function ask(title, bodyNode, buttons) {
    return new Promise(function (resolve) {
      var d = $('dlg-msg');
      $('msg-title').textContent = title;
      var body = $('msg-body'); body.textContent = '';
      if (typeof bodyNode === 'string') body.appendChild(el('p', { text: bodyNode })); else body.appendChild(bodyNode);
      var actions = $('msg-actions'); actions.textContent = '';
      var result = null;
      buttons.forEach(function (b) {
        actions.appendChild(el('button', { type: 'button', class: 'btn ' + (b.cls || ''), text: b.label, onclick: function () { result = b.value; d.close(); } }));
      });
      var onClose = function () { d.removeEventListener('close', onClose); resolve(result); };
      d.addEventListener('close', onClose);
      d.showModal();
    });
  }
  function confirmDlg(title, msg, okLabel, danger) {
    return ask(title, msg, [
      { label: 'Cancel', value: false },
      { label: okLabel || 'OK', value: true, cls: danger ? 'btn-danger' : 'btn-accent' }
    ]).then(function (v) { return v === true; });
  }

  /* ------------------------------------------------------------ problem view */
  function renderProblem(p) {
    var box = $('problem');
    box.textContent = '';
    var interview = !!S.active;
    var solved = solvedSet()[p.id];

    box.appendChild(el('h1', { class: 'p-title', text: p.n + '. ' + p.title }));
    var meta = el('div', { class: 'p-meta' }, [el('span', { class: 'badge ' + p.difficulty, text: p.difficulty })]);
    if (solved) meta.appendChild(el('span', { class: 'badge solved', text: 'Solved' }));
    box.appendChild(meta);

    box.appendChild(el('div', { class: 'p-desc', html: p.desc })); // our own trusted strings

    p.ex.forEach(function (ex, i) {
      var d = el('div', { class: 'p-ex' }, [
        el('div', {}, [el('span', { class: 'lbl', text: 'Example ' + (i + 1) + ' - Input: ' }), el('code', { class: 'pre-l', text: ex[0] })]),
        el('div', {}, [el('span', { class: 'lbl', text: 'Output: ' }), el('code', { text: ex[1] })])
      ]);
      if (ex[2]) d.appendChild(el('div', { class: 'muted', text: ex[2] }));
      box.appendChild(d);
    });

    document.title = p.n + '. ' + p.title;
    $('pane-left').scrollTop = 0;
  }

  function loadProblem(id) {
    var p = byId(id) || PROBLEMS[0];
    if (S.problem) store.set('draft:' + S.problem.id, Ed.get()); // flush the current problem's code first
    S.problem = p;
    store.set('last', p.id);
    renderProblem(p);
    var draft = store.get('draft:' + p.id, null);
    Ed.set(typeof draft === 'string' && draft.length ? draft : starterFor(p));
    Ed.markers && Ed.markers([]);
    S.lastRes = null;
    $('results').textContent = '';
    $('results').appendChild(el('div', { class: 'res-empty', text: 'Run your code to see results here.' }));
  }

  /* ------------------------------------------------------------ run / submit / results */
  function setBusy(b) {
    S.busy = b;
    $('btn-run').disabled = b; $('btn-submit').disabled = b;
  }

  function parseCompileMarkers(text, userLines) {
    var out = [], re = /(?:Main|prog)\.java:(\d+):\s*error:\s*(.*)/g, m; // Judge0 says Main.java, Wandbox prog.java
    while ((m = re.exec(text))) {
      var line = parseInt(m[1], 10);
      if (line >= 1 && line <= userLines) out.push({ line: line, message: m[2] });
    }
    return out;
  }

  function runCode(submit) {
    if (S.busy || !S.problem) return;
    var code = Ed.get();
    var p = S.problem;
    setBusy(true);
    Ed.markers([]);
    var box = $('results'); box.textContent = '';
    box.appendChild(el('div', { class: 'res-empty' }, [
      el('span', { class: 'spinner' }),
      submit ? 'Submitting - compiling and running all tests...' : 'Running sample tests...',
    ]));
    var started = Date.now();
    if (S.active) { S.active[submit ? 'submits' : 'runs'] = (S.active[submit ? 'submits' : 'runs'] || 0) + 1; store.set('active', S.active); }

    Runner.run(p, code, submit, { endpoint: S.cfg.endpoint || '' }).then(function (res) {
      res.wall = Date.now() - started;
      S.lastRes = res;
      renderResults(res, submit);
      if (res.kind === 'compile') Ed.markers(parseCompileMarkers(res.compile, res.userLines));
      afterRun(res, submit);
    }).catch(function (err) {
      box.textContent = '';
      box.appendChild(el('div', { class: 'res-head' }, [el('span', { class: 'res-status bad', text: 'Could not run your code' })]));
      box.appendChild(el('div', { class: 'err-pre', text: String(err && err.message || err) }));
      box.appendChild(el('div', { class: 'muted', text: 'Check your connection and try again. If the public runner is busy you can set your own Judge0 endpoint in Settings.' }));
    }).then(function () { setBusy(false); });
  }

  function renderResults(res, submit) {
    var box = $('results'); box.textContent = '';
    var cls = res.kind === 'ok' ? 'ok' : (res.kind === 'internal' ? 'warn' : 'bad');
    var head = el('div', { class: 'res-head' }, [el('span', { class: 'res-status ' + cls, text: res.status })]);
    if (res.kind !== 'compile') head.appendChild(el('span', { class: 'muted', text: res.passed + ' / ' + res.total + ' testcases passed' }));
    var runtime = res.cases.length ? res.cases.reduce(function (a, c) { return a + (c.ms || 0); }, 0) : null;
    if (runtime !== null && res.kind !== 'compile') head.appendChild(el('span', { class: 'muted', text: 'test time ' + runtime + ' ms' }));
    box.appendChild(head);

    if (res.kind === 'compile') {
      box.appendChild(el('div', { class: 'err-pre', text: res.compile || 'Compilation failed.' }));
      return;
    }
    if (res.kind === 'internal' || (res.message && res.cases.length < res.total)) {
      if (res.message) box.appendChild(el('div', { class: 'err-pre', text: res.message }));
    }
    if (!res.cases.length) return;

    var list = el('div', { class: 'case-list' });
    box.appendChild(list);
    var nVis = 0, nHid = 0;
    res.cases.forEach(function (c) {
      var label = c.hidden ? 'Hidden ' + (++nHid) : 'Case ' + (++nVis);
      var row = el('div', { class: 'case-row' }, [
        el('span', { class: 'dot ' + c.verdict }),
        el('span', { class: 'case-name', text: label }),
        el('span', { class: 'muted', text: c.verdict === 'PASS' ? (c.ms + ' ms') : c.verdict === 'TLE' ? 'time limit exceeded' : c.verdict === 'ERR' ? 'runtime error' : 'wrong answer' })
      ]);
      list.appendChild(row);
      if (c.verdict === 'PASS') {
        if (!c.hidden) list.appendChild(el('div', { class: 'case-detail' }, [el('pre', { text: c.input + '\n=> ' + c.actual })]));
        return;
      }
      var fieldDefs = [['Input', c.input, false], ['Output', c.actual, true], ['Expected', c.expected, false]];
      if (c.verdict === 'TLE') fieldDefs = [['Input', c.input, false], ['Result', c.actual, true]];
      if (c.verdict === 'ERR') fieldDefs = [['Input', c.input, false], ['Error', c.actual, true]];
      var detail = el('div', { class: 'case-detail' });
      fieldDefs.forEach(function (f) {
        detail.appendChild(el('div', { class: 'field' }, [el('div', { class: 'k', text: f[0] }), el('pre', { class: f[2] ? 'bad' : '', text: f[1] })]));
      });
      if (c.stdout) detail.appendChild(el('div', { class: 'field' }, [el('div', { class: 'k', text: 'Stdout' }), el('pre', { text: c.stdout })]));
      list.appendChild(detail);
    });
    if (res.cases.length < res.total) list.appendChild(el('div', { class: 'muted small', text: (res.total - res.cases.length) + ' more test(s) not run.' }));
    if (res.console) box.appendChild(el('div', { class: 'field' }, [el('div', { class: 'k', text: 'Runner output' }), el('pre', { text: res.console })]));
  }

  /* ------------------------------------------------------------ history */
  function record(entry) {
    var h = history();
    h.unshift(entry);
    if (h.length > 500) h.length = 500;
    store.set('history', h);
  }

  function afterRun(res, submit) {
    if (!S.active) {
      if (submit && res.kind === 'ok') {
        record({ ts: Date.now(), pid: S.problem.id, title: S.problem.title, diff: S.problem.difficulty, mode: 'practice', limitSec: 0, elapsedSec: 0, result: 'accepted', passed: res.passed, total: res.total });
        renderProblem(S.problem); // refresh "Solved" badge
      }
      return;
    }
    S.active.best = Math.max(S.active.best || 0, res.passed);
    S.active.total = res.total;
    store.set('active', S.active);
    if (submit && res.kind === 'ok') finishInterview('solved');
  }

  /* ------------------------------------------------------------ interview timer */
  function activeElapsed() { return S.active ? (Date.now() - S.active.start) / 1000 : 0; }

  function updateTimer() {
    var a = S.active; if (!a) return;
    var t = $('timer'), val = $('timer-val'), label = $('timer-label');
    var el_ = activeElapsed();
    t.classList.remove('warn', 'crit', 'over');
    if (a.limitSec > 0) {
      var left = a.limitSec - el_;
      if (left >= 0) {
        label.textContent = 'Time left'; val.textContent = fmtClock(left);
        if (left <= 60) t.classList.add('crit'); else if (left <= 300) t.classList.add('warn');
      } else {
        label.textContent = 'Overtime'; val.textContent = '+' + fmtClock(-left); t.classList.add('over');
        if (!a.timeupShown) { a.timeupShown = true; store.set('active', a); showTimeUp(); }
      }
    } else {
      label.textContent = 'Elapsed'; val.textContent = fmtClock(el_);
    }
  }

  function showTimeUp() {
    ask("Time's up", 'Your time limit is over. You can keep going (the clock switches to overtime) or end the interview and record it.', [
      { label: 'Keep going', value: 'keep' },
      { label: 'End interview', value: 'end', cls: 'btn-accent' }
    ]).then(function (v) { if (v === 'end') finishInterview('timeout'); });
  }

  function setInterviewUI(on) {
    $('timer').hidden = !on;
    $('btn-start').hidden = on;
    $('btn-problems').disabled = on;
    $('btn-random').disabled = on;
    $('btn-problems').title = on ? 'Finish or end the interview to browse problems' : '';
    $('btn-random').title = on ? 'Finish or end the interview to change problem' : 'Open a random problem (prefers ones you have not solved)';
  }

  function startTicking() {
    clearInterval(S.tick);
    updateTimer();
    S.tick = setInterval(updateTimer, 500);
  }

  function pickProblem(diff, preferUnsolved) {
    var pool = PROBLEMS.filter(function (p) { return diff === 'Any' || p.difficulty === diff; });
    var solved = solvedSet();
    var fresh = pool.filter(function (p) { return !solved[p.id] && (!S.problem || p.id !== S.problem.id); });
    if (preferUnsolved && fresh.length) pool = fresh;
    else if (S.problem && pool.length > 1) pool = pool.filter(function (p) { return p.id !== S.problem.id; });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startInterview(diff, limitSec) {
    var p = pickProblem(diff, true);
    S.active = { pid: p.id, start: Date.now(), limitSec: limitSec, best: 0, total: p.tests.length, submits: 0, runs: 0, timeupShown: false };
    store.set('active', S.active);
    setInterviewUI(true);
    loadProblem(p.id);
    startTicking();
    Ed.focus();
  }

  function finishInterview(kind) {
    var a = S.active; if (!a) return;
    var elapsed = Math.round(activeElapsed());
    var p = byId(a.pid);
    var result = kind === 'solved' ? (a.limitSec > 0 && elapsed > a.limitSec ? 'overtime' : 'accepted')
      : kind === 'timeout' ? 'timeout' : 'gaveup';
    record({ ts: Date.now(), pid: p.id, title: p.title, diff: p.difficulty, mode: 'interview', limitSec: a.limitSec, elapsedSec: elapsed, result: result, passed: a.best || 0, total: a.total || p.tests.length, submits: a.submits || 0 });
    clearInterval(S.tick);
    S.active = null;
    store.del('active');
    setInterviewUI(false);
    renderProblem(p);

    var title = result === 'accepted' ? 'Solved - nice work' : result === 'overtime' ? 'Solved, but over time' : result === 'timeout' ? "Time's up" : 'Interview ended';
    var body = el('div', {}, [
      el('p', { text: p.title + ' (' + p.difficulty + ')' }),
      el('p', { class: 'muted', text: 'Time used: ' + fmtClock(elapsed) + (a.limitSec ? ' of ' + fmtClock(a.limitSec) : '') + ' - best result: ' + (a.best || 0) + ' / ' + (a.total || p.tests.length) + ' tests - submissions: ' + (a.submits || 0) }),
    ]);
    ask(title, body, [
      { label: 'Close', value: 'close' },
      { label: 'New interview', value: 'again', cls: 'btn-accent' }
    ]).then(function (v) { if (v === 'again') openStartDialog(); });
  }

  function endInterviewClicked() {
    confirmDlg('End this interview?', 'It will be recorded as ended early.', 'End interview', true)
      .then(function (ok) { if (ok) finishInterview('gaveup'); });
  }

  /* ------------------------------------------------------------ start dialog / problem list / history / settings */
  var DEFAULT_TIME = { Any: 1800, Easy: 1200, Medium: 1800, Hard: 2700 };

  function openStartDialog() {
    var d = $('dlg-start');
    var diff = $('start-diff').value;
    $('start-time').value = String(DEFAULT_TIME[diff] || 1800);
    d.showModal();
  }

  var plFilter = { diff: 'All', q: '' };
  function renderProblemList() {
    var solved = solvedSet();
    var chips = $('pl-diff'); chips.textContent = '';
    ['All', 'Easy', 'Medium', 'Hard'].forEach(function (d) {
      chips.appendChild(el('button', { type: 'button', class: 'chip' + (plFilter.diff === d ? ' on' : ''), text: d, onclick: function () { plFilter.diff = d; renderProblemList(); } }));
    });
    var list = $('pl-list'); list.textContent = '';
    var q = plFilter.q.trim().toLowerCase();
    var rows = PROBLEMS.filter(function (p) {
      if (plFilter.diff !== 'All' && p.difficulty !== plFilter.diff) return false;
      return !q || p.title.toLowerCase().indexOf(q) >= 0 || String(p.n) === q;
    });
    if (!rows.length) list.appendChild(el('div', { class: 'prow', text: 'No problems match.' }));
    rows.forEach(function (p) {
      list.appendChild(el('div', { class: 'prow', role: 'button', tabindex: '0', onclick: function () { $('dlg-problems').close(); loadProblem(p.id); } }, [
        el('span', { class: 'tick', text: solved[p.id] ? '✓' : '' }),
        el('div', { class: 'name', text: p.n + '. ' + p.title }),
        el('span', { class: 'badge ' + p.difficulty, text: p.difficulty })
      ]));
    });
  }

  var RESULT_LABEL = { accepted: 'Solved', overtime: 'Solved (late)', timeout: "Time's up", gaveup: 'Ended early', failed: 'Failed' };

  function renderHistory() {
    var h = history();
    var solved = solvedSet();
    var solvedCount = Object.keys(solved).filter(function (id) { return byId(id); }).length; // ignore ids of problems that no longer exist
    var byDiff = { Easy: 0, Medium: 0, Hard: 0 };
    Object.keys(solved).forEach(function (id) { var p = byId(id); if (p) byDiff[p.difficulty]++; });
    var totals = { Easy: 0, Medium: 0, Hard: 0 };
    PROBLEMS.forEach(function (p) { totals[p.difficulty]++; });
    var iv = h.filter(function (x) { return x.mode === 'interview'; });
    var onTime = iv.filter(function (x) { return x.result === 'accepted'; });
    var avg = onTime.length ? Math.round(onTime.reduce(function (a, x) { return a + x.elapsedSec; }, 0) / onTime.length) : null;

    var stats = $('hist-stats'); stats.textContent = '';
    [
      [solvedCount + ' / ' + PROBLEMS.length, 'problems solved'],
      [byDiff.Easy + '/' + totals.Easy + '  ' + byDiff.Medium + '/' + totals.Medium + '  ' + byDiff.Hard + '/' + totals.Hard, 'easy / medium / hard'],
      [iv.length ? Math.round(100 * onTime.length / iv.length) + '%' : '-', 'interviews solved in time (' + iv.length + ')'],
      [avg === null ? '-' : fmtClock(avg), 'average solve time']
    ].forEach(function (s) { stats.appendChild(el('div', { class: 'stat' }, [el('b', { text: s[0] }), el('span', { text: s[1] })])); });

    var wrap = $('hist-table-wrap'); wrap.textContent = '';
    if (!h.length) { wrap.appendChild(el('p', { class: 'muted', text: 'No attempts yet. Solve a problem or start an interview.' })); return; }
    var tbody = el('tbody');
    h.slice(0, 100).forEach(function (x) {
      tbody.appendChild(el('tr', {}, [
        el('td', { text: fmtDate(x.ts) }),
        el('td', { text: x.title }),
        el('td', {}, [el('span', { class: 'badge ' + x.diff, text: x.diff })]),
        el('td', { text: x.mode === 'interview' ? 'Interview' : 'Practice' }),
        el('td', { class: 'res-' + x.result, text: RESULT_LABEL[x.result] || x.result }),
        el('td', { text: x.mode === 'interview' ? fmtClock(x.elapsedSec) + (x.limitSec ? ' / ' + fmtClock(x.limitSec) : '') : '-' }),
        el('td', { text: x.passed + '/' + x.total })
      ]));
    });
    wrap.appendChild(el('div', { class: 'hist-wrap' }, [el('table', { class: 'hist' }, [
      el('thead', {}, [el('tr', {}, ['When', 'Problem', 'Level', 'Mode', 'Result', 'Time', 'Tests'].map(function (t) { return el('th', { text: t }); }))]),
      tbody
    ])]));
  }

  function exportHistory() {
    var blob = new Blob([JSON.stringify(history(), null, 2)], { type: 'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: 'interview-history.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ------------------------------------------------------------ splitters */
  function dragger(handle, onMove) {
    handle.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      handle.classList.add('drag');
      var move = function (ev) { onMove(ev); };
      var up = function () {
        handle.classList.remove('drag');
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  }

  /* ------------------------------------------------------------ init */
  function init() {
    // wiring
    ['dlg-start', 'dlg-problems', 'dlg-history', 'dlg-settings'].forEach(function (id) { closeOnBackdrop($(id)); });

    $('btn-theme').addEventListener('click', function () { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'); });
    $('btn-run').addEventListener('click', function () { runCode(false); });
    $('btn-submit').addEventListener('click', function () { runCode(true); });
    $('btn-start').addEventListener('click', openStartDialog);
    $('btn-end').addEventListener('click', endInterviewClicked);
    $('btn-random').addEventListener('click', function () { if (!S.active) loadProblem(pickProblem('Any', true).id); });
    $('btn-problems').addEventListener('click', function () {
      if (S.active) return;
      renderProblemList(); $('dlg-problems').showModal();
    });
    $('pl-search').addEventListener('input', function (e) { plFilter.q = e.target.value; renderProblemList(); });
    $('btn-history').addEventListener('click', function () { renderHistory(); $('dlg-history').showModal(); });
    $('hist-export').addEventListener('click', exportHistory);
    $('hist-clear').addEventListener('click', function () {
      confirmDlg('Clear history?', 'This removes all recorded attempts from this browser.', 'Clear', true).then(function (ok) {
        if (ok) { store.del('history'); renderHistory(); if (S.problem) renderProblem(S.problem); }
      });
    });
    $('start-diff').addEventListener('change', function (e) { $('start-time').value = String(DEFAULT_TIME[e.target.value] || 1800); });
    $('form-start').addEventListener('submit', function (e) {
      var go = e.submitter && e.submitter.value === 'go';
      if (go) startInterview($('start-diff').value, parseInt($('start-time').value, 10));
    });
    $('btn-settings').addEventListener('click', function () {
      $('set-font').value = S.cfg.font; $('set-endpoint').value = S.cfg.endpoint || ''; $('dlg-settings').showModal();
    });
    $('form-settings').addEventListener('submit', function (e) {
      if (!(e.submitter && e.submitter.value === 'save')) return;
      var f = Math.max(11, Math.min(28, parseInt($('set-font').value, 10) || 14));
      S.cfg = { font: f, endpoint: $('set-endpoint').value.trim() };
      store.set('cfg', S.cfg); Ed.setFont(f);
    });
    $('btn-reset').addEventListener('click', function () {
      confirmDlg('Reset code?', 'Clear the editor for this problem.', 'Reset', true).then(function (ok) {
        if (ok && S.problem) { store.del('draft:' + S.problem.id); Ed.set(starterFor(S.problem)); Ed.markers([]); }
      });
    });
    document.addEventListener('keydown', function (e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "'") { e.preventDefault(); runCode(false); }
      else if (mod && e.key === 'Enter') { e.preventDefault(); runCode(true); }
    });

    // splitters
    var main = $('main');
    dragger($('split-v'), function (ev) {
      var r = main.getBoundingClientRect();
      var pct = Math.max(20, Math.min(70, ((ev.clientX - r.left) / r.width) * 100));
      main.style.setProperty('--left', pct + '%');
    });
    dragger($('split-h'), function (ev) {
      var pane = $('pane-right'), r = pane.getBoundingClientRect();
      var px = Math.max(90, Math.min(r.height - 220, r.bottom - ev.clientY));
      pane.style.setProperty('--res-h', px + 'px');
    });

    // debounce-save the draft
    var saveTimer = null;
    Ed.onChange = function () {
      Ed.markers && Ed.markers([]);
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        if (S.problem) store.set('draft:' + S.problem.id, Ed.get());
      }, 500);
    };

    // drafts saved by the first version still contain the old starter template: drop them
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('jk:draft:') === 0 && (localStorage.getItem(k) || '').indexOf('write your solution here') >= 0) localStorage.removeItem(k);
      });
    } catch (e) { /* ignore */ }

    // restore the interview in progress (a refresh must not reset the clock)
    var startId = S.active && byId(S.active.pid) ? S.active.pid : (byId(store.get('last', '')) ? store.get('last', '') : pickProblem('Easy', true).id);
    if (S.active && !byId(S.active.pid)) { S.active = null; store.del('active'); }
    var startCode = store.get('draft:' + startId, null);
    var first = byId(startId);
    initEditor(typeof startCode === 'string' && startCode.length ? startCode : starterFor(first)).then(function () {
      loadProblem(startId);
      if (S.active) { setInterviewUI(true); startTicking(); }
    });
  }

  init();
})();
