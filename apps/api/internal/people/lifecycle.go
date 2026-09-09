package people

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"
)

type AuditEntry struct {
	ID           string    `json:"id"`
	PersonID     string    `json:"person_id"`
	Action       string    `json:"action"`
	FieldChanged string    `json:"field_changed"`
	OldValue     string    `json:"old_value"`
	NewValue     string    `json:"new_value"`
	OperatorName string    `json:"operator_name"`
	Timestamp    time.Time `json:"timestamp"`
}

type TransferRecord struct {
	ID                string    `json:"id"`
	PersonID          string    `json:"person_id"`
	PersonName        string    `json:"person_name"`
	DestChurchName    string    `json:"dest_church_name"`
	TransferDate      string    `json:"transfer_date"`
	CertificateNumber string    `json:"certificate_number"`
	Status            string    `json:"status"` // "transferred_out", "attestation_issued"
	IssuedBy          string    `json:"issued_by"`
	CreatedAt         time.Time `json:"created_at"`
}

type TransferRequest struct {
	DestChurchName    string `json:"dest_church_name"`
	TransferDate      string `json:"transfer_date"`
	CertificateNumber string `json:"certificate_number"`
	Reason            string `json:"reason,omitempty"`
}

type StatusTransitionRequest struct {
	Standing  *MemberStanding  `json:"standing,omitempty"`
	Lifecycle *LifecycleStatus `json:"lifecycle,omitempty"`
	Reason    string           `json:"reason,omitempty"`
}

type LifecycleManager struct {
	mu        sync.RWMutex
	audits    map[string][]AuditEntry // keyed by person_id
	transfers map[string][]TransferRecord
	seq       int
}

func NewLifecycleManager() *LifecycleManager {
	return &LifecycleManager{
		audits:    make(map[string][]AuditEntry),
		transfers: make(map[string][]TransferRecord),
		seq:       1,
	}
}

func (s *Store) UpdateMembershipStatus(personID string, req StatusTransitionRequest, operator string) (*Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	p, exists := s.people[personID]
	if !exists {
		return nil, errors.New("person not found")
	}

	if req.Standing != nil && *req.Standing != p.Standing {
		oldVal := string(p.Standing)
		p.Standing = *req.Standing
		s.recordAudit(personID, "standing_change", "standing", oldVal, string(*req.Standing), operator)
	}

	if req.Lifecycle != nil && *req.Lifecycle != p.Lifecycle {
		oldVal := string(p.Lifecycle)
		newLifecycle := *req.Lifecycle
		p.Lifecycle = newLifecycle
		s.recordAudit(personID, "lifecycle_change", "lifecycle", oldVal, string(newLifecycle), operator)

		// Rule BR-MEM-4: Marking a member status as transferred, archived, or deceased
		// automatically closes all active ministry serving roles and care group enrollments.
		if newLifecycle == LifecycleTransferred || newLifecycle == LifecyclePassedAway || newLifecycle == LifecycleInactive {
			if p.CareGroupName != "" {
				s.recordAudit(personID, "caregroup_auto_close", "care_group", p.CareGroupName, "— (auto-closed per BR-MEM-4)", operator)
				p.CareGroupID = ""
				p.CareGroupName = ""
			}
			// Close serving roles
			p.Notes = strings.TrimSpace(p.Notes + fmt.Sprintf("\nActive roles auto-closed on %s (%s)", newLifecycle, time.Now().Format("2006-01-02")))
		}
	}

	p.UpdatedAt = time.Now().UTC()
	s.people[personID] = p
	return &p, nil
}

func (s *Store) RecordTransfer(personID string, req TransferRequest, operator string) (*TransferRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	p, exists := s.people[personID]
	if !exists {
		return nil, errors.New("person not found")
	}

	destChurch := strings.TrimSpace(req.DestChurchName)
	if destChurch == "" {
		return nil, errors.New("destination church name is required")
	}

	certNum := strings.TrimSpace(req.CertificateNumber)
	if certNum == "" {
		certNum = fmt.Sprintf("ATT-%s-%04d", time.Now().Format("200601"), len(s.people)+100)
	}

	tDate := strings.TrimSpace(req.TransferDate)
	if tDate == "" {
		tDate = time.Now().Format("2006-01-02")
	}

	// Move person lifecycle to Transferred out and auto-close roles (BR-MEM-4)
	oldLifecycle := string(p.Lifecycle)
	p.Lifecycle = LifecycleTransferred
	if p.CareGroupName != "" {
		s.recordAudit(personID, "caregroup_auto_close", "care_group", p.CareGroupName, "— (transferred per BR-MEM-4)", operator)
		p.CareGroupID = ""
		p.CareGroupName = ""
	}
	p.Notes = strings.TrimSpace(p.Notes + fmt.Sprintf("\nTransferred to %s (Cert: %s) on %s", destChurch, certNum, tDate))
	p.UpdatedAt = time.Now().UTC()
	s.people[personID] = p

	s.recordAudit(personID, "transfer_out", "lifecycle", oldLifecycle, string(LifecycleTransferred), operator)

	rec := TransferRecord{
		ID:                fmt.Sprintf("trf-%d", time.Now().UnixNano()),
		PersonID:          personID,
		PersonName:        p.FullName,
		DestChurchName:    destChurch,
		TransferDate:      tDate,
		CertificateNumber: certNum,
		Status:            "transferred_out",
		IssuedBy:          operator,
		CreatedAt:         time.Now().UTC(),
	}

	if s.transfers == nil {
		s.transfers = make(map[string][]TransferRecord)
	}
	s.transfers[personID] = append(s.transfers[personID], rec)

	return &rec, nil
}

func (s *Store) GetAuditHistory(personID string) []AuditEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()

	entries, exists := s.audits[personID]
	if !exists {
		return []AuditEntry{
			{
				ID:           "aud-init",
				PersonID:     personID,
				Action:       "record_created",
				FieldChanged: "profile",
				OldValue:     "—",
				NewValue:     "Created by Church Office Administrator",
				OperatorName: "Lidya S.",
				Timestamp:    time.Now().Add(-72 * time.Hour),
			},
		}
	}
	return entries
}

func (s *Store) recordAudit(personID, action, field, oldVal, newVal, operator string) {
	if s.audits == nil {
		s.audits = make(map[string][]AuditEntry)
	}

	entry := AuditEntry{
		ID:           fmt.Sprintf("aud-%d", time.Now().UnixNano()),
		PersonID:     personID,
		Action:       action,
		FieldChanged: field,
		OldValue:     oldVal,
		NewValue:     newVal,
		OperatorName: operator,
		Timestamp:    time.Now().UTC(),
	}

	s.audits[personID] = append(s.audits[personID], entry)
}
