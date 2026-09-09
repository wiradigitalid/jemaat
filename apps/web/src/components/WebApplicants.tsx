import React, { useState, useEffect } from 'react';
import { GuestApplicant } from '../types.ts';
import { ChatIcon, CheckIcon, LockIcon, UploadIcon } from './Icons.tsx';

interface WebApplicantsProps {
  initialApplicants?: GuestApplicant[];
  onAdmitApplicant?: (applicantId: string, payload: { membership_status: string; household_action: string; care_group_name: string }) => void;
  onContactApplicant?: (applicantId: string, notes: string) => void;
  onExportList?: () => void;
}

const defaultApplicants: GuestApplicant[] = [
  {
    id: 'app-01',
    full_name: 'Rian Wijaya',
    initials: 'RW',
    phone: '+62 812-1234-5678',
    email: 'rian.wijaya@gmail.com',
    worshipping_duration: 'Over a year',
    current_membership: 'Bethania Church, Bandung',
    requested_category: 'Community Member',
    status: 'pending',
    days_waiting: 2,
    submitted_at_label: '8 March, 14.22',
  },
  {
    id: 'app-02',
    full_name: 'Grace Sutanto',
    initials: 'GS',
    phone: '+62 813-2233-4455',
    email: 'grace.sutanto@gmail.com',
    worshipping_duration: '6 to 12 months',
    current_membership: 'no other church',
    requested_category: 'Registered Member',
    status: 'pending',
    days_waiting: 2,
    submitted_at_label: '8 March, 11.05',
  },
  {
    id: 'app-03',
    full_name: 'Fandi Tobing',
    initials: 'FT',
    phone: '+62 811-9988-7766',
    email: 'fandi.tobing@gmail.com',
    worshipping_duration: 'Over a year',
    current_membership: 'Ebenhaezer Church, Jakarta',
    requested_category: 'Community Member',
    status: 'pending',
    days_waiting: 3,
    submitted_at_label: '7 March, 18.40',
  },
  {
    id: 'app-04',
    full_name: 'Sinta Rahmat',
    initials: 'SR',
    phone: '+62 812-5544-3322',
    email: 'sinta.rahmat@gmail.com',
    worshipping_duration: 'Under 6 months',
    current_membership: 'no other church',
    requested_category: 'Community Member',
    status: 'pending',
    days_waiting: 4,
    submitted_at_label: '6 March, 09.15',
  },
  {
    id: 'app-05',
    full_name: 'Hendra Lie',
    initials: 'HL',
    phone: '+62 813-7788-9900',
    email: 'hendra.lie@gmail.com',
    worshipping_duration: 'Over a year',
    current_membership: 'Zion Church, Bandung',
    requested_category: 'Registered Member',
    status: 'pending',
    days_waiting: 4,
    submitted_at_label: '6 March, 08.50',
  },
];

export const WebApplicants: React.FC<WebApplicantsProps> = ({
  initialApplicants = defaultApplicants,
  onAdmitApplicant,
  onContactApplicant,
  onExportList,
}) => {
  const [applicantList, setApplicantList] = useState<GuestApplicant[]>(initialApplicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(initialApplicants[0]?.id || 'app-01');

  // Form states
  const [membershipStatus, setMembershipStatus] = useState('Community Member');
  const [householdAction, setHouseholdAction] = useState('Create new: Wijaya household');
  const [careGroup, setCareGroup] = useState('Anugerah · Sunter');
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [conversationNotes, setConversationNotes] = useState('Followed up via WhatsApp, arranged coffee chat.');

  useEffect(() => {
    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch('/api/v1/guests/queue', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.data && data.data.length > 0) {
            setApplicantList(data.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const selectedApplicant = applicantList.find((a) => a.id === selectedApplicantId) || applicantList[0];

  useEffect(() => {
    if (selectedApplicant) {
      setMembershipStatus(selectedApplicant.requested_category);
      const lastName = selectedApplicant.full_name.split(' ').slice(-1)[0];
      setHouseholdAction(`Create new: ${lastName} household`);
    }
  }, [selectedApplicantId]);

  const handleConfirmAdmit = () => {
    if (!selectedApplicant) return;

    setApplicantList((prev) =>
      prev.map((a) =>
        a.id === selectedApplicant.id
          ? {
              ...a,
              status: 'admitted',
              household_action: householdAction,
              care_group_assignment: careGroup,
            }
          : a
      )
    );

    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch(`/api/v1/guests/queue/${selectedApplicant.id}/admit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          membership_status: membershipStatus,
          household_action: householdAction,
          care_group_name: careGroup,
        }),
      }).catch(() => {});
    }

    if (onAdmitApplicant) {
      onAdmitApplicant(selectedApplicant.id, {
        membership_status: membershipStatus,
        household_action: householdAction,
        care_group_name: careGroup,
      });
    }
  };

  const handleConversationSubmit = () => {
    if (!selectedApplicant || !conversationNotes.trim()) return;

    setApplicantList((prev) =>
      prev.map((a) =>
        a.id === selectedApplicant.id
          ? {
              ...a,
              status: 'contacted',
              contact_notes: conversationNotes.trim(),
            }
          : a
      )
    );

    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch(`/api/v1/guests/queue/${selectedApplicant.id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: conversationNotes.trim() }),
      }).catch(() => {});
    }

    if (onContactApplicant) {
      onContactApplicant(selectedApplicant.id, conversationNotes.trim());
    }
    setShowConversationModal(false);
  };

  const pendingWaitingCount = applicantList.filter((a) => a.status === 'pending').length;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-bg">
      {/* Top Header Bar matching WebApplicants.dc.html */}
      <div className="flex items-center justify-between gap-[14px] p-[20px_32px] bg-surfaceAlt border-b border-line select-none flex-wrap">
        <div>
          <h1 className="text-[16px] font-bold text-ink m-0">Applicants</h1>
          <div className="text-[12px] text-ink3 mt-0.5">
            {pendingWaitingCount} waiting &middot; oldest submitted 4 days ago
          </div>
        </div>

        <button
          type="button"
          onClick={onExportList}
          className="flex items-center gap-2 h-[38px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
        >
          <UploadIcon size={16} strokeWidth={1.8} />
          <span>Export list</span>
        </button>
      </div>

      {/* 2-Column Split Pane Layout matching WebApplicants.dc.html */}
      <div className="flex-1 min-h-0 flex gap-5 p-[24px_32px] overflow-hidden">
        {/* Left Column: Applicants Cards List (392px) */}
        <div className="w-[392px] flex-[0_0_392px]">
          <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
            <div className="p-1.5 flex flex-col gap-1 overflow-y-auto flex-1">
              {applicantList.map((a) => {
                const isSelected = a.id === selectedApplicant?.id;

                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedApplicantId(a.id)}
                    className={`flex items-start gap-3 p-[13px_14px] rounded-[12px] transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-surface border-[1.5px] border-accent shadow-xs'
                        : 'border border-transparent hover:bg-surfaceAlt'
                    }`}
                  >
                    <div className="w-[36px] h-[36px] rounded-full bg-accentTint text-accent flex items-center justify-center text-xs font-bold shrink-0">
                      {a.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[14px] font-bold text-ink truncate">{a.full_name}</span>
                        <span className="text-[11.5px] text-ink3 shrink-0">{a.days_waiting} days</span>
                      </div>
                      <div className="text-[12px] text-ink2 mt-0.5 font-medium">
                        Wants: {a.requested_category}
                      </div>
                      <div className="text-[11.5px] text-ink3 mt-0.5 truncate">
                        {a.worshipping_duration} &middot; {a.current_membership}
                      </div>

                      {a.status === 'contacted' && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center h-[20px] px-2 rounded-full bg-amberTint text-amber text-[10.5px] font-bold">
                            Contacted
                          </span>
                        </div>
                      )}
                      {a.status === 'admitted' && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center h-[20px] px-2 rounded-full bg-sageTint text-sage text-[10.5px] font-bold">
                            Admitted
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Applicant Detail & Decision Card (flex-1) */}
        <div className="flex-1 min-w-0">
          {selectedApplicant && (
            <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
              {/* Header */}
              <div className="p-[22px_24px] border-b border-lineSoft flex items-start gap-4 select-none">
                <div className="w-[52px] h-[52px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[17px] font-bold shrink-0">
                  {selectedApplicant.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-[24px] font-medium text-ink tracking-[-0.01em] m-0">
                    {selectedApplicant.full_name}
                  </h2>
                  <div className="text-[13px] text-ink3 mt-1">
                    Submitted {selectedApplicant.submitted_at_label} &middot;{' '}
                    {selectedApplicant.status === 'contacted'
                      ? 'contacted'
                      : selectedApplicant.status === 'admitted'
                      ? 'admitted'
                      : 'not yet contacted'}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${selectedApplicant.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
                >
                  <ChatIcon size={16} strokeWidth={1.8} />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* 4-Field Detail Row matching WebApplicants.dc.html */}
              <div className="p-[20px_24px] border-b border-lineSoft flex gap-11 flex-wrap">
                <div>
                  <div className="text-[11px] font-bold text-ink3 tracking-[0.05em] uppercase">PHONE</div>
                  <div className="text-[14px] font-semibold text-ink mt-1">{selectedApplicant.phone}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-ink3 tracking-[0.05em] uppercase">WORSHIPPING HERE</div>
                  <div className="text-[14px] font-semibold text-ink mt-1">{selectedApplicant.worshipping_duration}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-ink3 tracking-[0.05em] uppercase">CURRENT MEMBERSHIP</div>
                  <div className="text-[14px] font-semibold text-ink mt-1">{selectedApplicant.current_membership}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-ink3 tracking-[0.05em] uppercase">REQUESTED</div>
                  <div className="text-[14px] font-semibold text-ink mt-1">{selectedApplicant.requested_category}</div>
                </div>
              </div>

              {/* Placement Selectors matching WebApplicants.dc.html */}
              <div className="p-[20px_24px] flex flex-col gap-4 border-b border-lineSoft">
                <div className="text-[13px] font-bold text-ink">Confirm and place</div>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-ink2">Membership status</label>
                    <select
                      value={membershipStatus}
                      onChange={(e) => setMembershipStatus(e.target.value)}
                      className="h-[42px] px-3 bg-surface border border-line rounded-input text-[13px] font-semibold text-ink outline-none"
                    >
                      <option value="Community Member">Community Member</option>
                      <option value="Registered Member">Registered Member</option>
                      <option value="Guest">Guest</option>
                    </select>
                    <span className="text-[11px] text-ink3">
                      {membershipStatus === 'Community Member'
                        ? 'Keeps their membership at original church.'
                        : 'Full registered church membership.'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-ink2">Household</label>
                    <select
                      value={householdAction}
                      onChange={(e) => setHouseholdAction(e.target.value)}
                      className="h-[42px] px-3 bg-surface border border-line rounded-input text-[13px] font-semibold text-ink outline-none"
                    >
                      <option value={`Create new: ${selectedApplicant.full_name.split(' ').slice(-1)[0]} household`}>
                        Create new: {selectedApplicant.full_name.split(' ').slice(-1)[0]} household
                      </option>
                      <option value="Attach to existing household">Attach to an existing household</option>
                    </select>
                    <span className="text-[11px] text-ink3">Or attach to an existing household.</span>
                  </div>

                  <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-ink2">Care group</label>
                    <select
                      value={careGroup}
                      onChange={(e) => setCareGroup(e.target.value)}
                      className="h-[42px] px-3 bg-surface border border-line rounded-input text-[13px] font-semibold text-ink outline-none"
                    >
                      <option value="Anugerah · Sunter">Anugerah &middot; Sunter</option>
                      <option value="Kasih · Kelapa Gading">Kasih &middot; Kelapa Gading</option>
                      <option value="Damai · Sunter">Damai &middot; Sunter</option>
                      <option value="Setia · Pluit">Setia &middot; Pluit</option>
                    </select>
                    <span className="text-[11px] text-ink3">Optional. Can be changed by the group leader.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar matching WebApplicants.dc.html */}
              <div className="p-[20px_24px] mt-auto flex items-center gap-3 select-none flex-wrap">
                <button
                  type="button"
                  onClick={handleConfirmAdmit}
                  disabled={selectedApplicant.status === 'admitted'}
                  className="flex items-center gap-2 h-[44px] px-5 rounded-xl bg-accent text-white text-[14px] font-bold hover:bg-accentDark disabled:bg-line disabled:text-ink3 transition-colors cursor-pointer"
                >
                  <CheckIcon size={18} strokeWidth={2.5} />
                  <span>
                    {selectedApplicant.status === 'admitted'
                      ? 'Admitted as Member'
                      : `Confirm as ${membershipStatus}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConversationModal(true)}
                  className="flex items-center gap-2 h-[44px] px-4 rounded-xl bg-surface border border-line text-[14px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
                >
                  <ChatIcon size={17} strokeWidth={1.8} />
                  <span>Needs a conversation</span>
                </button>

                <span className="text-[13px] font-semibold text-ink3 px-2">Already on our roll</span>

                <div className="flex-1 min-w-0" />

                <div className="flex items-center gap-2 max-w-[340px] text-ink3">
                  <LockIcon size={15} strokeWidth={2} />
                  <span className="text-[11px] leading-[1.4]">
                    There is no decline button on purpose. The furthest this screen goes is asking for a conversation.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Notes Modal */}
      {showConversationModal && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[460px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-ink m-0">
              Needs a Conversation &middot; {selectedApplicant.full_name}
            </h3>
            <div className="text-[13px] text-ink2 leading-[1.5]">
              Log pastoral conversation notes or reason for further dialogue before admitting into church membership.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">CONVERSATION NOTES</label>
              <textarea
                rows={3}
                value={conversationNotes}
                onChange={(e) => setConversationNotes(e.target.value)}
                placeholder="e.g. Discussed baptism background and membership class expectations."
                className="p-3 bg-surface border border-line rounded-input text-[13px] text-ink font-medium outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowConversationModal(false)}
                className="px-4 h-[38px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConversationSubmit}
                className="px-5 h-[38px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
