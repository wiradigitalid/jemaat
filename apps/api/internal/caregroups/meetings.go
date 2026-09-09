package caregroups

import (
	"errors"
	"fmt"
	"sync"
	"time"
)

type MeetingSession struct {
	ID             string    `json:"id"`
	CareGroupID    string    `json:"care_group_id"`
	CareGroupName  string    `json:"care_group_name"`
	Date           string    `json:"date"` // e.g. "2026-03-04"
	DateLabel      string    `json:"date_label"`
	HostName       string    `json:"host_name"`
	Topic          string    `json:"topic"`
	OfferingAmount int64     `json:"offering_amount"`
	AttendeesCount int       `json:"attendees_count"`
	GuestsCount    int       `json:"guests_count"`
	CreatedAt      time.Time `json:"created_at"`
}

type AttendanceRecord struct {
	ID               string    `json:"id"`
	MeetingSessionID string    `json:"meeting_session_id"`
	PersonID         string    `json:"person_id"`
	PersonName       string    `json:"person_name"`
	Attended         bool      `json:"attended"`
	Excused          bool      `json:"excused"`
	ExcusedReason    string    `json:"excused_reason,omitempty"`
	SyncedAt         time.Time `json:"synced_at"`
}

type AbsenceAlert struct {
	ID                  string    `json:"id"`
	PersonID            string    `json:"person_id"`
	PersonName          string    `json:"person_name"`
	PersonPhone         string    `json:"person_phone"`
	CareGroupID         string    `json:"care_group_id"`
	CareGroupName       string    `json:"care_group_name"`
	ConsecutiveAbsences int       `json:"consecutive_absences"`
	LastAttendedDate    string    `json:"last_attended_date"`
	Status              string    `json:"status"` // "pending", "contacted", "dismissed"
	ContactNotes        string    `json:"contact_notes,omitempty"`
	DismissReason       string    `json:"dismiss_reason,omitempty"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type AttendanceSyncItem struct {
	MeetingSessionID string `json:"meeting_session_id"`
	PersonID         string `json:"person_id"`
	PersonName       string `json:"person_name"`
	Attended         bool   `json:"attended"`
	Excused          bool   `json:"excused"`
	ExcusedReason    string `json:"excused_reason,omitempty"`
}

type SyncAttendanceRequest struct {
	Records []AttendanceSyncItem `json:"records"`
}

type MeetingStore struct {
	mu           sync.RWMutex
	meetings     map[string]MeetingSession
	meetingOrder []string
	attendance   map[string]AttendanceRecord // key: meetingID + ":" + personID (AD-5, BR-CG-2)
	alerts       map[string]AbsenceAlert
	alertOrder   []string
	seq          int
}

func NewMeetingStore() *MeetingStore {
	ms := &MeetingStore{
		meetings:     make(map[string]MeetingSession),
		meetingOrder: make([]string, 0),
		attendance:   make(map[string]AttendanceRecord),
		alerts:       make(map[string]AbsenceAlert),
		alertOrder:   make([]string, 0),
		seq:          100,
	}

	ms.seedDemoMeetingsAndAlerts()
	return ms
}

func (ms *MeetingStore) seedDemoMeetingsAndAlerts() {
	now := time.Now().UTC()

	demoMeetings := []MeetingSession{
		{
			ID:             "mtg-01",
			CareGroupID:    "cg-01",
			CareGroupName:  "Anugerah",
			Date:           "2026-02-18",
			DateLabel:      "WED 18 FEB",
			HostName:       "Bambang Prasetyo",
			Topic:          "Walking in Faith Part 1",
			OfferingAmount: 350000,
			AttendeesCount: 12,
			GuestsCount:    1,
			CreatedAt:      now.Add(-21 * 24 * time.Hour),
		},
		{
			ID:             "mtg-02",
			CareGroupID:    "cg-01",
			CareGroupName:  "Anugerah",
			Date:           "2026-02-25",
			DateLabel:      "WED 25 FEB",
			HostName:       "Andreas Halim",
			Topic:          "Walking in Faith Part 2",
			OfferingAmount: 420000,
			AttendeesCount: 11,
			GuestsCount:    0,
			CreatedAt:      now.Add(-14 * 24 * time.Hour),
		},
		{
			ID:             "mtg-03",
			CareGroupID:    "cg-01",
			CareGroupName:  "Anugerah",
			Date:           "2026-03-04",
			DateLabel:      "WED 4 MAR",
			HostName:       "Melisa Tanudjaja",
			Topic:          "Walking in Faith Part 3",
			OfferingAmount: 500000,
			AttendeesCount: 10,
			GuestsCount:    2,
			CreatedAt:      now.Add(-7 * 24 * time.Hour),
		},
	}

	for _, m := range demoMeetings {
		ms.meetings[m.ID] = m
		ms.meetingOrder = append(ms.meetingOrder, m.ID)
	}

	// Seed pastoral absence alerts (BR-3, 3 consecutive absences)
	demoAlerts := []AbsenceAlert{
		{
			ID:                  "alt-001",
			PersonID:            "per-dk",
			PersonName:          "Dedi Kurnia",
			PersonPhone:         "+62 812-9988-7766",
			CareGroupID:         "cg-01",
			CareGroupName:       "Anugerah",
			ConsecutiveAbsences: 3,
			LastAttendedDate:    "2026-02-11",
			Status:              "pending",
			CreatedAt:           now.Add(-48 * time.Hour),
			UpdatedAt:           now.Add(-48 * time.Hour),
		},
		{
			ID:                  "alt-002",
			PersonID:            "per-sl",
			PersonName:          "Samuel Lubis",
			PersonPhone:         "+62 813-1122-3344",
			CareGroupID:         "cg-01",
			CareGroupName:       "Anugerah",
			ConsecutiveAbsences: 3,
			LastAttendedDate:    "2026-02-11",
			Status:              "pending",
			CreatedAt:           now.Add(-24 * time.Hour),
			UpdatedAt:           now.Add(-24 * time.Hour),
		},
	}

	for _, a := range demoAlerts {
		ms.alerts[a.ID] = a
		ms.alertOrder = append(ms.alertOrder, a.ID)
	}
}

func (ms *MeetingStore) ListMeetings(careGroupID string) []MeetingSession {
	ms.mu.RLock()
	defer ms.mu.RUnlock()

	var result []MeetingSession
	for _, id := range ms.meetingOrder {
		m := ms.meetings[id]
		if careGroupID == "" || m.CareGroupID == careGroupID {
			result = append(result, m)
		}
	}
	return result
}

func (ms *MeetingStore) CreateMeeting(careGroupID, groupName, date, dateLabel, hostName, topic string, offering int64) (*MeetingSession, error) {
	if careGroupID == "" || date == "" {
		return nil, errors.New("care_group_id and date are required")
	}

	ms.mu.Lock()
	defer ms.mu.Unlock()

	ms.seq++
	id := fmt.Sprintf("mtg-%03d", ms.seq)
	m := MeetingSession{
		ID:             id,
		CareGroupID:    careGroupID,
		CareGroupName:  groupName,
		Date:           date,
		DateLabel:      dateLabel,
		HostName:       hostName,
		Topic:          topic,
		OfferingAmount: offering,
		AttendeesCount: 0,
		GuestsCount:    0,
		CreatedAt:      time.Now().UTC(),
	}

	ms.meetings[id] = m
	ms.meetingOrder = append(ms.meetingOrder, id)
	return &m, nil
}

// SyncAttendance implements idempotent upsert keyed on (meeting_session_id, person_id) (AD-5, BR-CG-2).
func (ms *MeetingStore) SyncAttendance(req SyncAttendanceRequest) int {
	ms.mu.Lock()
	defer ms.mu.Unlock()

	count := 0
	now := time.Now().UTC()

	for _, item := range req.Records {
		if item.MeetingSessionID == "" || item.PersonID == "" {
			continue
		}

		key := fmt.Sprintf("%s:%s", item.MeetingSessionID, item.PersonID)
		ms.attendance[key] = AttendanceRecord{
			ID:               key,
			MeetingSessionID: item.MeetingSessionID,
			PersonID:         item.PersonID,
			PersonName:       item.PersonName,
			Attended:         item.Attended,
			Excused:          item.Excused,
			ExcusedReason:    item.ExcusedReason,
			SyncedAt:         now,
		}
		count++
	}

	// Evaluate consecutive unexcused absence alerts dynamically (BR-3, BR-CG-3, FR-11)
	ms.evaluateAbsenceAlerts(req.Records)

	return count
}

func (ms *MeetingStore) evaluateAbsenceAlerts(syncedItems []AttendanceSyncItem) {
	now := time.Now().UTC()

	// Process unique persons from sync batch
	seenPersons := make(map[string]string)
	for _, item := range syncedItems {
		if item.PersonID != "" {
			seenPersons[item.PersonID] = item.PersonName
		}
	}

	for personID, personName := range seenPersons {
		unexcusedCount := 0
		lastAttendedDate := "None"
		careGroupID := "cg-01"
		careGroupName := "Anugerah"

		// Walk backwards from most recent meeting session
		for i := len(ms.meetingOrder) - 1; i >= 0; i-- {
			mtgID := ms.meetingOrder[i]
			mtg := ms.meetings[mtgID]
			key := fmt.Sprintf("%s:%s", mtgID, personID)
			rec, exists := ms.attendance[key]
			if !exists {
				continue
			}

			careGroupID = mtg.CareGroupID
			careGroupName = mtg.CareGroupName

			if rec.Attended {
				lastAttendedDate = mtg.Date
				break // attended, break streak
			}

			if rec.Excused {
				// BR-CG-3: Excused absences do not increment consecutive counter and break unexcused streak
				break
			}

			// Unexcused absence
			unexcusedCount++
		}

		// Trigger pastoral alert at threshold >= 3 (BR-3, FR-11)
		if unexcusedCount >= 3 {
			// Check if active alert already exists
			var existingAlertID string
			for id, alert := range ms.alerts {
				if alert.PersonID == personID && alert.Status != "dismissed" {
					existingAlertID = id
					break
				}
			}

			if existingAlertID != "" {
				a := ms.alerts[existingAlertID]
				a.ConsecutiveAbsences = unexcusedCount
				a.UpdatedAt = now
				ms.alerts[existingAlertID] = a
			} else {
				ms.seq++
				alertID := fmt.Sprintf("alt-%03d", ms.seq)
				newAlert := AbsenceAlert{
					ID:                  alertID,
					PersonID:            personID,
					PersonName:          personName,
					PersonPhone:         "+62 812-9988-0000",
					CareGroupID:         careGroupID,
					CareGroupName:       careGroupName,
					ConsecutiveAbsences: unexcusedCount,
					LastAttendedDate:    lastAttendedDate,
					Status:              "pending",
					CreatedAt:           now,
					UpdatedAt:           now,
				}
				ms.alerts[alertID] = newAlert
				ms.alertOrder = append(ms.alertOrder, alertID)
			}
		}
	}
}

func (ms *MeetingStore) ListAbsenceAlerts() []AbsenceAlert {
	ms.mu.RLock()
	defer ms.mu.RUnlock()

	var result []AbsenceAlert
	for _, id := range ms.alertOrder {
		result = append(result, ms.alerts[id])
	}
	return result
}

func (ms *MeetingStore) ContactAlert(alertID, notes string) (*AbsenceAlert, error) {
	ms.mu.Lock()
	defer ms.mu.Unlock()

	a, exists := ms.alerts[alertID]
	if !exists {
		return nil, errors.New("pastoral alert not found")
	}

	a.Status = "contacted"
	a.ContactNotes = notes
	a.UpdatedAt = time.Now().UTC()
	ms.alerts[alertID] = a
	return &a, nil
}

func (ms *MeetingStore) DismissAlert(alertID, reason string) (*AbsenceAlert, error) {
	ms.mu.Lock()
	defer ms.mu.Unlock()

	a, exists := ms.alerts[alertID]
	if !exists {
		return nil, errors.New("pastoral alert not found")
	}

	a.Status = "dismissed"
	a.DismissReason = reason
	a.UpdatedAt = time.Now().UTC()
	ms.alerts[alertID] = a
	return &a, nil
}
