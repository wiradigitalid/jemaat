import { C, SERIF, doc, svg, I, card, label, rows } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * GETTING EVERYTHING BACK OUT.
 *
 * No screen in 51 knew how a church leaves - and a product that holds
 * data hostage is one no church committee will vote to enter. In
 * Indonesia that committee has usually been burned before: a vendor
 * folded, or the volunteer who built the Access database moved away.
 *
 * Three positions this screen takes:
 *
 * EXPORT IS ALWAYS ON, not a leaving ritual. A button you can press any
 * Tuesday proves the promise before anyone needs it; a 30-day grace
 * period on the way out proves nothing.
 *
 * IT COMES BACK AS EXCEL, because that is what it arrived as (W5) and
 * what a church secretary can actually open. The JSON is for whoever
 * they hire next.
 *
 * DELETING IS SLOWER THAN LEAVING. A committee decision can be
 * reversed, and a church that deletes in anger has burned its own
 * membership roll.
 */
export const data = {};

const pack = (name, meta, fmt) =>
  `<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;">
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13px;font-weight:600;">${name}</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;">${meta}</div>
    </div>
    <span style="display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:6px;background:${C.bg};color:${C.ink2};font-size:10px;font-weight:700;letter-spacing:0.04em;">${fmt}</span>
    <span style="color:${C.ink3};display:flex;transform:rotate(180deg);">${svg(I.upload, 17)}</span>
  </div>`;

const happens = (icon, t, tone = C.ink3) =>
  `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 16px;">
    <span style="color:${tone};display:flex;padding-top:2px;">${svg(icon, 14, 2.2)}</span>
    <span style="font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
  </div>`;

data['WebData.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Settings')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Your data', 'Grace Community Church &middot; 254 people &middot; four years of records &middot; last downloaded never',
      `${wBtn('Download everything', I.upload, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

      <div style="width:648px;flex:0 0 648px;">
        ${card(`
          <div style="padding:14px 16px 4px;">${label('Take it, any time')}
            <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.55;">It came in as a spreadsheet and it leaves as one. No request form, no waiting period, no asking us &mdash; press this on an ordinary Tuesday if you want to see that it works.</div>
          </div>
          ${rows([
            pack('People and households', '254 people &middot; 76 households &middot; every field, including the ones we added', 'XLSX'),
            pack('Meetings and attendance', '4 years &middot; 812 meetings &middot; who came, who was marked by hand', 'XLSX'),
            pack('Care groups and serving', 'Groups, leaders, hosting rota, serving teams', 'XLSX'),
            pack('Weeks, sermons, announcements', 'Every service, speaker and warta you published', 'XLSX'),
            pack('Posters and photos', 'The files you uploaded, at the size you uploaded them', 'ZIP'),
            pack('Everything, machine readable', 'For whoever you hire next. Nothing is held back', 'JSON'),
          ])}
          <div style="padding:13px 16px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">Only the office can download this, and every download is logged with a name and a date &mdash; the same list is 254 people&rsquo;s phone numbers.<br><br><span style="font-weight:700;">Addresses are left out unless you ask for them.</span> The common case is wanting a phone list, and it should not also hand over a map of where everyone lives.</span>
          </div>`)}
      </div>

      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 8px;">${label('Or run it yourself')}</div>
          <div style="padding:0 16px 14px;font-size:12px;color:${C.ink2};line-height:1.6;">Jemaat is open source under the MIT licence. The JSON above restores into your own installation, on your own server, with no key to ask us for and no permission to seek.<br><br>Churches that outlast their software are churches that could always leave it.</div>
          <div style="padding:0 16px 16px;display:flex;gap:9px;">${wBtn('Read how', I.help)}${wBtn('The source', I.grid)}</div>`, 'border-color:#B4562F55;')}

        ${card(`
          <div style="padding:14px 16px 8px;">${label('Close this church')}</div>
          ${happens(I.x, 'GRACE-BDG stops working. Nobody new can find you.')}
          ${happens(I.x, 'Members lose this church in their app. They keep their own account and any other church.')}
          ${happens(I.clock, 'Nothing is deleted for 30 days. Say the word and it all comes back.', C.amber)}
          ${happens(I.check, 'Download first. After 30 days we cannot get it for you.', C.sage)}
          <div style="padding:14px 16px 16px;">
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;height:44px;border-radius:12px;border:1px solid ${C.accentDark};color:${C.accentDark};font-size:14px;font-weight:600;">${svg(I.out, 17)}<span>Close Grace Community Church</span></div>
          </div>`)}
        <div style="flex:1 1 auto;"></div>
      </div>
    </div>
  </div>
</div>`);
