import React, { useState } from 'react';
import { UploadIcon } from './Icons.tsx';

interface WebDataProps {
  churchName?: string;
  totalMembers?: number;
  onDownloadCategory?: (category: string, format: string) => void;
  onDownloadAll?: () => void;
}

export const WebData: React.FC<WebDataProps> = ({
  churchName = 'Immanuel Church, Sunter',
  totalMembers = 254,
  onDownloadCategory,
  onDownloadAll,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories = [
    {
      id: 'people_households',
      title: 'People and households',
      meta: `${totalMembers} people · 76 households · every field, including the ones we added`,
      format: 'XLSX',
    },
    {
      id: 'meetings_attendance',
      title: 'Meetings and attendance',
      meta: '4 years · 812 meetings · who came, who was marked by hand',
      format: 'XLSX',
    },
    {
      id: 'caregroups_serving',
      title: 'Care groups and serving',
      meta: 'Groups, leaders, hosting rota, serving teams',
      format: 'XLSX',
    },
    {
      id: 'sermons_bulletins',
      title: 'Weeks, sermons, announcements',
      meta: 'Every service, speaker and warta you published',
      format: 'XLSX',
    },
    {
      id: 'media_files',
      title: 'Posters and photos',
      meta: 'The files you uploaded, at the size you uploaded them',
      format: 'ZIP',
    },
    {
      id: 'full_json',
      title: 'Everything, machine readable',
      meta: 'For whoever you hire next. Nothing is held back',
      format: 'JSON',
    },
  ];

  const triggerBlobDownload = (fileName: string, content: string, mime: string) => {
    try {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback in headless testing environment
    }
  };

  const handleDownload = (id: string, format: string, title: string) => {
    setDownloadNotice(`Downloading ${format} export for "${title}"...`);
    setTimeout(() => setDownloadNotice(null), 3000);

    // Instant client-side download generation
    const sampleData = {
      church: churchName,
      dataset: id,
      format: format,
      exported_at: new Date().toISOString(),
      record_count: totalMembers,
    };
    triggerBlobDownload(
      `jemaat-${id}.${format.toLowerCase()}`,
      JSON.stringify(sampleData, null, 2),
      'application/json'
    );

    if (onDownloadCategory) {
      onDownloadCategory(id, format);
    }
  };

  const handleDownloadEverything = () => {
    setDownloadNotice('Packaging complete church database backup bundle...');
    setTimeout(() => setDownloadNotice(null), 3000);

    const fullBundle = {
      church: churchName,
      exported_at: new Date().toISOString(),
      total_members: totalMembers,
      tables: ['people', 'households', 'caregroups', 'serving', 'sermons'],
    };
    triggerBlobDownload(
      'jemaat-complete-backup.json',
      JSON.stringify(fullBundle, null, 2),
      'application/json'
    );

    if (onDownloadAll) {
      onDownloadAll();
    }
  };

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Top Header */}
      <div className="flex items-end justify-between gap-[10px] pb-2 flex-wrap">
        <div>
          <h1 className="font-serif text-[27px] font-medium tracking-[-0.015em] text-ink m-0">
            Your data
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            {churchName} &middot; {totalMembers} people &middot; four years of records &middot; last downloaded today
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadEverything}
          className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white font-semibold text-[13px] hover:bg-accentDark transition-colors cursor-pointer"
        >
          <span className="flex transform rotate-180">
            <UploadIcon size={17} strokeWidth={1.7} />
          </span>
          <span>Download everything</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3.5 bg-sageTint border border-sage/30 text-sage text-[13px] rounded-input flex items-center gap-2">
          <span className="flex transform rotate-180">
            <UploadIcon size={16} />
          </span>
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Two Column Layout matching WebData.dc.html */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0 overflow-y-auto">
        {/* Left Column: Categorical Export List */}
        <div className="w-full lg:w-[648px] lg:flex-[0_0_648px] bg-surface border border-line rounded-card overflow-hidden flex flex-col self-start">
          <div className="p-[14px_16px_4px]">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
              Take it, any time
            </div>
            <div className="text-[12px] text-ink2 mt-[7px] leading-[1.55]">
              It came in as a spreadsheet and it leaves as one. No request form, no waiting period, no asking us — press this on an ordinary Tuesday if you want to see that it works.
            </div>
          </div>

          <div className="divide-y divide-lineSoft mt-3 border-t border-lineSoft">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleDownload(cat.id, cat.format, cat.title)}
                className="flex items-center gap-[14px] p-[12px_16px] hover:bg-surfaceAlt cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">{cat.title}</div>
                  <div className="text-[11px] text-ink3 mt-[3px]">{cat.meta}</div>
                </div>
                <span className="inline-flex items-center h-6 px-[9px] rounded-mark bg-bg text-ink2 border border-line text-[10px] font-bold tracking-[0.04em]">
                  {cat.format}
                </span>
                <span className="text-ink3 flex transform rotate-180">
                  <UploadIcon size={17} strokeWidth={1.7} />
                </span>
              </div>
            ))}
          </div>

          {/* Privacy Footnote */}
          <div className="p-[13px_16px] border-t border-line bg-surfaceAlt flex items-start gap-2.5">
            <span className="text-ink3 flex pt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="10.6" width="14" height="9.4" rx="2.2"/>
                <path d="M8.4 10.6V8.2a3.6 3.6 0 0 1 7.2 0v2.4"/>
              </svg>
            </span>
            <div className="text-[12px] text-ink2 leading-[1.55]">
              Only the office can download this, and every download is logged with a name and a date — the same list is {totalMembers} people&rsquo;s phone numbers.<br /><br />
              <span className="font-bold text-ink">Addresses are left out unless you ask for them.</span> The common case is wanting a phone list, and it should not also hand over a map of where everyone lives.
            </div>
          </div>
        </div>

        {/* Right Column: "Or run it yourself" & "Close this church" (from WebData.dc.html) */}
        <div className="flex-1 min-w-0 flex flex-col gap-[18px]">
          {/* Panel 1: Or run it yourself */}
          <div className="bg-surface border border-line rounded-card border-opacity-70 p-4">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3 mb-2">
              Or run it yourself
            </div>
            <div className="text-[12px] text-ink2 leading-[1.6] mb-3.5">
              Jemaat is open source under the MIT licence. The JSON above restores into your own installation, on your own server, with no key to ask us for and no permission to seek.<br /><br />
              Churches that outlast their software are churches that could always leave it.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Read how
              </button>
              <button
                type="button"
                className="h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                The source
              </button>
            </div>
          </div>

          {/* Panel 2: Close this church */}
          <div className="bg-surface border border-line rounded-card p-4 flex flex-col gap-2.5">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3 mb-1">
              Close this church
            </div>
            <div className="flex items-start gap-2.5 text-[12px] text-ink2 leading-[1.5]">
              <span className="text-ink3 pt-0.5">&times;</span>
              <span>Church code stops working. Nobody new can find you.</span>
            </div>
            <div className="flex items-start gap-2.5 text-[12px] text-ink2 leading-[1.5]">
              <span className="text-ink3 pt-0.5">&times;</span>
              <span>Members lose this church in their app. They keep their own account and any other church.</span>
            </div>
            <div className="flex items-start gap-2.5 text-[12px] text-ink2 leading-[1.5]">
              <span className="text-amber pt-0.5">&bull;</span>
              <span>Nothing is deleted for 30 days. Say the word and it all comes back.</span>
            </div>
            <div className="flex items-start gap-2.5 text-[12px] text-ink2 leading-[1.5]">
              <span className="text-sage pt-0.5">&check;</span>
              <span>Download first. After 30 days we cannot get it for you.</span>
            </div>
            <div className="pt-2">
              <button
                type="button"
                className="w-full h-[44px] rounded-input border border-accentDark text-accentDark font-semibold text-[13.5px] hover:bg-accentTint transition-colors cursor-pointer"
              >
                Close {churchName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
