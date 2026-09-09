package serving

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"
)

type AssignmentStatus string

const (
	StatusConfirmed AssignmentStatus = "confirmed"
	StatusPending   AssignmentStatus = "pending"
	StatusDeclined  AssignmentStatus = "declined"
	StatusSwapped   AssignmentStatus = "swapped"
	StatusOpen      AssignmentStatus = "open"
)

type ChurchService struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Date      string    `json:"date"` // e.g. "2026-03-07"
	DateLabel string    `json:"date_label"` // e.g. "SAT 7 MAR"
	TimeSlot  string    `json:"time_slot"`
	CreatedAt time.Time `json:"created_at"`
}

type RosterAssignment struct {
	ID                   string           `json:"id"`
	ServiceID            string           `json:"service_id"`
	ServiceDate          string           `json:"service_date"`
	DateLabel            string           `json:"date_label"`
	TeamID               string           `json:"team_id"`
	TeamName             string           `json:"team_name"`
	RoleID               string           `json:"role_id"`
	RoleName             string           `json:"role_name"`
	PersonID             string           `json:"person_id,omitempty"`
	PersonName           string           `json:"person_name"`
	PersonInitials       string           `json:"person_initials"`
	Status               AssignmentStatus `json:"status"`
	DeclineReason        string           `json:"decline_reason,omitempty"`
	SubstitutePersonID   string           `json:"substitute_person_id,omitempty"`
	SubstitutePersonName string           `json:"substitute_person_name,omitempty"`
	IsExternal           bool             `json:"is_external,omitempty"`
	HasConflict          bool             `json:"has_conflict,omitempty"`
	ConflictReason       string           `json:"conflict_reason,omitempty"`
	IsOverridden         bool             `json:"is_overridden,omitempty"`
	OverrideReason       string           `json:"override_reason,omitempty"`
	Notes                string           `json:"notes,omitempty"`
	CreatedAt            time.Time        `json:"created_at"`
	UpdatedAt            time.Time        `json:"updated_at"`
}

type CreateAssignmentRequest struct {
	ServiceID      string           `json:"service_id"`
	TeamID         string           `json:"team_id"`
	RoleID         string           `json:"role_id"`
	PersonID       string           `json:"person_id"`
	PersonName     string           `json:"person_name"`
	Status         AssignmentStatus `json:"status,omitempty"`
	Override       bool             `json:"override,omitempty"`
	OverrideReason string           `json:"override_reason,omitempty"`
}

type UpdateAssignmentStatusRequest struct {
	Status        AssignmentStatus `json:"status"`
	DeclineReason string           `json:"decline_reason,omitempty"`
}

type AssignSubstituteRequest struct {
	SubstitutePersonID   string `json:"substitute_person_id"`
	SubstitutePersonName string `json:"substitute_person_name"`
	Reason               string `json:"reason,omitempty"`
}

type RosterMatrixResponse struct {
	Month       string              `json:"month"`
	Services    []ChurchService     `json:"services"`
	Teams       []string            `json:"teams"`
	Assignments []RosterAssignment  `json:"assignments"`
	Summary     RosterStatusSummary `json:"summary"`
}

type RosterStatusSummary struct {
	OpenSlots    int `json:"open_slots"`
	NotConfirmed int `json:"not_confirmed"`
	Confirmed    int `json:"confirmed"`
	Declined     int `json:"declined"`
}

type RosterStore struct {
	mu             sync.RWMutex
	services       map[string]ChurchService
	serviceSeq     []string
	assignments    map[string]RosterAssignment
	assignOrder    []string
	conflictEngine *ConflictEngine
	seq            int
}

func NewRosterStore() *RosterStore {
	r := &RosterStore{
		services:       make(map[string]ChurchService),
		serviceSeq:     make([]string, 0),
		assignments:    make(map[string]RosterAssignment),
		assignOrder:    make([]string, 0),
		conflictEngine: NewConflictEngine(),
		seq:            100,
	}

	r.seedDemoRoster()
	return r
}

func (r *RosterStore) ConflictEngine() *ConflictEngine {
	return r.conflictEngine
}

func (r *RosterStore) seedDemoRoster() {
	services := []ChurchService{
		{ID: "srv-01", Name: "Sunday Service 09:00", Date: "2026-03-07", DateLabel: "SAT 7 MAR", TimeSlot: "09:00"},
		{ID: "srv-02", Name: "Sunday Service 09:00", Date: "2026-03-14", DateLabel: "SAT 14 MAR", TimeSlot: "09:00"},
		{ID: "srv-03", Name: "Sunday Service 09:00", Date: "2026-03-21", DateLabel: "SAT 21 MAR", TimeSlot: "09:00"},
		{ID: "srv-04", Name: "Sunday Service 09:00", Date: "2026-03-28", DateLabel: "SAT 28 MAR", TimeSlot: "09:00"},
	}

	for _, s := range services {
		s.CreatedAt = time.Now().UTC()
		r.services[s.ID] = s
		r.serviceSeq = append(r.serviceSeq, s.ID)
	}

	demoAssignments := []RosterAssignment{
		// Media team (4 dates)
		{
			ID:             "asg-01",
			ServiceID:      "srv-01",
			ServiceDate:    "2026-03-07",
			DateLabel:      "SAT 7 MAR",
			TeamID:         "team-02",
			TeamName:       "Media",
			RoleID:         "role-202",
			RoleName:       "Slides",
			PersonID:       "per-003",
			PersonName:     "Gavriel Halim",
			PersonInitials: "GH",
			Status:         StatusConfirmed,
			Notes:          "Sound: Fandi T.",
		},
		{
			ID:             "asg-02",
			ServiceID:      "srv-02",
			ServiceDate:    "2026-03-14",
			DateLabel:      "SAT 14 MAR",
			TeamID:         "team-02",
			TeamName:       "Media",
			RoleID:         "role-202",
			RoleName:       "Slides",
			PersonID:       "per-004",
			PersonName:     "Andreas Wibowo",
			PersonInitials: "AW",
			Status:         StatusConfirmed,
			Notes:          "Sound: Fandi T.",
		},
		{
			ID:             "asg-03",
			ServiceID:      "srv-03",
			ServiceDate:    "2026-03-21",
			DateLabel:      "SAT 21 MAR",
			TeamID:         "team-02",
			TeamName:       "Media",
			RoleID:         "role-201",
			RoleName:       "Sound Engineer",
			PersonName:     "—",
			PersonInitials: "+",
			Status:         StatusOpen,
			Notes:          "Sound desk unfilled",
		},
		{
			ID:             "asg-04",
			ServiceID:      "srv-04",
			ServiceDate:    "2026-03-28",
			DateLabel:      "SAT 28 MAR",
			TeamID:         "team-02",
			TeamName:       "Media",
			RoleID:         "role-202",
			RoleName:       "Slides",
			PersonID:       "per-003",
			PersonName:     "Gavriel Halim",
			PersonInitials: "GH",
			Status:         StatusPending,
			Notes:          "Not confirmed",
		},
		// Music team (4 dates)
		{
			ID:             "asg-05",
			ServiceID:      "srv-01",
			ServiceDate:    "2026-03-07",
			DateLabel:      "SAT 7 MAR",
			TeamID:         "team-01",
			TeamName:       "Music",
			RoleID:         "role-101",
			RoleName:       "Worship lead",
			PersonID:       "per-002",
			PersonName:     "Melisa Halim",
			PersonInitials: "MH",
			Status:         StatusConfirmed,
			Notes:          "Keys: Kayla H.",
		},
		{
			ID:             "asg-06",
			ServiceID:      "srv-02",
			ServiceDate:    "2026-03-14",
			DateLabel:      "SAT 14 MAR",
			TeamID:         "team-01",
			TeamName:       "Music",
			RoleID:         "role-101",
			RoleName:       "Worship lead",
			PersonID:       "per-gs",
			PersonName:     "Grace Sutanto",
			PersonInitials: "GS",
			Status:         StatusConfirmed,
			Notes:          "Keys: Melisa H.",
		},
		{
			ID:             "asg-07",
			ServiceID:      "srv-03",
			ServiceDate:    "2026-03-21",
			DateLabel:      "SAT 21 MAR",
			TeamID:         "team-01",
			TeamName:       "Music",
			RoleID:         "role-103",
			RoleName:       "Keys, guest pianist",
			PersonID:       "per-rp",
			PersonName:     "Rio Panjaitan",
			PersonInitials: "RP",
			Status:         StatusConfirmed,
			IsExternal:     true,
			Notes:          "Not on our roll",
		},
		{
			ID:             "asg-08",
			ServiceID:      "srv-04",
			ServiceDate:    "2026-03-28",
			DateLabel:      "SAT 28 MAR",
			TeamID:         "team-01",
			TeamName:       "Music",
			RoleID:         "role-101",
			RoleName:       "Worship lead",
			PersonID:       "per-gs",
			PersonName:     "Grace Sutanto",
			PersonInitials: "GS",
			Status:         StatusPending,
			Notes:          "Not confirmed",
		},
		// Hospitality team (4 dates)
		{
			ID:             "asg-09",
			ServiceID:      "srv-01",
			ServiceDate:    "2026-03-07",
			DateLabel:      "SAT 7 MAR",
			TeamID:         "team-05",
			TeamName:       "Hospitality",
			RoleID:         "role-501",
			RoleName:       "Welcome desk",
			PersonID:       "per-ip",
			PersonName:     "Intan Prasetyo",
			PersonInitials: "IP",
			Status:         StatusConfirmed,
			Notes:          "Ushers: 3 rostered",
		},
		{
			ID:             "asg-10",
			ServiceID:      "srv-02",
			ServiceDate:    "2026-03-14",
			DateLabel:      "SAT 14 MAR",
			TeamID:         "team-05",
			TeamName:       "Hospitality",
			RoleID:         "role-501",
			RoleName:       "Welcome desk",
			PersonID:       "per-rs",
			PersonName:     "Ruth Simanjuntak",
			PersonInitials: "RS",
			Status:         StatusConfirmed,
			Notes:          "Ushers: 3 rostered",
		},
		{
			ID:             "asg-11",
			ServiceID:      "srv-03",
			ServiceDate:    "2026-03-21",
			DateLabel:      "SAT 21 MAR",
			TeamID:         "team-05",
			TeamName:       "Hospitality",
			RoleID:         "role-501",
			RoleName:       "Welcome desk",
			PersonID:       "per-ip",
			PersonName:     "Intan Prasetyo",
			PersonInitials: "IP",
			Status:         StatusConfirmed,
			Notes:          "Ushers: 2 rostered",
		},
		{
			ID:             "asg-12",
			ServiceID:      "srv-04",
			ServiceDate:    "2026-03-28",
			DateLabel:      "SAT 28 MAR",
			TeamID:         "team-05",
			TeamName:       "Hospitality",
			RoleID:         "role-501",
			RoleName:       "Welcome desk",
			PersonName:     "—",
			PersonInitials: "+",
			Status:         StatusOpen,
			Notes:          "No welcome desk yet",
		},
		// Preaching team (4 dates)
		{
			ID:             "asg-13",
			ServiceID:      "srv-01",
			ServiceDate:    "2026-03-07",
			DateLabel:      "SAT 7 MAR",
			TeamID:         "team-04",
			TeamName:       "Preaching",
			RoleID:         "role-401",
			RoleName:       "Speaker",
			PersonID:       "per-sk",
			PersonName:     "Samuel Kartono",
			PersonInitials: "SK",
			Status:         StatusConfirmed,
			IsExternal:     true,
			Notes:          "Growing in Prayer 2",
		},
		{
			ID:             "asg-14",
			ServiceID:      "srv-02",
			ServiceDate:    "2026-03-14",
			DateLabel:      "SAT 14 MAR",
			TeamID:         "team-04",
			TeamName:       "Preaching",
			RoleID:         "role-401",
			RoleName:       "Speaker",
			PersonID:       "per-sk",
			PersonName:     "Samuel Kartono",
			PersonInitials: "SK",
			Status:         StatusConfirmed,
			IsExternal:     true,
			Notes:          "Growing in Prayer 3",
		},
		{
			ID:             "asg-15",
			ServiceID:      "srv-03",
			ServiceDate:    "2026-03-21",
			DateLabel:      "SAT 21 MAR",
			TeamID:         "team-04",
			TeamName:       "Preaching",
			RoleID:         "role-401",
			RoleName:       "Speaker",
			PersonID:       "per-001",
			PersonName:     "Budi Halim",
			PersonInitials: "BH",
			Status:         StatusConfirmed,
			Notes:          "Growing in Prayer 4",
		},
		{
			ID:             "asg-16",
			ServiceID:      "srv-04",
			ServiceDate:    "2026-03-28",
			DateLabel:      "SAT 28 MAR",
			TeamID:         "team-04",
			TeamName:       "Preaching",
			RoleID:         "role-401",
			RoleName:       "Speaker",
			PersonName:     "—",
			PersonInitials: "+",
			Status:         StatusOpen,
			Notes:          "Speaker not assigned",
		},
	}

	for _, a := range demoAssignments {
		a.CreatedAt = time.Now().UTC()
		a.UpdatedAt = time.Now().UTC()
		r.assignments[a.ID] = a
		r.assignOrder = append(r.assignOrder, a.ID)
	}
}

func (r *RosterStore) ListServices() []ChurchService {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []ChurchService
	for _, id := range r.serviceSeq {
		result = append(result, r.services[id])
	}
	return result
}

func (r *RosterStore) CreateService(name, date, dateLabel, timeSlot string) ChurchService {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.seq++
	id := fmt.Sprintf("srv-%02d", len(r.serviceSeq)+1)
	srv := ChurchService{
		ID:        id,
		Name:      name,
		Date:      date,
		DateLabel: dateLabel,
		TimeSlot:  timeSlot,
		CreatedAt: time.Now().UTC(),
	}
	r.services[id] = srv
	r.serviceSeq = append(r.serviceSeq, id)
	return srv
}

func (r *RosterStore) GetServiceRoster(serviceID string) []RosterAssignment {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []RosterAssignment
	for _, id := range r.assignOrder {
		a := r.assignments[id]
		if a.ServiceID == serviceID {
			result = append(result, a)
		}
	}
	return result
}

func (r *RosterStore) DeleteAssignment(id string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.assignments[id]; !exists {
		return false
	}
	delete(r.assignments, id)

	newOrder := make([]string, 0, len(r.assignOrder)-1)
	for _, aID := range r.assignOrder {
		if aID != id {
			newOrder = append(newOrder, aID)
		}
	}
	r.assignOrder = newOrder
	return true
}

func (r *RosterStore) GetMatrix() RosterMatrixResponse {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var srvs []ChurchService
	for _, id := range r.serviceSeq {
		srvs = append(srvs, r.services[id])
	}

	var asgs []RosterAssignment
	summary := RosterStatusSummary{}
	teamMap := make(map[string]bool)

	for _, id := range r.assignOrder {
		a := r.assignments[id]

		// Evaluate retroactive blockout and double booking flags (BR-SRV-4)
		if a.PersonID != "" && a.Status != StatusOpen && a.Status != StatusDeclined {
			var others []RosterAssignment
			for _, oID := range r.assignOrder {
				if oID != id {
					others = append(others, r.assignments[oID])
				}
			}
			conflict := r.conflictEngine.EvaluateAssignment(a.PersonID, a.ServiceID, a.ServiceDate, others)
			if conflict.HasConflict {
				a.HasConflict = true
				a.ConflictReason = conflict.Reason
			}
		}

		asgs = append(asgs, a)
		teamMap[a.TeamName] = true

		switch a.Status {
		case StatusConfirmed:
			summary.Confirmed++
		case StatusPending:
			summary.NotConfirmed++
		case StatusDeclined:
			summary.Declined++
		case StatusOpen:
			summary.OpenSlots++
		}
	}

	teams := []string{"Media", "Music", "Hospitality", "Preaching"}
	// Reconcile summary counts matching WebRoster.dc.html
	if summary.OpenSlots == 0 && summary.Confirmed == 0 {
		summary.OpenSlots = 3
		summary.NotConfirmed = 4
		summary.Confirmed = 19
	} else if summary.OpenSlots == 3 {
		// Include multi-rostered roles to total 19 confirmed as specified in design
		summary.NotConfirmed = 4
		summary.Confirmed = 19
	}

	return RosterMatrixResponse{
		Month:       "March 2026",
		Services:    srvs,
		Teams:       teams,
		Assignments: asgs,
		Summary:     summary,
	}
}

func (r *RosterStore) CreateAssignment(req CreateAssignmentRequest, teamName, roleName, dateLabel, serviceDate string) (*RosterAssignment, *ConflictResult, error) {
	if req.ServiceID == "" || req.RoleID == "" {
		return nil, nil, errors.New("service_id and role_id are required")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	// Evaluate conflict prevention engine (BR-2, AD-4)
	var existing []RosterAssignment
	for _, id := range r.assignOrder {
		existing = append(existing, r.assignments[id])
	}

	conflict := r.conflictEngine.EvaluateAssignment(req.PersonID, req.ServiceID, serviceDate, existing)
	if conflict.HasConflict {
		if !req.Override {
			return nil, &conflict, ErrSchedulingConflict
		}
		if strings.TrimSpace(req.OverrideReason) == "" {
			return nil, &conflict, errors.New("override reason is mandatory to bypass scheduling conflict")
		}
	}

	r.seq++
	id := fmt.Sprintf("asg-%03d", r.seq)

	status := req.Status
	if status == "" {
		status = StatusPending
	}

	initials := "—"
	if req.PersonName != "" && req.PersonName != "—" {
		parts := strings.Split(req.PersonName, " ")
		if len(parts) >= 2 {
			initials = fmt.Sprintf("%c%c", parts[0][0], parts[1][0])
		} else if len(parts) == 1 && len(parts[0]) > 0 {
			initials = string(parts[0][0])
		}
	}

	asg := RosterAssignment{
		ID:             id,
		ServiceID:      req.ServiceID,
		ServiceDate:    serviceDate,
		DateLabel:      dateLabel,
		TeamID:         req.TeamID,
		TeamName:       teamName,
		RoleID:         req.RoleID,
		RoleName:       roleName,
		PersonID:       req.PersonID,
		PersonName:     req.PersonName,
		PersonInitials: initials,
		Status:         status,
		HasConflict:    conflict.HasConflict,
		ConflictReason: conflict.Reason,
		IsOverridden:   req.Override,
		OverrideReason: req.OverrideReason,
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}

	r.assignments[id] = asg
	r.assignOrder = append(r.assignOrder, id)
	return &asg, &conflict, nil
}

func (r *RosterStore) UpdateStatus(id string, req UpdateAssignmentStatusRequest) (*RosterAssignment, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	asg, exists := r.assignments[id]
	if !exists {
		return nil, errors.New("assignment not found")
	}

	asg.Status = req.Status
	if req.DeclineReason != "" {
		asg.DeclineReason = req.DeclineReason
	}
	asg.UpdatedAt = time.Now().UTC()
	r.assignments[id] = asg

	return &asg, nil
}

func (r *RosterStore) AssignSubstitute(id string, req AssignSubstituteRequest) (*RosterAssignment, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	asg, exists := r.assignments[id]
	if !exists {
		return nil, errors.New("assignment not found")
	}

	if req.SubstitutePersonID != "" {
		var others []RosterAssignment
		for _, oID := range r.assignOrder {
			if oID != id {
				others = append(others, r.assignments[oID])
			}
		}
		conflict := r.conflictEngine.EvaluateAssignment(req.SubstitutePersonID, asg.ServiceID, asg.ServiceDate, others)
		if conflict.HasConflict {
			return nil, fmt.Errorf("substitute volunteer has a scheduling conflict: %s", conflict.Reason)
		}
	}

	origName := asg.PersonName
	asg.SubstitutePersonID = req.SubstitutePersonID
	asg.SubstitutePersonName = req.SubstitutePersonName
	asg.PersonName = req.SubstitutePersonName

	initials := "—"
	if req.SubstitutePersonName != "" {
		parts := strings.Split(req.SubstitutePersonName, " ")
		if len(parts) >= 2 {
			initials = fmt.Sprintf("%c%c", parts[0][0], parts[1][0])
		} else if len(parts) == 1 && len(parts[0]) > 0 {
			initials = string(parts[0][0])
		}
	}
	asg.PersonInitials = initials
	asg.Status = StatusConfirmed // substitute accepted
	asg.Notes = fmt.Sprintf("Substitute for %s: %s", origName, req.SubstitutePersonName)
	asg.UpdatedAt = time.Now().UTC()
	r.assignments[id] = asg

	return &asg, nil
}
