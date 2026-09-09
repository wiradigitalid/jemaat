package serving

import (
	"errors"
	"fmt"
	"sync"
	"time"
)

type ConflictType string

const (
	ConflictTypeBlockout      ConflictType = "blockout"
	ConflictTypeDoubleBooking ConflictType = "double_booking"
)

var (
	ErrBlockoutInvalidDates = errors.New("blockout start date must be before or equal to end date")
	ErrSchedulingConflict   = errors.New("volunteer has a scheduling conflict: override requires reason code")
)

type VolunteerAvailability struct {
	ID        string    `json:"id"`
	PersonID  string    `json:"person_id"`
	StartDate string    `json:"start_date"` // YYYY-MM-DD
	EndDate   string    `json:"end_date"`   // YYYY-MM-DD
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"created_at"`
}

type ConflictResult struct {
	HasConflict    bool         `json:"has_conflict"`
	Type           ConflictType `json:"type,omitempty"`
	Reason         string       `json:"reason,omitempty"`
	ConflictingRef string       `json:"conflicting_ref,omitempty"`
}

type CreateAvailabilityRequest struct {
	PersonID  string `json:"person_id"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
	Reason    string `json:"reason"`
}

type ConflictEngine struct {
	mu           sync.RWMutex
	availList    []VolunteerAvailability
	availByID    map[string]VolunteerAvailability
	availCounter int
}

func NewConflictEngine() *ConflictEngine {
	ce := &ConflictEngine{
		availList:    make([]VolunteerAvailability, 0),
		availByID:    make(map[string]VolunteerAvailability),
		availCounter: 100,
	}
	ce.seedDemoAvailability()
	return ce
}

func (ce *ConflictEngine) seedDemoAvailability() {
	// Seed known blockout for Melisa Halim around late March
	demo := []VolunteerAvailability{
		{
			ID:        "blk-001",
			PersonID:  "per-002", // Melisa Halim
			StartDate: "2026-03-27",
			EndDate:   "2026-03-31",
			Reason:    "Out of town for family retreat in Bandung",
			CreatedAt: time.Now().UTC(),
		},
		{
			ID:        "blk-002",
			PersonID:  "per-003", // Gavriel Halim
			StartDate: "2026-03-25",
			EndDate:   "2026-03-30",
			Reason:    "College final exams prep",
			CreatedAt: time.Now().UTC(),
		},
	}
	for _, a := range demo {
		ce.availList = append(ce.availList, a)
		ce.availByID[a.ID] = a
	}
}

func (ce *ConflictEngine) AddAvailability(req CreateAvailabilityRequest) (*VolunteerAvailability, error) {
	if req.PersonID == "" {
		return nil, errors.New("person_id is required")
	}
	if req.StartDate == "" || req.EndDate == "" {
		return nil, errors.New("start_date and end_date are required")
	}
	if req.StartDate > req.EndDate {
		return nil, ErrBlockoutInvalidDates
	}

	ce.mu.Lock()
	defer ce.mu.Unlock()

	ce.availCounter++
	id := fmt.Sprintf("blk-%03d", ce.availCounter)
	avail := VolunteerAvailability{
		ID:        id,
		PersonID:  req.PersonID,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
		Reason:    req.Reason,
		CreatedAt: time.Now().UTC(),
	}

	ce.availList = append(ce.availList, avail)
	ce.availByID[id] = avail
	return &avail, nil
}

func (ce *ConflictEngine) ListAvailability(personID string) []VolunteerAvailability {
	ce.mu.RLock()
	defer ce.mu.RUnlock()

	if personID == "" {
		result := make([]VolunteerAvailability, len(ce.availList))
		copy(result, ce.availList)
		return result
	}

	var result []VolunteerAvailability
	for _, a := range ce.availList {
		if a.PersonID == personID {
			result = append(result, a)
		}
	}
	return result
}

// EvaluateAssignment checks for active blockout dates and double booking.
func (ce *ConflictEngine) EvaluateAssignment(personID, serviceID, serviceDate string, existingAssignments []RosterAssignment) ConflictResult {
	if personID == "" || personID == "—" {
		return ConflictResult{HasConflict: false}
	}

	ce.mu.RLock()
	defer ce.mu.RUnlock()

	// 1. Check blockout dates (BR-2)
	for _, a := range ce.availList {
		if a.PersonID == personID {
			if serviceDate >= a.StartDate && serviceDate <= a.EndDate {
				return ConflictResult{
					HasConflict:    true,
					Type:           ConflictTypeBlockout,
					Reason:         fmt.Sprintf("Volunteer is blocked out from %s to %s: %s", a.StartDate, a.EndDate, a.Reason),
					ConflictingRef: a.ID,
				}
			}
		}
	}

	// 2. Check overlapping assignments in the same service/date (AD-4)
	for _, asg := range existingAssignments {
		if asg.PersonID == personID && asg.Status != StatusDeclined && asg.Status != StatusOpen {
			if asg.ServiceID == serviceID || asg.ServiceDate == serviceDate {
				return ConflictResult{
					HasConflict:    true,
					Type:           ConflictTypeDoubleBooking,
					Reason:         fmt.Sprintf("Already scheduled in %s for %s on %s", asg.TeamName, asg.RoleName, asg.DateLabel),
					ConflictingRef: asg.ID,
				}
			}
		}
	}

	return ConflictResult{HasConflict: false}
}
