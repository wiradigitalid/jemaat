import { C, SERIF, doc, svg, I, card, label, rows, av, avExternal, poster } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * THE OFFICE SIDE OF "THIS WEEK".
 *
 * Found by walking the 26 shipping screens as one story instead of
 * reading them as a list. P1, P2 and P3 all DISPLAY a service time, a
 * speaker, a poster and a sermon recording - and nothing in the release
 * ever creates any of it. Three of twenty-six screens showing data that
 * no screen writes.
 *
 * The obvious fix is four CRUD modules: services, speakers, sermons,
 * announcements. The right fix is that a church does not think in
 * modules - it thinks in weeks. One secretary, one Thursday, one form,
 * and the bulletin is done. So this is a single screen shaped like the
 * ritual it replaces, and it feeds P1, P2, P3 and M20 at once.
 */
export const week = {};

const field = (lab, value, { hint = '', wide = false, muted = false, right = '' } = {}) => `
<div style="display:flex;flex-direction:column;gap:6px;${wide ? 'flex:1 1 auto;' : ''}">
  <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${lab}</span>
  <div style="display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;">
    <span style="flex:1 1 auto;font-size:14px;font-weight:600;color:${muted ? C.ink3 : C.ink};">${value}</span>${right}
  </div>
  ${hint ? `<span style="font-size:11px;color:${C.ink3};line-height:1.4;">${hint}</span>` : ''}
</div>`;

const announceRow = (title, who, on = true) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;">
    <div style="width:18px;height:18px;flex:0 0 18px;border-radius:6px;background:${on ? C.accent : 'transparent'};border:${on ? 'none' : `1.5px solid ${C.line}`};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${on ? svg(I.check, 12, 3) : ''}</div>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13px;font-weight:600;">${title}</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;">${who}</div>
    </div>
    <span style="color:${C.ink3};display:flex;">${svg(I.edit, 17)}</span>
  </div>`;

week['WebWeek.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Sermons')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('This week', 'Saturday 14 March &middot; not published yet &middot; last week went out Thursday 18.40',
      `${wBtn('Preview as a guest', I.search)}${wBtn('Publish', I.check, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

      <div style="width:660px;flex:0 0 660px;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 4px;">${label('The service')}</div>
          <div style="padding:8px 16px 16px;display:flex;flex-direction:column;gap:14px;">
            <div style="display:flex;gap:14px;">
              ${field('DATE AND TIME', 'Saturday 14 March &middot; 09.00', { hint: 'From the church settings. Every Saturday.', wide: true })}
              ${field('WHERE', 'Grace Hall', { wide: true })}
            </div>
            <div style="display:flex;gap:14px;align-items:flex-end;">
              <div style="flex:1 1 auto;">
                ${field('SPEAKER', 'Samuel Kartono', {
                  hint: 'Picked from the roll, past guests, or just typed. He is not on our roll.',
                  right: `<span style="display:inline-flex;align-items:center;gap:7px;">${avExternal('SK', 26)}<span style="color:${C.ink3};display:flex;">${svg(I.chevD, 16)}</span></span>`,
                })}
              </div>
              <div style="flex:1 1 auto;">
                ${field('SERIES AND PART', 'Growing in Prayer &middot; part 3')}
              </div>
            </div>
          </div>`)}

        ${card(`
          <div style="padding:14px 16px 4px;">${label('Poster')}</div>
          <div style="padding:10px 16px 16px;display:flex;gap:16px;align-items:center;">
            ${poster(206, 132, 'THIS WEEK', 'Growing<br>in Prayer', 'Part 3', 'SAT 14 MAR')}
            <div style="flex:1 1 auto;">
              <div style="font-size:13px;font-weight:600;">growing-in-prayer-3.jpg</div>
              <div style="font-size:12px;color:${C.ink2};margin-top:5px;line-height:1.5;">Shown to anyone with the church code, on the home screen and the service page. Leave it empty and the app draws the title instead.</div>
              <div style="display:flex;gap:9px;margin-top:12px;">${wBtn('Replace', I.upload)}${wBtn('Remove', I.x)}</div>
            </div>
          </div>`)}
      </div>

      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 4px;display:flex;align-items:center;gap:10px;">
            <div style="flex:1 1 auto;">${label('Announcements &middot; 3')}</div>
            <span style="font-size:12px;font-weight:700;color:${C.accent};">Add</span>
          </div>
          ${rows([
            announceRow('New members class starts 22 March', 'Church office &middot; runs until 12 April'),
            announceRow('Youth camp registration closes 18 March', 'Youth team &middot; expires after the 18th'),
            announceRow('Choir needs two more altos', 'Music team &middot; no end date'),
          ])}
          <div style="padding:12px 16px;border-top:1px solid ${C.line};font-size:11px;color:${C.ink3};line-height:1.5;">Unticked ones stay saved and come back next week. Anything past its date drops out on its own.</div>`)}

        ${card(`
          <div style="padding:14px 16px 4px;">${label('Last week&rsquo;s recording')}</div>
          <div style="padding:8px 16px 14px;display:flex;flex-direction:column;gap:14px;">
            ${field('YOUTUBE LINK', 'youtu.be/8Kq2mVn4pQe', { hint: 'Title, length and thumbnail are read from the link.' })}
            <div style="display:flex;align-items:center;gap:12px;padding:11px 12px;background:${C.bg};border-radius:12px;">
              ${av('SK', 34)}
              <div style="flex:1 1 auto;min-width:0;">
                <div style="font-size:13px;font-weight:600;">Praying with others</div>
                <div style="font-size:11px;color:${C.ink3};margin-top:3px;">Part 2 &middot; 42 min &middot; Samuel Kartono</div>
              </div>
              <span style="color:${C.sage};display:flex;">${svg(I.check, 17, 2.4)}</span>
            </div>
          </div>`)}

        ${card(`
          <div style="padding:13px 16px 4px;">${label('Did last week land')}</div>
          <div style="padding:4px 16px 12px;display:flex;flex-direction:column;gap:9px;">
            <div style="display:flex;align-items:baseline;gap:10px;"><span style="font-family:${SERIF};font-size:20px;font-weight:600;width:52px;flex:0 0 52px;">312</span><span style="font-size:12px;color:${C.ink2};">opened it &middot; of 486 who follow this church</span></div>
            <div style="display:flex;align-items:baseline;gap:10px;"><span style="font-family:${SERIF};font-size:20px;font-weight:600;width:52px;flex:0 0 52px;">8/12</span><span style="font-size:12px;color:${C.ink2};">care groups recorded who came</span></div>
            <div style="display:flex;align-items:baseline;gap:10px;"><span style="font-family:${SERIF};font-size:20px;font-weight:600;width:52px;flex:0 0 52px;color:${C.amber};">2</span><span style="font-size:12px;color:${C.ink2};">applicants still waiting on you</span></div>
          </div>
          <div style="padding:11px 16px;border-top:1px solid ${C.line};font-size:11px;color:${C.ink3};line-height:1.55;">Not a score. Just whether Thursday was worth it &mdash; ten minutes with no sign it landed is a habit that dies by week six.</div>`, 'border-color:#B4562F55;')}
        <div style="flex:1 1 auto;"></div>
      </div>
    </div>
  </div>
</div>`);
