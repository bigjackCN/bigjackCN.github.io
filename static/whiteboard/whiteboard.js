/*
 * whiteboard.js - a plain Java editor and nothing else.
 * No highlighting, no autocomplete, no indentation help, no compiler, no test cases:
 * like coding on a whiteboard or in a shared doc during an interview.
 * What you type stays in this browser, so a refresh does not lose it.
 */
(function () {
  'use strict';

  var KEY = 'jk:whiteboard';

  var code = document.getElementById('code');
  var btnClear = document.getElementById('btn-clear');

  try { code.value = localStorage.getItem(KEY) || ''; } catch (e) { /* ignore */ }

  code.addEventListener('input', function () {
    try { localStorage.setItem(KEY, code.value); } catch (e) { /* ignore */ }
  });

  // Tab does nothing on purpose: indent with spaces yourself, the way a real whiteboard works.
  code.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') e.preventDefault();
  });

  btnClear.addEventListener('click', function () {
    if (code.value && !confirm('Clear the editor?')) return;
    code.value = '';
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    code.focus();
  });
})();
