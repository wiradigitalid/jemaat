package portal

import (
	"errors"
	"sync"
	"time"
)

type ApplicantStatus string

const (
	ApplicantStatusPending   ApplicantStatus = "pending"
	ApplicantStatusContacted ApplicantStatus = "contacted"
	ApplicantStatusAdmitted  ApplicantStatus = "admitted"
	ApplicantStatusRejected  ApplicantStatus = "rejected"
)

type GuestApplicant struct {
	ID                  string          `json:"id"`
	FullName            string          `json:"full_name"`
	Initials            string          `json:"initials"`
	Phone               string          `json:"phone"`
	Email               string          `json:"email,omitempty"`
	WorshippingDuration string          `json:"worshipping_duration"`
	CurrentMembership   string          `json:"current_membership"`
	RequestedCategory   string          `json:"requested_category"`
	Status              ApplicantStatus `json:"status"`
	DaysWaiting         int             `json:"days_waiting"`
	SubmittedAtLabel    string          `json:"submitted_at_label"`
	ContactNotes        string          `json:"contact_notes,omitempty"`
	HouseholdAction     string          `json:"household_action,omitempty"`
	CareGroupAssignment string          `json:"care_group_assignment,omitempty"`
	MembershipStatus    string          `json:"membership_status,omitempty"`
	CreatedAt           time.Time       `json:"created_at"`
	UpdatedAt           time.Time       `json:"updated_at"`
}

type AdmitApplicantRequest struct {
	MembershipStatus string `json:"membership_status"`
	HouseholdAction  string `json:"household_action"`
	CareGroupID      string `json:"care_group_id,omitempty"`
	CareGroupName    string `json:"care_group_name,omitempty"`
}

type ContactApplicantRequest struct {
	Notes string `json:"notes"`
}

type DispatchResult struct {
	DispatchedCount int    `json:"dispatched_count"`
	ThrottledQuiet  int    `json:"throttled_quiet"`
	Status          string `json:"status"`
	Message         string `json:"message"`
}

type ApplicantStore struct {
	mu             sync.RWMutex
	applicants     map[string]GuestApplicant
	applicantOrder []string
	seq            int
}

func NewApplicantStore() *ApplicantStore {
	as := &ApplicantStore{
		applicants:     make(map[string]GuestApplicant),
		applicantOrder: make([]string, 0),
		seq:            100,
	}

	as.seedDemoApplicants()
	return as
}

func (as *ApplicantStore) seedDemoApplicants() {
	now := time.Now().UTC()

	demo := []GuestApplicant{
		{
			ID:                  "app-01",
			FullName:            "Rian Wijaya",
			Initials:            "RW",
			Phone:               "+62 812-1234-5678",
			Email:               "rian.wijaya@gmail.com",
			WorshippingDuration: "Over a year",
			CurrentMembership:   "Bethania Church, Bandung",
			RequestedCategory:   "Community Member",
			Status:              ApplicantStatusPending,
			DaysWaiting:         2,
			SubmittedAtLabel:    "8 March, 14.22",
			CreatedAt:           now.Add(-48 * time.Hour),
			UpdatedAt:           now.Add(-48 * time.Hour),
		},
		{
			ID:                  "app-02",
			FullName:            "Grace Sutanto",
			Initials:            "GS",
			Phone:               "+62 813-2233-4455",
			Email:               "grace.sutanto@gmail.com",
			WorshippingDuration: "6 to 12 months",
			CurrentMembership:   "no other church",
			RequestedCategory:   "Registered Member",
			Status:              ApplicantStatusPending,
			DaysWaiting:         2,
			SubmittedAtLabel:    "8 March, 11.05",
			CreatedAt:           now.Add(-48 * time.Hour),
			UpdatedAt:           now.Add(-48 * time.Hour),
		},
		{
			ID:                  "app-03",
			FullName:            "Fandi Tobing",
			Initials:            "FT",
			Phone:               "+62 811-9988-7766",
			Email:               "fandi.tobing@gmail.com",
			WorshippingDuration: "Over a year",
			CurrentMembership:   "Ebenhaezer Church, Jakarta",
			RequestedCategory:   "Community Member",
			Status:              ApplicantStatusPending,
			DaysWaiting:         3,
			SubmittedAtLabel:    "7 March, 18.40",
			CreatedAt:           now.Add(-72 * time.Hour),
			UpdatedAt:           now.Add(-72 * time.Hour),
		},
		{
			ID:                  "app-04",
			FullName:            "Sinta Rahmat",
			Initials:            "SR",
			Phone:               "+62 812-5544-3322",
			Email:               "sinta.rahmat@gmail.com",
			WorshippingDuration: "Under 6 months",
			CurrentMembership:   "no other church",
			RequestedCategory:   "Community Member",
			Status:              ApplicantStatusPending,
			DaysWaiting:         4,
			SubmittedAtLabel:    "6 March, 09.15",
			CreatedAt:           now.Add(-96 * time.Hour),
			UpdatedAt:           now.Add(-96 * time.Hour),
		},
		{
			ID:                  "app-05",
			FullName:            "Hendra Lie",
			Initials:            "HL",
			Phone:               "+62 813-7788-9900",
			Email:               "hendra.lie@gmail.com",
			WorshippingDuration: "Over a year",
			CurrentMembership:   "Zion Church, Bandung",
			RequestedCategory:   "Registered Member",
			Status:              ApplicantStatusPending,
			DaysWaiting:         4,
			SubmittedAtLabel:    "6 March, 08.50",
			CreatedAt:           now.Add(-96 * time.Hour),
			UpdatedAt:           now.Add(-96 * time.Hour),
		},
	}

	for _, a := range demo {
		as.applicants[a.ID] = a
		as.applicantOrder = append(as.applicantOrder, a.ID)
	}
}

func (as *ApplicantStore) List() []GuestApplicant {
	as.mu.RLock()
	defer as.mu.RUnlock()

	result := make([]GuestApplicant, 0, len(as.applicantOrder))
	for _, id := range as.applicantOrder {
		result = append(result, as.applicants[id])
	}
	return result
}

func (as *ApplicantStore) Get(id string) (*GuestApplicant, error) {
	as.mu.RLock()
	defer as.mu.RUnlock()

	a, exists := as.applicants[id]
	if !exists {
		return nil, errors.New("applicant not found")
	}
	return &a, nil
}

func (as *ApplicantStore) Contact(id string, notes string) (*GuestApplicant, error) {
	as.mu.Lock()
	defer as.mu.Unlock()

	a, exists := as.applicants[id]
	if !exists {
		return nil, errors.New("applicant not found")
	}

	a.Status = ApplicantStatusContacted
	a.ContactNotes = notes
	a.UpdatedAt = time.Now().UTC()
	as.applicants[id] = a
	return &a, nil
}

func (as *ApplicantStore) Admit(id string, req AdmitApplicantRequest) (*GuestApplicant, error) {
	as.mu.Lock()
	defer as.mu.Unlock()

	a, exists := as.applicants[id]
	if !exists {
		return nil, errors.New("applicant not found")
	}

	a.Status = ApplicantStatusAdmitted
	a.HouseholdAction = req.HouseholdAction
	a.MembershipStatus = req.MembershipStatus
	if req.CareGroupName != "" {
		a.CareGroupAssignment = req.CareGroupName
	}
	a.UpdatedAt = time.Now().UTC()
	as.applicants[id] = a
	return &a, nil
}

// DispatchNotifications processes queued reminders respecting quiet hours (21:00 - 07:00 WIB/local) (BR-POR-4, BR-6).
func (as *ApplicantStore) DispatchNotifications(targetTime time.Time) DispatchResult {
	// Convert targetTime explicitly to church local time (WIB UTC+7) (BR-6)
	wib := time.FixedZone("WIB", 7*3600)
	hour := targetTime.In(wib).Hour()

	// Quiet hours in local WIB: 21:00 to 07:00
	if hour >= 21 || hour < 7 {
		return DispatchResult{
			DispatchedCount: 0,
			ThrottledQuiet:  15,
			Status:          "throttled_quiet_hours",
			Message:         "Automated notifications paused during quiet hours (21:00 - 07:00 WIB)",
		}
	}

	return DispatchResult{
		DispatchedCount: 15,
		ThrottledQuiet:  0,
		Status:          "dispatched",
		Message:         "Notifications dispatched successfully",
	}
}
