/* The page's own runtime. Kept as a separate file so the build can inline it
   verbatim; at runtime the page reads this same text back out of its own DOM
   to reproduce itself on save, so there is no quine to maintain. */
export const APP_JS = String.raw`
(function () {
  'use strict';

  var RELS = [
    { k: 0,   label: 'R0',    cls: 'r0', title: 'Pilot church' },
    { k: 1,   label: 'R1',    cls: 'r1', title: 'Open the doors' },
    { k: 2,   label: 'R2',    cls: 'r2', title: 'Keep the promises' },
    { k: 'L', label: 'later', cls: 'rl', title: 'Parked, with a reason' }
  ];
  var relOf = function (k) { return RELS.find(function (r) { return String(r.k) === String(k); }) || RELS[3]; };

  var root  = document.getElementById('root');
  var state = JSON.parse(document.getElementById('state').textContent);
  var api   = null;          // the artifact namespace, once it resolves
  var mode  = 'unknown';     // unknown | writable | readonly
  var dirty = false;
  var filter = 'all';        // local only, never saved
  var STASH  = 'jemaat-register-stash';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fingerprint(o) {
    var s = JSON.stringify(o), h = 5381;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return s.length + ':' + h;
  }
  var allFrs = function () {
    return state.caps.reduce(function (a, c) { return a.concat(c.frs); }, []);
  };
  var counts = function () {
    var f = allFrs();
    var on = f.filter(function (x) { return x.on !== false; });
    return {
      total: f.length,
      on: on.length,
      off: f.length - on.length,
      r0: on.filter(function (x) { return String(x.rel) === '0'; }).length,
      r1: on.filter(function (x) { return String(x.rel) === '1'; }).length,
      r2: on.filter(function (x) { return String(x.rel) === '2'; }).length,
      later: on.filter(function (x) { return String(x.rel) === 'L'; }).length,
      nots: on.filter(function (x) { return x.not; }).length,
      notes: f.filter(function (x) { return (x.note || '').trim(); }).length
    };
  };
  function passes(fr) {
    if (filter === 'all') return true;
    if (filter === 'notes') return !!(fr.note || '').trim();
    if (filter === 'off') return fr.on === false;
    if (filter === 'not') return !!fr.not && fr.on !== false;
    return String(fr.rel) === filter && fr.on !== false;
  }

  /* ---------- persistence ---------- */
  var stashTimer = null;
  function touch() {
    dirty = true;
    paintSave();
    clearTimeout(stashTimer);
    stashTimer = setTimeout(function () {
      try {
        sessionStorage.setItem(STASH, JSON.stringify({ base: state.base, state: state }));
      } catch (e) { /* private window, quota, or a host that blocks storage */ }
    }, 500);
  }
  function restoreStash() {
    try {
      var raw = sessionStorage.getItem(STASH);
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s || s.base !== state.base) { sessionStorage.removeItem(STASH); return false; }
      state = s.state; dirty = true; return true;
    } catch (e) { return false; }
  }

  /* ---------- the document this page publishes as its next version ---------- */
  function renderDocument() {
    var css = document.getElementById('css').textContent;
    var app = document.getElementById('app').textContent;
    var out = JSON.parse(JSON.stringify(state));
    out.base = fingerprint(out.caps);
    out.savedAt = new Date().toISOString().slice(0, 10);
    return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
      '<title>Jemaat Capability Register</title>\n' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">\n' +
      '<style id="css">' + css + '</style>\n</head>\n<body>\n' +
      '<script type="application/json" id="state">' + JSON.stringify(out) + '<\/script>\n' +
      '<div id="root"></div>\n' +
      '<script id="app">' + app + '<\/script>\n</body>\n</html>';
  }

  /* ---------- save ---------- */
  function paintSave() {
    var b = document.getElementById('save');
    if (!b) return;
    if (mode === 'readonly') {
      b.textContent = 'Read only'; b.disabled = true; b.className = 'save ro'; return;
    }
    b.disabled = !dirty;
    b.className = 'save' + (dirty ? ' on' : '');
    b.textContent = dirty ? 'Save changes' : 'Saved';
  }
  function saveNow() {
    if (!api || !dirty || mode === 'readonly') return;
    var b = document.getElementById('save');
    b.disabled = true; b.textContent = 'Saving…';
    api.publish(renderDocument()).then(function () {
      try { sessionStorage.removeItem(STASH); } catch (e) {}
      // this view reloads to the new version; nothing else to do
    }).catch(function (err) {
      var code = (err && err.code) || 'upstream_error';
      if (code === 'not_writer' || code === 'not_granted' || code === 'not_declared' ||
          code === 'capability_disabled' || code === 'capability_removed' ||
          code === 'consent_required') {
        mode = 'readonly'; paintSave(); note('This view can read but not save. Your edits stay on screen.');
        return;
      }
      if (code === 'conflict') { note('Someone saved first — reloading to their version.'); return; }
      if (code === 'too_large') { note('Too large to save. Remove a few notes and try again.'); }
      else if (code === 'rate_limited') { note('Saving too often. Wait a moment and press Save again.'); }
      else { note('Could not save just now. Your edits are still here — try Save again.'); }
      paintSave();
    });
  }
  function note(msg) {
    var n = document.getElementById('toast');
    n.textContent = msg; n.hidden = false;
    clearTimeout(note._t); note._t = setTimeout(function () { n.hidden = true; }, 6000);
  }

  /* ---------- render ---------- */
  function frRow(cap, fr, i) {
    var r = relOf(fr.rel);
    var off = fr.on === false;
    return '' +
    '<div class="fr' + (fr.not ? ' isnot' : '') + (off ? ' isoff' : '') + '" data-c="' + cap.id + '" data-i="' + i + '">' +
      '<label class="tick"><input type="checkbox" ' + (off ? '' : 'checked') + ' data-act="toggle" aria-label="Include this requirement"><span></span></label>' +
      '<div class="frid mono">FR-' + cap.id + '.' + (i + 1) + '</div>' +
      '<div class="frbody">' +
        '<div class="frtext" contenteditable="true" spellcheck="false" data-act="text">' +
          (fr.not ? '<b class="nottag" contenteditable="false">must not</b> ' : '') + esc(fr.t) +
        '</div>' +
        '<textarea class="note" rows="1" placeholder="Add a note…" data-act="note">' + esc(fr.note || '') + '</textarea>' +
      '</div>' +
      '<button class="rel ' + r.cls + '" data-act="rel" title="' + r.title + ' — click to change">' + r.label + '</button>' +
      '<div class="frev mono" contenteditable="true" spellcheck="false" data-act="ev">' + esc(fr.ev || '') + '</div>' +
      '<button class="kill" data-act="kill" title="Remove this requirement" aria-label="Remove">×</button>' +
    '</div>';
  }
  function capBlock(cap) {
    var rows = cap.frs.map(function (fr, i) { return passes(fr) ? frRow(cap, fr, i) : ''; }).join('');
    var shown = cap.frs.filter(passes).length;
    if (!shown && filter !== 'all') return '';
    return '' +
    '<section class="cap" data-c="' + cap.id + '">' +
      '<header class="caphead">' +
        '<div class="capid mono">CAP-' + cap.id + '</div>' +
        '<div class="capmain"><h3 contenteditable="true" spellcheck="false" data-act="capname">' + esc(cap.name) + '</h3>' +
        '<p>' + esc(cap.what) + '</p></div>' +
        '<div class="capcount mono">' + shown + (shown === cap.frs.length ? '' : ' of ' + cap.frs.length) + ' FR</div>' +
      '</header>' +
      '<div class="frs">' + rows + '</div>' +
      '<button class="addfr" data-act="add">+ Add a requirement to CAP-' + cap.id + '</button>' +
    '</section>';
  }
  function chip(id, label, n) {
    return '<button class="chip' + (filter === id ? ' on' : '') + '" data-filter="' + id + '">' +
      label + '<b>' + n + '</b></button>';
  }
  function render() {
    var c = counts();
    root.innerHTML = '' +
    '<div class="wrap">' +
      '<div class="masthead">' +
        '<div class="eyebrow">Working draft &middot; edit here, then save</div>' +
        '<h1>Jemaat Capability Register</h1>' +
        '<p class="standfirst">' + state.caps.length + ' capabilities read off the 70-artboard design, each requirement naming the screen that is its evidence. Untick what does not belong, change a release, leave a note, add what is missing. Saving keeps it for everyone with the link &mdash; and makes it readable back into an SRS.</p>' +
      '</div>' +

      '<div class="bar">' +
        '<div class="chips">' +
          chip('all', 'All', c.total) +
          chip('0', 'R0', c.r0) + chip('1', 'R1', c.r1) + chip('2', 'R2', c.r2) + chip('L', 'Later', c.later) +
          chip('not', 'Must not', c.nots) +
          chip('notes', 'With notes', c.notes) +
          chip('off', 'Excluded', c.off) +
        '</div>' +
        '<button class="save" id="save">Saved</button>' +
      '</div>' +

      '<div class="tally">' +
        '<div><b>' + c.on + '</b><span>in scope</span></div>' +
        '<div><b>' + c.r0 + '</b><span>R0, the pilot</span></div>' +
        '<div><b>' + c.r1 + '</b><span>R1</span></div>' +
        '<div><b>' + c.r2 + '</b><span>R2</span></div>' +
        '<div><b>' + c.later + '</b><span>parked</span></div>' +
        '<div class="ox"><b>' + c.nots + '</b><span>must not</span></div>' +
        '<div class="mut"><b>' + c.off + '</b><span>excluded</span></div>' +
      '</div>' +

      state.caps.map(capBlock).join('') +

      '<p class="foot">Extracted from 70 artboards over 41 design iterations. Nothing here is built. Requirement numbers renumber as rows are added or removed, so they are not stable identifiers until an SRS registers them.' +
      (state.savedAt ? ' Last saved ' + esc(state.savedAt) + '.' : '') + '</p>' +
    '</div>' +
    '<div class="toast" id="toast" hidden></div>';
    paintSave();
    sizeNotes();
  }
  function sizeNotes() {
    root.querySelectorAll('textarea.note').forEach(function (t) {
      t.style.height = 'auto';
      t.style.height = (t.scrollHeight + 2) + 'px';
    });
  }

  /* ---------- locate the model behind a row ---------- */
  function find(el) {
    var row = el.closest('.fr');
    if (!row) return null;
    var cap = state.caps.find(function (c) { return c.id === row.dataset.c; });
    return cap ? { cap: cap, i: +row.dataset.i, fr: cap.frs[+row.dataset.i], row: row } : null;
  }

  /* ---------- events ---------- */
  root.addEventListener('click', function (e) {
    var f = e.target.closest('[data-filter]');
    if (f) { filter = f.dataset.filter; render(); return; }
    if (e.target.id === 'save') { saveNow(); return; }

    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var act = btn.dataset.act;

    if (act === 'add') {
      var cid = btn.closest('.cap').dataset.c;
      var cap = state.caps.find(function (c) { return c.id === cid; });
      cap.frs.push({ t: '', rel: 0, ev: '', not: false, on: true, note: '' });
      touch(); filter = 'all'; render();
      var rows = root.querySelectorAll('.cap[data-c="' + cid + '"] .fr .frtext');
      var last = rows[rows.length - 1];
      if (last) { last.focus(); }
      return;
    }
    if (act === 'kill') {
      var h = find(btn); if (!h) return;
      h.cap.frs.splice(h.i, 1); touch(); render(); return;
    }
    if (act === 'rel') {
      var g = find(btn); if (!g) return;
      var idx = RELS.findIndex(function (r) { return String(r.k) === String(g.fr.rel); });
      g.fr.rel = RELS[(idx + 1) % RELS.length].k;
      touch();
      var nr = relOf(g.fr.rel);
      btn.className = 'rel ' + nr.cls; btn.textContent = nr.label; btn.title = nr.title + ' — click to change';
      refreshCounts();
      return;
    }
  });

  root.addEventListener('change', function (e) {
    if (e.target.dataset.act !== 'toggle') return;
    var h = find(e.target); if (!h) return;
    h.fr.on = e.target.checked;
    h.row.classList.toggle('isoff', !e.target.checked);
    touch(); refreshCounts();
  });

  root.addEventListener('input', function (e) {
    var act = e.target.dataset.act;
    if (act === 'note') {
      var h = find(e.target); if (!h) return;
      h.fr.note = e.target.value;
      e.target.style.height = 'auto'; e.target.style.height = (e.target.scrollHeight + 2) + 'px';
      touch(); return;
    }
    if (act === 'text') {
      var g = find(e.target); if (!g) return;
      var clone = e.target.cloneNode(true);
      var tag = clone.querySelector('.nottag'); if (tag) tag.remove();
      g.fr.t = clone.textContent.trim();
      touch(); return;
    }
    if (act === 'ev') {
      var k = find(e.target); if (!k) return;
      k.fr.ev = e.target.textContent.trim(); touch(); return;
    }
    if (act === 'capname') {
      var cap = state.caps.find(function (c) { return c.id === e.target.closest('.cap').dataset.c; });
      if (cap) { cap.name = e.target.textContent.trim(); touch(); }
    }
  });

  /* keep contenteditable to plain text */
  root.addEventListener('paste', function (e) {
    if (!e.target.isContentEditable) return;
    e.preventDefault();
    var t = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, t.replace(/\s+/g, ' '));
  });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.isContentEditable) { e.preventDefault(); e.target.blur(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveNow(); }
  });

  function refreshCounts() {
    var c = counts();
    var t = root.querySelectorAll('.tally b');
    if (t.length >= 7) {
      var vals = [c.on, c.r0, c.r1, c.r2, c.later, c.nots, c.off];
      for (var i = 0; i < 7; i++) t[i].textContent = vals[i];
    }
    root.querySelectorAll('.chip').forEach(function (ch) {
      var m = { all: c.total, '0': c.r0, '1': c.r1, '2': c.r2, L: c.later, not: c.nots, notes: c.notes, off: c.off };
      var b = ch.querySelector('b'); if (b) b.textContent = m[ch.dataset.filter];
    });
  }

  window.addEventListener('beforeunload', function (e) {
    if (dirty && mode !== 'readonly') { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- boot ---------- */
  if (!state.base) state.base = fingerprint(state.caps);
  var restored = restoreStash();
  render();
  if (restored) note('Unsaved edits from this session were put back.');

  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('artifact').then(function (ns) {
      api = ns;
      if (!ns) { mode = 'readonly'; }
      else if (mode === 'unknown') { mode = 'writable'; }
      paintSave();
    }).catch(function () { mode = 'readonly'; paintSave(); });
  } else {
    mode = 'readonly'; paintSave();
  }
})();
`;
