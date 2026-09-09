import React, { useState, useEffect } from 'react';
import { ChurchProfile } from '../types.ts';
import { CheckIcon, LockIcon, QrIcon, RotateIcon } from './Icons.tsx';

interface WebChurchCodeProps {
  initialProfile?: ChurchProfile;
  onRotateCode?: () => void;
}

const defaultChurchProfile: ChurchProfile = {
  id: 'chu-001',
  name: 'Immanuel Church, Sunter',
  address: 'Jl. Danau Sunter Utara Blok A No. 4, Jakarta Utara',
  city: 'Jakarta Utara',
  time_zone: 'WIB · GMT+7',
  worship_day: 'Saturday',
  code: 'GRC-BDG',
  deep_link: 'jemaat://church?code=GRC-BDG',
  phone: '+62 812-3456-7890',
  email: 'office@immanuel-sunter.church',
  devices_following: 312,
  members_signed_in: 48,
  applicants_waiting: 5,
};

export const WebChurchCode: React.FC<WebChurchCodeProps> = ({
  initialProfile = defaultChurchProfile,
  onRotateCode,
}) => {
  const [profile, setProfile] = useState<ChurchProfile>(initialProfile);
  const [copied, setCopied] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  useEffect(() => {
    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch('/api/v1/church/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.code) {
            setProfile(data);
          }
        })
        .catch(() => {});

      fetch('/api/v1/church/qr', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.svg) {
            setQrSvg(data.svg);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleCopyCode = () => {
    const fullText = `${profile.code}\n${profile.deep_link}`;
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRotateConfirm = () => {
    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch('/api/v1/church/code/regenerate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.code) {
            setProfile(data);
          }
        })
        .catch(() => {});
    } else {
      // Offline / demo fallback
      const randomCode = `CH-${Math.floor(100 + Math.random() * 900)}`;
      setProfile((prev) => ({
        ...prev,
        code: randomCode,
        deep_link: `jemaat://church?code=${randomCode}`,
      }));
    }

    if (onRotateCode) {
      onRotateCode();
    }
    setShowRotateModal(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-bg">
      {/* Top Header Bar matching WebChurchCode.dc.html */}
      <div className="flex items-end justify-between gap-[10px] p-[24px_32px_16px] border-b border-line bg-surfaceAlt select-none flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.015em] text-ink m-0">
            Church code
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            How people find {profile.name} in the app
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRotateModal(true)}
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            <RotateIcon size={16} strokeWidth={1.8} />
            <span>Rotate code</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPosterModal(true)}
            className="flex items-center gap-2 h-[40px] px-5 rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer"
          >
            <QrIcon size={17} strokeWidth={1.8} />
            <span>Download QR poster</span>
          </button>
        </div>
      </div>

      {/* 2-Column Main Content matching WebChurchCode.dc.html */}
      <div className="flex-1 min-h-0 flex gap-6 p-[26px_32px] overflow-y-auto">
        {/* Left Column: Code & QR Card (520px) */}
        <div className="w-[520px] flex-[0_0_520px] flex flex-col gap-4">
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-sm flex flex-col">
            {/* Upper Section: QR + Code details */}
            <div className="p-[26px] flex items-center gap-[26px] border-b border-lineSoft">
              <div className="p-3 bg-white border border-line rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                {qrSvg ? (
                  <div
                    className="w-[160px] h-[160px] flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="160" height="160">
                    <rect width="180" height="180" fill="#FFFFFF" />
                    <rect x="18" y="18" width="40" height="40" fill="#1C1917" />
                    <rect x="26" y="26" width="24" height="24" fill="#FFFFFF" />
                    <rect x="32" y="32" width="12" height="12" fill="#1C1917" />
                    <rect x="122" y="18" width="40" height="40" fill="#1C1917" />
                    <rect x="130" y="26" width="24" height="24" fill="#FFFFFF" />
                    <rect x="136" y="32" width="12" height="12" fill="#1C1917" />
                    <rect x="18" y="122" width="40" height="40" fill="#1C1917" />
                    <rect x="26" y="130" width="24" height="24" fill="#FFFFFF" />
                    <rect x="32" y="136" width="12" height="12" fill="#1C1917" />
                    <rect x="74" y="24" width="12" height="12" fill="#1C1917" />
                    <rect x="94" y="24" width="12" height="12" fill="#1C1917" />
                    <rect x="74" y="44" width="12" height="12" fill="#1C1917" />
                    <rect x="74" y="84" width="16" height="16" fill="#1C1917" />
                    <rect x="98" y="84" width="16" height="16" fill="#1C1917" />
                    <rect x="74" y="122" width="12" height="12" fill="#1C1917" />
                    <rect x="94" y="142" width="12" height="12" fill="#1C1917" />
                    <text x="90" y="105" fontFamily="sans-serif" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1C1917">
                      {profile.code}
                    </text>
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  Church code
                </div>
                <div className="text-[34px] font-bold tracking-[0.06em] text-ink mt-2 leading-[1.1] font-mono select-all">
                  {profile.code}
                </div>
                <div className="text-[12px] text-ink2 mt-2.5 leading-[1.5]">
                  Capitals do not matter. The QR carries the same code, so a printed poster and a typed code lead to the same place.
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent hover:underline cursor-pointer"
                >
                  <span>{copied ? '✓ Copied code to clipboard' : 'Copy code & deep link'}</span>
                </button>
              </div>
            </div>

            {/* Warning banner footer matching WebChurchCode.dc.html */}
            <div className="p-[18px_26px] flex items-start gap-3 bg-surface">
              <span className="text-amber pt-0.5">
                <LockIcon size={17} strokeWidth={2} />
              </span>
              <div className="text-[12px] text-ink2 leading-[1.55]">
                Rotating the code stops every printed poster and bulletin from working. People already following this church stay; only new joins need the new code.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reach & Permissions Cards (flex-1) */}
        <div className="flex-1 min-w-0 flex flex-col gap-[18px]">
          {/* Reach Card */}
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-sm">
            <div className="p-[14px_16px_4px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase select-none">
              Reach
            </div>
            <div className="divide-y divide-lineSoft">
              <div className="flex items-baseline gap-3 p-[13px_16px]">
                <span className="font-serif text-[24px] font-semibold text-ink w-16 shrink-0">
                  {profile.devices_following}
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-ink">devices following this church</div>
                  <div className="text-[12px] text-ink3 mt-0.5">Browsing sermons and service times</div>
                </div>
              </div>

              <div className="flex items-baseline gap-3 p-[13px_16px]">
                <span className="font-serif text-[24px] font-semibold text-ink w-16 shrink-0">
                  {profile.members_signed_in}
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-ink">signed in</div>
                  <div className="text-[12px] text-ink3 mt-0.5">Community and Registered combined</div>
                </div>
              </div>

              <div className="flex items-baseline gap-3 p-[13px_16px]">
                <span className="font-serif text-[24px] font-semibold text-ink w-16 shrink-0">
                  {profile.applicants_waiting}
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-ink">applications waiting</div>
                  <div className="text-[12px] text-ink3 mt-0.5">Sitting in the Applicants queue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two things to decide card matching WebChurchCode.dc.html */}
          <div className="bg-surface border border-[#9A722344] rounded-card p-[16px_18px_14px] shadow-sm">
            <div className="text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
              Two things to decide out loud
            </div>
            <div className="text-[12px] text-ink2 leading-[1.65] mt-2.5 flex flex-col gap-2.5">
              <div>
                <span className="font-bold text-ink">Listed by name? </span>
                Someone who has lost the bulletin can look you up with your full name and city. There is no browsable list of churches anywhere, and you can be unlisted entirely.
              </div>
              <div>
                <span className="font-bold text-ink">Messages by WhatsApp? </span>
                It is the only channel people reliably read, and it means your members&rsquo; numbers pass through a messaging provider. Turn it off and everything still works by push notification, with fewer people answering.
              </div>
            </div>
          </div>

          {/* Permissions Card matching WebChurchCode.dc.html */}
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-sm">
            <div className="p-[14px_16px_6px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase select-none">
              Anyone with the code can see
            </div>
            <div className="flex flex-col pb-2">
              <div className="flex items-center gap-2.5 p-[9px_16px]">
                <span className="text-sage flex items-center justify-center">
                  <CheckIcon size={16} strokeWidth={2.5} />
                </span>
                <span className="text-[13px] text-ink">Service times, speaker and location</span>
              </div>
              <div className="flex items-center gap-2.5 p-[9px_16px]">
                <span className="text-sage flex items-center justify-center">
                  <CheckIcon size={16} strokeWidth={2.5} />
                </span>
                <span className="text-[13px] text-ink">Sermon recordings and event posters</span>
              </div>
              <div className="flex items-center gap-2.5 p-[9px_16px]">
                <span className="text-ink3 flex items-center justify-center">
                  <LockIcon size={15} strokeWidth={2} />
                </span>
                <span className="text-[13px] text-ink2">Names, phone numbers, addresses</span>
              </div>
              <div className="flex items-center gap-2.5 p-[9px_16px]">
                <span className="text-ink3 flex items-center justify-center">
                  <LockIcon size={15} strokeWidth={2} />
                </span>
                <span className="text-[13px] text-ink2">The people directory and households</span>
              </div>
              <div className="flex items-center gap-2.5 p-[9px_16px]">
                <span className="text-ink3 flex items-center justify-center">
                  <LockIcon size={15} strokeWidth={2} />
                </span>
                <span className="text-[13px] text-ink2">Care group rosters and attendance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[540px] bg-surface rounded-card border border-line shadow-2xl p-8 flex flex-col items-center text-center gap-5">
            <h2 className="font-serif text-[28px] font-bold text-ink m-0">
              Welcome to {profile.name}
            </h2>
            <p className="text-[14px] text-ink2 max-w-[380px] m-0">
              Scan with your phone camera or enter the church code in the Jemaat app to connect with our church.
            </p>

            <div className="p-6 bg-white border-2 border-line rounded-2xl shadow-md my-2">
              {qrSvg ? (
                <div
                  className="w-[200px] h-[200px] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="200" height="200">
                  <rect width="180" height="180" fill="#FFFFFF" />
                  <rect x="18" y="18" width="40" height="40" fill="#1C1917" />
                  <rect x="26" y="26" width="24" height="24" fill="#FFFFFF" />
                  <rect x="32" y="32" width="12" height="12" fill="#1C1917" />
                  <rect x="122" y="18" width="40" height="40" fill="#1C1917" />
                  <rect x="130" y="26" width="24" height="24" fill="#FFFFFF" />
                  <rect x="136" y="32" width="12" height="12" fill="#1C1917" />
                  <rect x="18" y="122" width="40" height="40" fill="#1C1917" />
                  <rect x="26" y="130" width="24" height="24" fill="#FFFFFF" />
                  <rect x="32" y="136" width="12" height="12" fill="#1C1917" />
                  <text x="90" y="105" fontFamily="sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1C1917">
                    {profile.code}
                  </text>
                </svg>
              )}
            </div>

            <div className="text-[32px] font-bold tracking-[0.1em] text-ink font-mono">
              {profile.code}
            </div>

            <div className="flex gap-3 w-full justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="px-5 h-[42px] rounded-input bg-surfaceAlt border border-line text-ink text-[13px] font-semibold hover:bg-surface cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 h-[42px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Print Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rotate Code Modal */}
      {showRotateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[460px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-ink m-0">Rotate Church Code?</h3>
            <div className="text-[13px] text-ink2 leading-[1.55]">
              Generating a new code immediately invalidates any previously printed QR posters and bulletins. Only proceed if you are ready to update the lobby display.
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowRotateModal(false)}
                className="px-4 h-[38px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRotateConfirm}
                className="px-5 h-[38px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Confirm Rotate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
