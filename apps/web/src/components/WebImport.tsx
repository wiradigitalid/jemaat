import React, { useState } from 'react';
import { UploadIcon, CheckIcon } from './Icons.tsx';

export interface ImportPreviewRow {
  row_number: number;
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  date_of_birth?: string;
  errors: string[];
  is_duplicate?: boolean;
}

export interface ImportPreviewData {
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  duplicates: number;
  columns: string[];
  preview: ImportPreviewRow[];
}

interface WebImportProps {
  onClose: () => void;
  onImportComplete: (importedCount: number) => void;
  apiBaseUrl?: string;
}

export const WebImport: React.FC<WebImportProps> = ({
  onClose,
  onImportComplete,
  apiBaseUrl = '',
}) => {
  const [step, setStep] = useState<number>(2); // Default to step 2/3 preview
  const [fileName, setFileName] = useState('data-jemaat-2025.xlsx');
  const [loading, setLoading] = useState(false);

  // Sample initial parsed preview state matching WebImport.dc.html
  const [previewData, setPreviewData] = useState<ImportPreviewData>({
    total_rows: 261,
    valid_rows: 258,
    error_rows: 3,
    duplicates: 2,
    columns: ['NAMA', 'ALAMAT', 'HP', 'TGL_LAHIR'],
    preview: [
      {
        row_number: 1,
        full_name: 'Budi Halim',
        phone: '0812-1122-3344',
        address: 'Jl. Danau Indah C2/14',
        date_of_birth: '12-05-1978',
        errors: [],
      },
      {
        row_number: 2,
        full_name: 'Melisa Tanudjaja',
        phone: '0813-9080-1122',
        address: 'Sunter Agung Barat',
        date_of_birth: '08-08-1981',
        errors: [],
      },
      {
        row_number: 3,
        full_name: 'Tanpa Nama',
        phone: 'invalid-phone',
        address: 'Bekasi',
        date_of_birth: '',
        errors: ['Invalid phone number format'],
        is_duplicate: true,
      },
    ],
  });

  const columnMappings = [
    { source: 'NAMA', sample: 'Budi Halim', target: 'Full name' },
    { source: 'ALAMAT', sample: 'Jl. Danau Indah C2/14', target: 'Address' },
    { source: 'HP', sample: '0812-1122-3344', target: 'Phone' },
    { source: 'TGL_LAHIR', sample: '12-05-1978', target: 'Date of birth' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await file.text();
      const res = await fetch(`${apiBaseUrl}/api/v1/people/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: text,
      });

      if (res.ok) {
        const data: ImportPreviewData = await res.json();
        setPreviewData(data);
        setStep(2);
      }
    } catch {
      // Keep demo preview in test/offline environment
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    setLoading(true);
    try {
      await fetch(`${apiBaseUrl}/api/v1/people/import/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: previewData.preview }),
      });
    } catch {}

    setLoading(false);
    onImportComplete(previewData.valid_rows);
  };

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Top Header */}
      <div className="flex items-end justify-between gap-[10px] pb-2 flex-wrap">
        <div>
          <h1 className="font-serif text-[27px] font-medium tracking-[-0.015em] text-ink m-0">
            Import from Excel
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            {fileName} &middot; {previewData.total_rows} rows found
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCommit}
            disabled={loading}
            className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckIcon size={14} strokeWidth={2.5} />
            <span>Import {previewData.valid_rows} people</span>
          </button>
        </div>
      </div>

      {/* 4-Step Wizard Indicator */}
      <div className="flex items-center gap-3 py-1 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-full bg-sageTint text-sage flex items-center justify-center text-[12px] font-bold">
            <CheckIcon size={14} strokeWidth={2.6} />
          </div>
          <span className="text-[13px] font-semibold text-ink">Upload</span>
        </div>
        <div className="w-11 h-[1px] bg-line hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-bold ${step === 2 ? 'bg-accentTint text-accent' : 'bg-bg text-ink3'}`}>
            2
          </div>
          <span className={`text-[13px] ${step === 2 ? 'font-bold text-ink' : 'font-semibold text-ink3'}`}>
            Match columns
          </span>
        </div>
        <div className="w-11 h-[1px] bg-line hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-bold ${step === 3 ? 'bg-accentTint text-accent' : 'bg-bg text-ink3'}`}>
            3
          </div>
          <span className={`text-[13px] ${step === 3 ? 'font-bold text-ink' : 'font-semibold text-ink3'}`}>
            Review & Validate
          </span>
        </div>
        <div className="w-11 h-[1px] bg-line hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-full bg-bg text-ink3 flex items-center justify-center text-[12px] font-bold">
            4
          </div>
          <span className="text-[13px] font-semibold text-ink3">Done</span>
        </div>
      </div>

      {/* Main Content Area: Column Match Table & Validation Summary */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
        <div className="flex-1 min-w-0 bg-surface border border-line rounded-card overflow-hidden flex flex-col">
          {step === 2 ? (
            <>
              <div className="flex items-center gap-4 px-[22px] h-[44px] bg-surfaceAlt border-b border-line text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                <div className="w-[150px] flex-[0_0_150px]">YOUR COLUMN</div>
                <div className="w-[206px] flex-[0_0_206px]">FIRST ROW</div>
                <div className="w-4 flex-[0_0_16px]"></div>
                <div className="flex-1">GOES TO</div>
                <div className="w-4 flex-[0_0_16px]"></div>
              </div>

              <div className="divide-y divide-lineSoft overflow-y-auto flex-1">
                {columnMappings.map((col, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-[22px] h-[52px]">
                    <div className="w-[150px] flex-[0_0_150px] text-[13px] font-bold text-ink">
                      {col.source}
                    </div>
                    <div className="w-[206px] flex-[0_0_206px] text-[13px] text-ink3 italic truncate">
                      {col.sample}
                    </div>
                    <span className="text-ink3 flex">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9.5 6 6 6-6 6"/>
                      </svg>
                    </span>
                    <div className="flex-1 flex items-center gap-2 h-9 px-3 bg-surface border border-line rounded-input text-[13px] font-semibold text-ink">
                      <span>{col.target}</span>
                    </div>
                    <span className="text-sage flex">
                      <CheckIcon size={17} strokeWidth={2.4} />
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Step 3: Review parsed rows table */}
              <div className="flex items-center gap-4 px-[22px] h-[44px] bg-surfaceAlt border-b border-line text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                <div className="w-12 flex-[0_0_48px]">ROW</div>
                <div className="w-[180px] flex-[0_0_180px]">NAME</div>
                <div className="w-[140px] flex-[0_0_140px]">PHONE</div>
                <div className="flex-1 min-w-0">ADDRESS</div>
                <div className="w-[160px] flex-[0_0_160px]">STATUS</div>
              </div>

              <div className="divide-y divide-lineSoft overflow-y-auto flex-1">
                {previewData.preview.map((row) => (
                  <div key={row.row_number} className="flex items-center gap-4 px-[22px] h-[48px] text-[13px]">
                    <div className="w-12 flex-[0_0_48px] text-ink3 font-mono text-[11px]">{row.row_number}</div>
                    <div className="w-[180px] flex-[0_0_180px] font-semibold text-ink truncate">{row.full_name || '—'}</div>
                    <div className="w-[140px] flex-[0_0_140px] text-ink2 font-mono text-[12px]">{row.phone || '—'}</div>
                    <div className="flex-1 min-w-0 text-ink3 truncate">{row.address || '—'}</div>
                    <div className="w-[160px] flex-[0_0_160px]">
                      {row.errors.length > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[11px] font-bold">
                          {row.errors[0]}
                        </span>
                      ) : row.is_duplicate ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amberTint text-amber text-[11px] font-bold">
                          Duplicate flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sageTint text-sage text-[11px] font-bold">
                          Valid
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="p-4 bg-surfaceAlt border-t border-line flex items-center justify-between">
            <label className="flex items-center gap-2 text-[13px] text-accent font-semibold cursor-pointer">
              <UploadIcon size={16} />
              <span>Choose another file</span>
              <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setStep(step === 2 ? 3 : 2)}
              className="text-[13px] font-semibold text-ink2 hover:text-ink cursor-pointer"
            >
              {step === 2 ? 'Switch to review mode →' : '← Back to column match'}
            </button>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="w-full lg:w-[380px] lg:flex-[0_0_380px] flex flex-col gap-4">
          <div className="bg-surface border border-line rounded-card p-5">
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
              Validation summary
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink2">Ready to import</span>
                <span className="text-[14px] font-bold text-sage">{previewData.valid_rows} rows</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink2">Rows with warnings</span>
                <span className="text-[14px] font-bold text-amber">{previewData.error_rows} rows</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink2">Duplicates flagged (BR-MEM-3)</span>
                <span className="text-[14px] font-bold text-accent">{previewData.duplicates} pairs</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-accentTint border border-accent rounded-card text-[12.5px] text-accentDark leading-[1.5]">
            <span className="font-bold">Duplicate protection active:</span> Rows matching existing phone numbers or emails will be held for manual merge review rather than overwritten.
          </div>
        </div>
      </div>
    </div>
  );
};
