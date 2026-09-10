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
  const [linkSent, setLinkSent] = useState(false);
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
      if (preferOtp) {
        if (data.debug_otp) {
          setOtpCode(data.debug_otp);
        }
        setOtpMode(true);
        setLinkSent(false);
      } else {
        setLinkSent(true);
        if (data.debug_otp) {
          setOtpCode(data.debug_otp);
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
    <div className="w-full min-h-screen bg-bg flex flex-col lg:flex-row">
      {/* Left terracotta brand column: perfectly balanced and responsive */}
      <div className="w-full lg:w-1/2 bg-accentDark text-[#F7EFE7] flex flex-col justify-between items-end min-h-screen">
        <div className="w-full max-w-[620px] p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-screen flex-1">
          {/* Brand header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-input bg-[#F7EFE7] text-accentDark flex items-center justify-center shadow-sm">
                <GroupIcon size={22} strokeWidth={1.9} />
              </div>
              <div className="font-serif text-[24px] font-medium tracking-[-0.01em]">Jemaat</div>
            </div>
          </div>

          {/* Hero editorial typography */}
          <div className="my-12 lg:my-auto py-6">
            <div className="font-serif text-[32px] sm:text-[36px] lg:text-[40px] font-medium leading-[1.18] tracking-[-0.015em]">
              The church register,<br />
              kept by the people<br />
              who know the church.
            </div>
            <div className="w-10 h-[2px] bg-[#F7EFE7] opacity-50 my-6"></div>
            <div className="text-[14px] leading-[1.7] opacity-85 max-w-[460px]">
              Members, households and care groups in one place. Your data stays yours, and leaves as a spreadsheet whenever you ask.
            </div>
          </div>

          {/* Footer portal note */}
          <div className="text-[12px] opacity-60 tracking-[0.02em]">
            Church Office Back-Office Portal &middot; v0.1.0
          </div>
        </div>
      </div>

      {/* Right sign-in form column: aligned gracefully towards center seam */}
      <div className="w-full lg:w-1/2 bg-bg flex flex-col justify-center items-start min-h-screen">
        <div className="w-full max-w-[620px] p-8 sm:p-12 lg:p-16 flex flex-col items-center lg:items-start justify-center flex-1">
          <div className="w-full max-w-[420px]">
            {/* Church identity badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 flex-[0_0_44px] rounded-input bg-accentTint text-accent flex items-center justify-center text-[14px] font-bold tracking-[0.02em]">
                IM
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-ink">Immanuel Church, Sunter</div>
                <div className="text-[12.5px] text-ink3 mt-[2px]">Jakarta Utara</div>
              </div>
            </div>

            {/* Form title */}
            <div className="font-serif text-[28px] font-medium tracking-[-0.01em] text-ink">
              {otpMode ? 'Enter 6-digit code' : 'Sign in'}
            </div>
            <div className="text-[13px] text-ink2 mt-2 leading-[1.55]">
              {otpMode
                ? `We sent six digits over WhatsApp to +62 ${phone}.`
                : 'We send a link to your WhatsApp. No password to remember.'}
            </div>

            {error && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-input leading-[1.5]">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-4 p-3.5 bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-input leading-[1.5]">
                {message}
              </div>
            )}

            {/* Mode A: OTP verification code entry */}
            {otpMode ? (
              <form onSubmit={handleVerify} className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-ink2">6-DIGIT VERIFICATION CODE</span>
                    <button
                      type="button"
                      onClick={() => setOtpMode(false)}
                      className="text-[12px] text-accent font-semibold hover:underline"
                    >
                      Change number
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="h-[52px] px-4 bg-surface border border-line rounded-input text-[22px] font-mono tracking-[0.35em] text-center font-bold text-ink outline-none focus:border-accent"
                  />
                  {otpCode && (
                    <div className="text-[12px] text-ink3 text-center mt-1">
                      Dev test code auto-filled: <span className="font-bold text-accent">{otpCode}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="flex items-center justify-center h-[48px] rounded-input bg-accent text-white text-[15px] font-semibold hover:bg-accentDark transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? 'Verifying...' : 'Verify & Enter'}
                </button>

                <div className="flex items-center justify-between text-[13px] mt-1">
                  <button
                    type="button"
                    onClick={() => handleRequestLink(true)}
                    disabled={loading}
                    className="text-ink2 hover:text-ink font-semibold"
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpMode(false);
                      handleRequestLink(false);
                    }}
                    disabled={loading}
                    className="text-accent hover:underline font-semibold"
                  >
                    Send magic link instead
                  </button>
                </div>

                {/* Shared computer checkbox */}
                <div
                  onClick={() => setSharedComputer(!sharedComputer)}
                  className="flex items-center gap-[11px] p-[13px_14px] bg-surface border border-line rounded-input cursor-pointer select-none mt-2"
                >
                  <div
                    className={`w-[19px] h-[19px] flex-[0_0_19px] rounded-mark ${
                      sharedComputer ? 'bg-accent text-white' : 'border border-line bg-white'
                    } flex items-center justify-center`}
                  >
                    {sharedComputer && <CheckIcon size={12} strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-ink">This is a shared computer</div>
                    <div className="text-[11px] text-ink3 mt-[2px]">Sign me out when the browser closes</div>
                  </div>
                </div>
              </form>
            ) : linkSent ? (
              /* Mode B: Link dispatched state */
              <div className="flex flex-col gap-4 mt-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-input flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ChatIcon size={16} strokeWidth={2} />
                  </div>
                  <div className="text-[13px] text-green-800 leading-[1.5]">
                    <div className="font-bold mb-0.5">Magic Link Dispatched!</div>
                    Check your WhatsApp on <span className="font-bold">+62 {phone}</span>. Click the link to sign in automatically.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOtpMode(true)}
                  className="flex items-center justify-center h-[46px] rounded-input bg-accent text-white text-[14px] font-semibold hover:bg-accentDark transition-colors cursor-pointer shadow-sm"
                >
                  Enter 6-digit code instead {otpCode ? `(${otpCode})` : ''}
                </button>

                <div className="flex items-center justify-between text-[13px] text-ink3 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLinkSent(false);
                      setOtpMode(false);
                    }}
                    className="text-accent hover:underline font-semibold"
                  >
                    Change phone number
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestLink(false)}
                    disabled={loading}
                    className="hover:text-ink font-semibold"
                  >
                    Resend link
                  </button>
                </div>
              </div>
            ) : (
              /* Mode C: Initial entry */
              <div className="flex flex-col gap-4 mt-6">
                {/* Phone input */}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-ink2">YOUR PHONE</span>
                  </div>
                  <div className="flex items-center gap-[10px] h-[44px] px-[14px] bg-surface border border-line rounded-input focus-within:border-accent">
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

                {/* Primary Button: Send me a link */}
                <button
                  type="button"
                  onClick={() => handleRequestLink(false)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 h-[48px] rounded-input bg-accent text-white border border-accent text-[15px] font-semibold hover:bg-accentDark transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <ChatIcon size={18} strokeWidth={1.7} />
                  <span>{loading ? 'Sending link...' : 'Send me a link'}</span>
                </button>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-0.5">
                  <span className="flex-1 h-[1px] bg-line"></span>
                  <span className="text-[11px] font-bold text-ink3">OR</span>
                  <span className="flex-1 h-[1px] bg-line"></span>
                </div>

                {/* Secondary Button: Send a 6-digit code */}
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
                  <div
                    className={`w-[19px] h-[19px] flex-[0_0_19px] rounded-mark ${
                      sharedComputer ? 'bg-accent text-white' : 'border border-line bg-white'
                    } flex items-center justify-center`}
                  >
                    {sharedComputer && <CheckIcon size={12} strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-ink">This is a shared computer</div>
                    <div className="text-[11px] text-ink3 mt-[2px]">Sign me out when the browser closes</div>
                  </div>
                </div>

                <div className="text-[12px] text-ink3 leading-[1.55] text-center mt-1">
                  Your number is not on file? Ask another administrator to add it.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
