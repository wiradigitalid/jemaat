import React, { useState } from 'react';
import { GroupIcon, ChatIcon, CheckIcon } from './Icons.tsx';
import { AuthResponse, RequestLinkResponse } from '../types.ts';

interface AdminDeskSignInProps {
  onSuccess: (authData: AuthResponse, sharedComputer: boolean) => void;
  apiBaseUrl?: string;
}

export const AdminDeskSignIn: React.FC<AdminDeskSignInProps> = ({ onSuccess, apiBaseUrl = '' }) => {
  const [phone, setPhone] = useState('812-3456-7890');
  const [sharedComputer, setSharedComputer] = useState(true);
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestLink = async (preferOtp: boolean) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const fullPhone = '+62' + phone.replace(/\D/g, '');

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/request-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data: RequestLinkResponse = await res.json();
      if (!res.ok) {
        throw new Error((data as any).error || 'Failed to request authentication link');
      }

      setToken(data.debug_token || '');
      if (preferOtp && data.debug_otp) {
        setOtpCode(data.debug_otp); // prefill in dev/test mode for immediate verification
        setOtpMode(true);
        setMessage(`6-digit code sent: ${data.debug_otp}`);
      } else {
        setMessage('A sign-in link has been dispatched to WhatsApp.');
        if (data.debug_otp) {
          setOtpCode(data.debug_otp);
          setOtpMode(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to church office server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const fullPhone = '+62' + phone.replace(/\D/g, '');

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          token: token,
          code: otpCode.trim(),
          shared_computer: sharedComputer,
        }),
      });

      const data: AuthResponse = await res.json();
      if (!res.ok) {
        throw new Error((data as any).error || 'Verification failed');
      }

      onSuccess(data, sharedComputer);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col md:flex-row" style={{ minHeight: '900px' }}>
      {/* Left terracotta brand panel */}
      <div className="w-full md:w-[560px] md:flex-[0_0_560px] bg-accentDark text-[#F7EFE7] p-8 md:p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-[38px] height-[38px] h-[38px] rounded-input bg-[#F7EFE7] text-accentDark flex items-center justify-center">
              <GroupIcon size={22} strokeWidth={1.9} />
            </div>
            <div className="font-serif text-[24px] font-medium">Jemaat</div>
          </div>
        </div>

        <div className="my-12 md:my-0">
          <div className="font-serif text-[30px] md:text-[34px] font-medium leading-[1.2] tracking-[-0.01em]">
            The church register,<br />kept by the people<br />who know the church.
          </div>
          <div className="w-10 h-[2px] bg-[#F7EFE7] opacity-50 my-5"></div>
          <div className="text-[13px] leading-[1.7] opacity-85">
            Members, households and care groups in one place. Your data stays yours, and leaves as a spreadsheet whenever you ask.
          </div>
        </div>

        <div className="text-[12px] opacity-60">
          Church Office Back-Office Portal &middot; v0.1.0
        </div>
      </div>

      {/* Right sign-in form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 min-w-0">
        <div className="w-full max-w-[420px]">
          {/* Church badge header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 flex-[0_0_44px] rounded-input bg-accentTint text-accent flex items-center justify-center text-[14px] font-bold tracking-[0.02em]">
              IM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold">Immanuel Church, Sunter</div>
              <div className="text-[12.5px] text-ink3 mt-[3px]">Jakarta Utara</div>
            </div>
          </div>

          <div className="font-serif text-[27px] font-medium tracking-[-0.01em]">Sign in</div>
          <div className="text-[13px] text-ink2 mt-2 leading-[1.55]">
            We send a link to your WhatsApp. No password to remember.
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-input">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-input">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-6">
            {/* Phone input field */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-ink2">YOUR PHONE</span>
              </div>
              <div className="flex items-center gap-[10px] h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <span className="text-[14px] font-semibold text-ink2">+62</span>
                <span className="w-[1px] h-5 bg-line"></span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="812-3456-7890"
                  className="flex-1 min-w-0 text-[14px] text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            {/* OTP Entry when activated */}
            {otpMode ? (
              <div className="flex flex-col gap-[6px] p-3 bg-surfaceAlt border border-line rounded-input">
                <span className="text-[12px] font-bold text-ink2">ENTER 6-DIGIT CODE</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="flex-1 h-[44px] px-3 bg-surface border border-line rounded-input text-[16px] font-semibold tracking-widest text-center"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerify()}
                    disabled={loading || otpCode.length < 6}
                    className="px-4 h-[44px] rounded-input bg-accent text-white text-[14px] font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            ) : null}

            {/* WhatsApp Link Button */}
            <button
              type="button"
              onClick={() => handleRequestLink(false)}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-[48px] rounded-input bg-accent text-white border border-accent text-[15px] font-semibold hover:bg-accentDark transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ChatIcon size={18} strokeWidth={1.7} />
              <span>{loading ? 'Sending link...' : 'Send me a link'}</span>
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-[1px] bg-line"></span>
              <span className="text-[11px] font-bold text-ink3">OR</span>
              <span className="flex-1 h-[1px] bg-line"></span>
            </div>

            {/* OTP button */}
            <button
              type="button"
              onClick={() => handleRequestLink(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-[44px] rounded-input bg-surface text-ink border border-line text-[15px] font-semibold hover:bg-surfaceAlt transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>Send a 6-digit code</span>
            </button>

            {/* Shared computer checkbox */}
            <div
              onClick={() => setSharedComputer(!sharedComputer)}
              className="flex items-center gap-[11px] p-[13px_14px] bg-surface border border-line rounded-input cursor-pointer select-none"
            >
              <div className={`w-[19px] h-[19px] flex-[0_0_19px] rounded-mark ${sharedComputer ? 'bg-accent text-white' : 'border border-line bg-white'} flex items-center justify-center`}>
                {sharedComputer && <CheckIcon size={12} strokeWidth={3} />}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">This is a shared computer</div>
                <div className="text-[11px] text-ink3 mt-[2px]">Sign me out when the browser closes</div>
              </div>
            </div>

            <div className="text-[12px] text-ink3 leading-[1.55] text-center mt-1">
              Your number is not on file? Ask another administrator to add it.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
