import React, { useState } from 'react';
import { Person } from '../types.ts';
import { CheckIcon, QrIcon } from './Icons.tsx';

interface WebTransferDialogProps {
  person: Person;
  onClose: () => void;
  onTransferComplete: (destChurch: string, certNumber: string, transferDate: string) => Promise<void>;
}

export const WebTransferDialog: React.FC<WebTransferDialogProps> = ({
  person,
  onClose,
  onTransferComplete,
}) => {
  const [destChurch, setDestChurch] = useState('Bethania Church, Bandung');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [certNumber, setCertNumber] = useState(`ATT-202603-${Math.floor(1000 + Math.random() * 9000)}`);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!destChurch.trim()) return;
    setLoading(true);
    try {
      await onTransferComplete(destChurch.trim(), certNumber, transferDate);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[580px] bg-bg rounded-card border border-line shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-[18px_24px] bg-surfaceAlt border-b border-line">
          <div>
            <h2 className="text-[16px] font-bold text-ink m-0">Transfer Church Attestation</h2>
            <div className="text-[12px] text-ink3 mt-0.5">
              Issue transfer letter for {person.full_name}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink2 hover:text-ink cursor-pointer p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.2 6.2l11.6 11.6"/>
              <path d="M17.8 6.2 6.2 17.8"/>
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] font-bold text-ink2">DESTINATION CHURCH</span>
            <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
              <input
                type="text"
                value={destChurch}
                onChange={(e) => setDestChurch(e.target.value)}
                placeholder="e.g. Bethania Church, Bandung"
                className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">TRANSFER DATE</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">CERTIFICATE NO.</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input font-mono">
                <input
                  type="text"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent font-mono"
                />
              </div>
            </div>
          </div>

          {/* QR Verification preview block */}
          <div className="p-4 bg-surface border border-line rounded-card flex items-center gap-4">
            <div className="w-16 h-16 bg-accentTint rounded-input flex items-center justify-center text-accent">
              <QrIcon size={32} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-ink">Official Church Attestation</div>
              <div className="text-[11.5px] text-ink3 mt-1 leading-[1.45]">
                Includes verified baptism date and standing. Pastoral & giving records stay confidential.
              </div>
            </div>
          </div>

          <div className="p-3 bg-amberTint border border-amber/30 text-amber text-[12px] rounded-input leading-[1.45]">
            <span className="font-bold">Rule BR-MEM-4:</span> Marking this member as transferred will automatically close active roster serving roles and small group fellowship enrollments.
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-[40px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTransfer}
              disabled={loading}
              className="flex items-center gap-2 px-5 h-[40px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckIcon size={14} strokeWidth={2.5} />
              <span>Issue Transfer & Attestation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
