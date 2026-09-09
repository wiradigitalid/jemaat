import React, { useState, useEffect } from 'react';
import { AbsenceAlert, MeetingSession } from '../types.ts';
import { ChatIcon, CheckIcon } from './Icons.tsx';

interface WebPastoralAlertsProps {
  alerts?: AbsenceAlert[];
  meetings?: MeetingSession[];
  onContactAlert?: (alertId: string, notes: string) => void;
  onDismissAlert?: (alertId: string, reason: string) => void;
}

const defaultAlerts: AbsenceAlert[] = [
  {
    id: 'alt-001',
    person_id: 'per-dk',
    person_name: 'Dedi Kurnia',
    person_phone: '+62 812-9988-7766',
    care_group_id: 'cg-01',
    care_group_name: 'Anugerah',
    consecutive_absences: 3,
    last_attended_date: '2026-02-11',
    status: 'pending',
  },
  {
    id: 'alt-002',
    person_id: 'per-sl',
    person_name: 'Samuel Lubis',
    person_phone: '+62 813-1122-3344',
    care_group_id: 'cg-01',
    care_group_name: 'Anugerah',
    consecutive_absences: 3,
    last_attended_date: '2026-02-11',
    status: 'pending',
  },
];

const defaultMeetings: MeetingSession[] = [
  {
    id: 'mtg-01',
    care_group_id: 'cg-01',
    care_group_name: 'Anugerah',
    date: '2026-02-18',
    date_label: 'WED 18 FEB',
    host_name: 'Bambang Prasetyo',
    topic: 'Walking in Faith Part 1',
    offering_amount: 350000,
    attendees_count: 12,
    guests_count: 1,
  },
  {
    id: 'mtg-02',
    care_group_id: 'cg-01',
    care_group_name: 'Anugerah',
    date: '2026-02-25',
    date_label: 'WED 25 FEB',
    host_name: 'Andreas Halim',
    topic: 'Walking in Faith Part 2',
    offering_amount: 420000,
    attendees_count: 11,
    guests_count: 0,
  },
  {
    id: 'mtg-03',
    care_group_id: 'cg-01',
    care_group_name: 'Anugerah',
    date: '2026-03-04',
    date_label: 'WED 4 MAR',
    host_name: 'Melisa Tanudjaja',
    topic: 'Walking in Faith Part 3',
    offering_amount: 500000,
    attendees_count: 10,
    guests_count: 2,
  },
];

export const WebPastoralAlerts: React.FC<WebPastoralAlertsProps> = ({
  alerts = defaultAlerts,
  meetings = defaultMeetings,
  onContactAlert,
  onDismissAlert,
}) => {
  const [alertList, setAlertList] = useState<AbsenceAlert[]>(alerts);
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || 'alt-001');
  const [meetingList, setMeetingList] = useState<MeetingSession[]>(meetings);
  const [activeTab, setActiveTab] = useState<'alerts' | 'meetings'>('alerts');
  const [contactNotes, setContactNotes] = useState('');
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [dismissReason, setDismissReason] = useState('Family temporarily out of town');

  useEffect(() => {
    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch('/api/v1/care-groups/absence-alerts', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.data && data.data.length > 0) {
            setAlertList(data.data);
          }
        })
        .catch(() => {});

      fetch('/api/v1/care-groups/cg-01/meetings', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.data && data.data.length > 0) {
            setMeetingList(data.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const selectedAlert = alertList.find((a) => a.id === selectedAlertId) || alertList[0];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert || !contactNotes.trim()) return;

    const notes = contactNotes.trim();
    setAlertList((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? {
              ...a,
              status: 'contacted',
              contact_notes: notes,
            }
          : a
      )
    );

    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch(`/api/v1/pastoral/alerts/${selectedAlert.id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      }).catch(() => {});
    }

    if (onContactAlert) {
      onContactAlert(selectedAlert.id, notes);
    }
    setContactNotes('');
  };

  const handleDismissSubmit = () => {
    if (!selectedAlert || !dismissReason.trim()) return;

    const reason = dismissReason.trim();
    setAlertList((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? {
              ...a,
              status: 'dismissed',
              dismiss_reason: reason,
            }
          : a
      )
    );

    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch(`/api/v1/pastoral/alerts/${selectedAlert.id}/dismiss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }).catch(() => {});
    }

    if (onDismissAlert) {
      onDismissAlert(selectedAlert.id, reason);
    }
    setShowDismissModal(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-bg">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-[14px] p-[20px_32px] bg-surfaceAlt border-b border-line select-none flex-wrap">
        <div>
          <h1 className="text-[16px] font-bold text-ink m-0">Pastoral Care & Attendance</h1>
          <div className="text-[12px] text-ink3 mt-0.5">
            {alertList.filter((a) => a.status === 'pending').length} members require attention &middot; 3 consecutive unexcused absences (BR-3)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`h-[36px] px-3.5 rounded-input text-[13px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-surface border border-line text-ink font-bold shadow-xs'
                : 'text-ink2 hover:bg-surface'
            }`}
          >
            Pastoral alerts queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meetings')}
            className={`h-[36px] px-3.5 rounded-input text-[13px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'meetings'
                ? 'bg-surface border border-line text-ink font-bold shadow-xs'
                : 'text-ink2 hover:bg-surface'
            }`}
          >
            Meeting reports ({meetings.length})
          </button>
        </div>
      </div>

      {activeTab === 'alerts' ? (
        /* Split-Pane Queue matching WebApplicants.dc.html tokens */
        <div className="flex-1 min-h-0 flex gap-5 p-[24px_32px] overflow-hidden">
          {/* Left Column: Alerts List (392px) */}
          <div className="w-[392px] flex-[0_0_392px]">
            <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
              <div className="p-1.5 flex flex-col gap-1 overflow-y-auto flex-1">
                {alertList.map((a) => {
                  const isSelected = a.id === selectedAlert?.id;
                  const initials = a.person_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2);

                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAlertId(a.id)}
                      className={`flex items-start gap-3 p-[13px_14px] rounded-[12px] transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-surface border-[1.5px] border-accent shadow-xs'
                          : 'border border-transparent hover:bg-surfaceAlt'
                      }`}
                    >
                      <div className="w-[36px] h-[36px] rounded-full bg-accentTint text-accent flex items-center justify-center text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold text-ink">{a.person_name}</div>
                        <div className="text-[12px] text-ink3 mt-0.5">
                          {a.care_group_name} &middot; Last seen {a.last_attended_date}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="inline-flex items-center h-[20px] px-2 rounded-full bg-amberTint text-amber text-[11px] font-bold">
                            {a.consecutive_absences} missed meetings
                          </span>
                          {a.status === 'contacted' ? (
                            <span className="inline-flex items-center h-[20px] px-2 rounded-full bg-sageTint text-sage text-[11px] font-bold">
                              Contacted
                            </span>
                          ) : a.status === 'dismissed' ? (
                            <span className="inline-flex items-center h-[20px] px-2 rounded-full bg-surfaceAlt text-ink3 border border-line text-[11px] font-bold">
                              Dismissed
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {alertList.length === 0 && (
                  <div className="p-8 text-center text-ink3 text-[13px]">
                    No members flagged for pastoral attention.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Member Alert Profile (flex-1) */}
          <div className="flex-1 min-w-0">
            {selectedAlert && (
              <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
                {/* Profile Header */}
                <div className="p-[22px_24px] border-b border-lineSoft flex items-start gap-4 select-none">
                  <div className="w-[52px] h-[52px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[16px] font-bold shrink-0">
                    {selectedAlert.person_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-[24px] font-medium text-ink m-0">
                      {selectedAlert.person_name}
                    </h2>
                    <div className="text-[13px] text-ink3 mt-1">
                      {selectedAlert.care_group_name} &middot; {selectedAlert.consecutive_absences} missed meetings &middot; Last attended {selectedAlert.last_attended_date}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${selectedAlert.person_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 h-[38px] px-3.5 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
                  >
                    <ChatIcon size={16} strokeWidth={1.8} />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Detail Grid matching WebApplicants.dc.html */}
                <div className="p-[20px_24px] border-b border-lineSoft flex gap-10 flex-wrap">
                  <div>
                    <div className="text-[11px] font-bold text-ink3 uppercase tracking-[0.05em]">PHONE</div>
                    <div className="text-[14px] font-semibold text-ink mt-1">{selectedAlert.person_phone}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-ink3 uppercase tracking-[0.05em]">CARE GROUP</div>
                    <div className="text-[14px] font-semibold text-ink mt-1">{selectedAlert.care_group_name}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-ink3 uppercase tracking-[0.05em]">CONSECUTIVE ABSENCES</div>
                    <div className="text-[14px] font-semibold text-amber mt-1">
                      {selectedAlert.consecutive_absences} unexcused (BR-3)
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-ink3 uppercase tracking-[0.05em]">STATUS</div>
                    <div className="text-[14px] font-semibold text-ink mt-1 capitalize">{selectedAlert.status}</div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="p-[20px_24px] flex-1 overflow-y-auto flex flex-col gap-4">
                  {selectedAlert.contact_notes && (
                    <div className="p-3.5 bg-surfaceAlt border border-line rounded-input flex flex-col gap-1">
                      <div className="text-[11px] font-bold text-ink2 uppercase tracking-[0.04em]">
                        PREVIOUS PASTORAL LOG
                      </div>
                      <div className="text-[13px] text-ink leading-[1.5]">
                        {selectedAlert.contact_notes}
                      </div>
                    </div>
                  )}

                  {selectedAlert.dismiss_reason && (
                    <div className="p-3.5 bg-surfaceAlt border border-line rounded-input flex flex-col gap-1">
                      <div className="text-[11px] font-bold text-ink3 uppercase tracking-[0.04em]">
                        DISMISSAL REASON
                      </div>
                      <div className="text-[13px] text-ink2 italic">
                        {selectedAlert.dismiss_reason}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-ink2">RECORD CONVERSATION NOTES</label>
                    <textarea
                      rows={3}
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      placeholder="e.g. Spoke with member. Currently recovering from hospital visit, requested prayer and visitation."
                      className="p-3 bg-surface border border-line rounded-input text-[13.5px] text-ink font-medium outline-none focus:border-accent"
                    />

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={!contactNotes.trim()}
                        className="flex items-center gap-2 h-[42px] px-5 rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark disabled:bg-line disabled:text-ink3 transition-colors cursor-pointer"
                      >
                        <CheckIcon size={16} strokeWidth={2.5} />
                        <span>Log Contact & Mark Contacted</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDismissModal(true)}
                        className="h-[42px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink2 hover:bg-surfaceAlt transition-colors cursor-pointer"
                      >
                        Dismiss Alert
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Meeting Reports Viewer matching Attendance.dc.html */
        <div className="flex-1 min-h-0 p-[24px_32px] overflow-y-auto">
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-sm">
            <div className="p-[18px_20px] border-b border-lineSoft select-none flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-ink m-0">Small Group Meeting Records</h3>
                <div className="text-[12px] text-ink3 mt-0.5">
                  Recent meeting sessions, attendance counts, and fellowships
                </div>
              </div>
            </div>

            <div className="divide-y divide-lineSoft">
              {meetingList.map((m) => (
                <div key={m.id} className="p-[16px_20px] flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-[200px]">
                    <div className="text-[14px] font-bold text-ink">{m.date_label}</div>
                    <div className="text-[12px] text-ink3 mt-0.5">Host: {m.host_name}</div>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <div className="text-[13.5px] font-semibold text-ink">{m.topic}</div>
                    <div className="text-[12px] text-ink2 mt-0.5">Group: {m.care_group_name}</div>
                  </div>

                  <div className="flex items-center gap-6 select-none">
                    <div className="text-right">
                      <div className="text-[13px] font-bold text-ink">{m.attendees_count} present</div>
                      <div className="text-[11.5px] text-ink3">{m.guests_count} guests</div>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className="text-[13px] font-bold text-accent">
                        Rp {m.offering_amount.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[11.5px] text-ink3">Offering</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dismiss Alert Modal */}
      {showDismissModal && selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-ink m-0">Dismiss Absence Alert</h3>
            <div className="text-[13px] text-ink2 leading-[1.5]">
              Dismissing alert for <span className="font-semibold text-ink">{selectedAlert.person_name}</span> ({selectedAlert.care_group_name}).
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">REASON FOR DISMISSAL</label>
              <input
                type="text"
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                placeholder="e.g. Excused travel, recovering at home"
                className="h-[40px] px-3 bg-surface border border-line rounded-input text-[13px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowDismissModal(false)}
                className="px-4 h-[38px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDismissSubmit}
                className="px-5 h-[38px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Confirm Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
