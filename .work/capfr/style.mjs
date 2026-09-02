/* Ledger paper, fountain-pen ink, column rules. Deliberately not the app's
   own palette — this is the book the app is specified in, not the app. */
export const CSS = String.raw`
:root{
  --paper:#F7F8FA; --surface:#FFFFFF; --ink:#16202B; --ink2:#4C5A69; --ink3:#8494A3;
  --rule:#DDE3EA; --rule-soft:#EDF1F5; --accent:#1D4E7E; --accent-soft:#E7EEF5;
  --oxide:#8C3A2E; --oxide-soft:#F7EBE8; --moss:#2F6B4F; --moss-soft:#E7F0EB;
  --shade:#F1F4F7;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --paper:#111820; --surface:#18212B; --ink:#E6ECF2; --ink2:#A5B3C1; --ink3:#71818F;
    --rule:#2A3542; --rule-soft:#212B36; --accent:#7FB2DE; --accent-soft:#1B2B3A;
    --oxide:#D89184; --oxide-soft:#32231F; --moss:#8CC0A4; --moss-soft:#1B2A22;
    --shade:#141C24;
  }
}
:root[data-theme="dark"]{
  --paper:#111820; --surface:#18212B; --ink:#E6ECF2; --ink2:#A5B3C1; --ink3:#71818F;
  --rule:#2A3542; --rule-soft:#212B36; --accent:#7FB2DE; --accent-soft:#1B2B3A;
  --oxide:#D89184; --oxide-soft:#32231F; --moss:#8CC0A4; --moss-soft:#1B2A22;
  --shade:#141C24;
}

*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  background:var(--paper); color:var(--ink);
  font-family:"IBM Plex Sans","Segoe UI",system-ui,sans-serif;
  font-size:15px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace; font-variant-numeric:tabular-nums}
.wrap{max-width:1160px; margin:0 auto; padding:52px 26px 90px}
:focus-visible{outline:2px solid var(--accent); outline-offset:2px; border-radius:2px}

/* masthead */
.eyebrow{font-family:"IBM Plex Mono",monospace; font-size:11px; font-weight:600;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ink3)}
h1{font-family:"Zilla Slab",Georgia,serif; font-weight:600; font-size:clamp(30px,4.2vw,44px);
  line-height:1.1; letter-spacing:-.01em; margin:14px 0 0; text-wrap:balance}
.standfirst{margin:15px 0 0; max-width:66ch; color:var(--ink2); font-size:15.5px}
.masthead{border-bottom:2px solid var(--ink); padding-bottom:24px}

/* toolbar */
.bar{position:sticky; top:0; z-index:5; display:flex; flex-wrap:wrap; gap:12px;
  align-items:center; padding:12px 0; margin-top:8px;
  background:var(--paper); border-bottom:1px solid var(--rule)}
.chips{display:flex; flex-wrap:wrap; gap:6px; flex:1 1 auto}
.chip{font-family:"IBM Plex Sans",sans-serif; font-size:12.5px; font-weight:500;
  color:var(--ink2); background:var(--surface); border:1px solid var(--rule);
  border-radius:2px; padding:5px 9px; cursor:pointer; display:inline-flex; gap:7px; align-items:baseline}
.chip:hover{border-color:var(--ink3)}
.chip b{font-family:"IBM Plex Mono",monospace; font-size:11px; font-variant-numeric:tabular-nums; color:var(--ink3)}
.chip.on{background:var(--ink); border-color:var(--ink); color:var(--paper)}
.chip.on b{color:var(--paper); opacity:.7}

.save{font-family:"IBM Plex Sans",sans-serif; font-size:13px; font-weight:600;
  padding:8px 16px; border-radius:2px; border:1px solid var(--rule);
  background:var(--surface); color:var(--ink3); cursor:default}
.save.on{background:var(--accent); border-color:var(--accent); color:#fff; cursor:pointer}
.save.ro{border-style:dashed}

/* tally */
.tally{display:flex; flex-wrap:wrap; gap:1px; background:var(--rule);
  border:1px solid var(--rule); margin:22px 0 0}
.tally > div{background:var(--surface); padding:13px 18px; flex:1 1 120px}
.tally b{display:block; font-family:"Zilla Slab",Georgia,serif; font-size:26px;
  font-weight:600; line-height:1.1; font-variant-numeric:tabular-nums}
.tally span{display:block; font-size:12px; color:var(--ink3); margin-top:3px}
.tally .ox b{color:var(--oxide)}
.tally .mut b{color:var(--ink3)}

/* capability */
.cap{margin-top:30px; border:1px solid var(--rule); background:var(--surface)}
.caphead{display:flex; gap:16px; align-items:flex-start; padding:16px 20px;
  border-bottom:1px solid var(--rule); background:var(--shade)}
.capid{font-size:12px; font-weight:600; color:var(--accent); padding-top:3px; white-space:nowrap}
.capmain{flex:1 1 auto; min-width:0}
.caphead h3{font-family:"Zilla Slab",Georgia,serif; font-size:18.5px; font-weight:600; margin:0}
.caphead p{margin:5px 0 0; font-size:13px; color:var(--ink2); max-width:70ch}
.capcount{margin-left:auto; font-size:11px; color:var(--ink3); white-space:nowrap; padding-top:5px}

/* one requirement */
.fr{display:grid; grid-template-columns:28px 72px 1fr 62px 118px 26px; gap:14px;
  padding:11px 20px; border-bottom:1px solid var(--rule-soft); align-items:start}
.fr:last-child{border-bottom:none}
.fr.isnot{background:var(--oxide-soft); box-shadow:inset 3px 0 0 var(--oxide)}
.fr.isoff{opacity:.42}
.fr.isoff .frtext{text-decoration:line-through; text-decoration-color:var(--ink3)}

.tick{display:inline-flex; align-items:center; justify-content:center;
  width:28px; height:24px; cursor:pointer}
.tick input{position:absolute; opacity:0; width:0; height:0}
.tick span{width:16px; height:16px; border:1.5px solid var(--ink3); border-radius:2px; display:block}
.tick input:checked + span{background:var(--accent); border-color:var(--accent);
  background-image:linear-gradient(45deg,transparent 42%,#fff 42%,#fff 52%,transparent 52%),
                   linear-gradient(-45deg,transparent 60%,#fff 60%,#fff 70%,transparent 70%)}
.tick input:focus-visible + span{outline:2px solid var(--accent); outline-offset:2px}

.frid{font-size:11.5px; font-weight:600; color:var(--ink3); white-space:nowrap; padding-top:3px}
.fr.isnot .frid{color:var(--oxide)}
.frbody{min-width:0}
.frtext{font-size:14px; line-height:1.55; border-radius:2px; padding:1px 2px; margin:-1px -2px}
.frtext:focus{background:var(--accent-soft); outline:none}
.frtext:empty::before{content:"New requirement — write it as one testable sentence"; color:var(--ink3)}
.nottag{font-family:"IBM Plex Mono",monospace; font-size:9.5px; font-weight:600;
  letter-spacing:.1em; text-transform:uppercase; color:var(--oxide);
  border:1px solid var(--oxide); border-radius:2px; padding:1px 5px; margin-right:5px;
  white-space:nowrap; vertical-align:1px}

.note{display:block; width:100%; margin-top:6px; resize:none; overflow:hidden;
  font-family:"IBM Plex Sans",sans-serif; font-size:12.5px; line-height:1.5;
  color:var(--ink2); background:transparent; border:none; border-left:2px solid var(--rule);
  padding:1px 0 1px 9px}
.note::placeholder{color:var(--ink3); opacity:.7}
.note:focus{outline:none; border-left-color:var(--accent); color:var(--ink)}
.note:not(:placeholder-shown){border-left-color:var(--accent)}

.rel{font-family:"IBM Plex Mono",monospace; font-size:10px; font-weight:600;
  letter-spacing:.04em; padding:3px 7px; border-radius:2px; border:1px solid transparent;
  cursor:pointer; white-space:nowrap; margin-top:1px}
.r0{background:var(--moss-soft); color:var(--moss)}
.r1{background:var(--accent-soft); color:var(--accent)}
.r2{background:var(--rule-soft); color:var(--ink2)}
.rl{border-color:var(--rule); color:var(--ink3); background:transparent}
.rel:hover{border-color:currentColor}

.frev{font-size:11px; color:var(--ink3); padding-top:3px; border-radius:2px}
.frev:focus{background:var(--accent-soft); color:var(--ink); outline:none}
.frev:empty::before{content:"evidence"; opacity:.6}

.kill{border:none; background:transparent; color:var(--ink3); font-size:17px; line-height:1;
  cursor:pointer; padding:2px 4px; border-radius:2px}
.kill:hover{color:var(--oxide); background:var(--oxide-soft)}

.addfr{display:block; width:100%; text-align:left; padding:11px 20px;
  border:none; border-top:1px dashed var(--rule); background:transparent;
  font-family:"IBM Plex Sans",sans-serif; font-size:12.5px; font-weight:500;
  color:var(--accent); cursor:pointer}
.addfr:hover{background:var(--accent-soft)}

.foot{margin-top:40px; padding-top:18px; border-top:1px solid var(--rule);
  font-size:12.5px; color:var(--ink3); max-width:74ch}

.toast{position:fixed; left:50%; bottom:26px; transform:translateX(-50%);
  background:var(--ink); color:var(--paper); font-size:13px; padding:10px 16px;
  border-radius:3px; z-index:20; max-width:min(560px,90vw)}

@media (max-width:860px){
  .fr{grid-template-columns:28px 1fr 26px; gap:10px}
  .frid{grid-column:2; color:var(--accent); padding-top:0}
  .frbody{grid-column:2}
  .rel{grid-column:2; justify-self:start}
  .frev{grid-column:2; padding-top:0}
}
@media (prefers-reduced-motion:reduce){*{animation:none !important; transition:none !important}}
`;
