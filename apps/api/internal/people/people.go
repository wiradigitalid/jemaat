package people

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"
)

type MembershipStanding string

const (
	StandingRegistered MemberStanding = "Registered Member"
	StandingMember     MemberStanding = "Member"
	StandingCommunity  MemberStanding = "Community"
	StandingGuest      MemberStanding = "Guest"
	StandingExternal   MemberStanding = "Not on our roll"
)

type MemberStanding = MembershipStanding

type LifecycleStatus string

const (
	LifecycleActive      LifecycleStatus = "Active"
	LifecycleInactive    LifecycleStatus = "Inactive"
	LifecycleTransferred LifecycleStatus = "Transferred out"
	LifecyclePassedAway  LifecycleStatus = "Passed away"
)

type HouseholdRole string

const (
	RoleHead   HouseholdRole = "Head"
	RoleSpouse HouseholdRole = "Spouse"
	RoleChild  HouseholdRole = "Child"
	RoleOther  HouseholdRole = "Other"
)

type Person struct {
	ID                string          `json:"id"`
	FullName          string          `json:"full_name"`
	Phone             string          `json:"phone"`
	SecondPhone       string          `json:"second_phone,omitempty"`
	Email             string          `json:"email,omitempty"`
	DateOfBirth       string          `json:"date_of_birth,omitempty"`
	Age               int             `json:"age,omitempty"`
	WithUsSince       string          `json:"with_us_since,omitempty"`
	Standing          MemberStanding  `json:"standing"`
	Lifecycle         LifecycleStatus `json:"lifecycle"`
	HouseholdID       string          `json:"household_id,omitempty"`
	HouseholdName     string          `json:"household_name,omitempty"`
	RoleInHousehold   HouseholdRole   `json:"role_in_household,omitempty"`
	CareGroupID       string          `json:"care_group_id,omitempty"`
	CareGroupName     string          `json:"care_group_name,omitempty"`
	Notes             string          `json:"notes,omitempty"`
	PrivacyOptIn      bool            `json:"privacy_opt_in"`
	CreatedAt         time.Time       `json:"created_at"`
	UpdatedAt         time.Time       `json:"updated_at"`
}

type CreatePersonRequest struct {
	FullName        string          `json:"full_name"`
	Phone           string          `json:"phone"`
	SecondPhone     string          `json:"second_phone,omitempty"`
	Email           string          `json:"email,omitempty"`
	DateOfBirth     string          `json:"date_of_birth,omitempty"`
	WithUsSince     string          `json:"with_us_since,omitempty"`
	Standing        MemberStanding  `json:"standing"`
	Lifecycle       LifecycleStatus `json:"lifecycle,omitempty"`
	HouseholdID     string          `json:"household_id,omitempty"`
	HouseholdName   string          `json:"household_name,omitempty"`
	RoleInHousehold HouseholdRole   `json:"role_in_household,omitempty"`
	CareGroupID     string          `json:"care_group_id,omitempty"`
	CareGroupName   string          `json:"care_group_name,omitempty"`
	Notes           string          `json:"notes,omitempty"`
	PrivacyOptIn    bool            `json:"privacy_opt_in,omitempty"`
}

type UpdatePersonRequest struct {
	FullName        *string          `json:"full_name,omitempty"`
	Phone           *string          `json:"phone,omitempty"`
	SecondPhone     *string          `json:"second_phone,omitempty"`
	Email           *string          `json:"email,omitempty"`
	DateOfBirth     *string          `json:"date_of_birth,omitempty"`
	WithUsSince     *string          `json:"with_us_since,omitempty"`
	Standing        *MemberStanding  `json:"standing,omitempty"`
	Lifecycle       *LifecycleStatus `json:"lifecycle,omitempty"`
	HouseholdID     *string          `json:"household_id,omitempty"`
	HouseholdName   *string          `json:"household_name,omitempty"`
	RoleInHousehold *HouseholdRole   `json:"role_in_household,omitempty"`
	CareGroupID     *string          `json:"care_group_id,omitempty"`
	CareGroupName   *string          `json:"care_group_name,omitempty"`
	Notes           *string          `json:"notes,omitempty"`
	PrivacyOptIn    *bool            `json:"privacy_opt_in,omitempty"`
}

type ListFilter struct {
	Query     string
	Standing  string
	Lifecycle string
	CareGroup string
	Mask      bool
}

type Store struct {
	mu     sync.RWMutex
	people map[string]Person
	order  []string
	seq    int
}

func NewStore() *Store {
	return &Store{
		people: make(map[string]Person),
		order:  make([]string, 0),
		seq:    100,
	}
}

func NormalizePhone(p string) string {
	cleaned := strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' || r == '+' {
			return r
		}
		return -1
	}, strings.TrimSpace(p))

	if strings.HasPrefix(cleaned, "+62") {
		return cleaned
	}
	if strings.HasPrefix(cleaned, "62") {
		return "+" + cleaned
	}
	if strings.HasPrefix(cleaned, "0") {
		return "+62" + cleaned[1:]
	}
	if !strings.HasPrefix(cleaned, "+") && len(cleaned) > 0 {
		return "+62" + cleaned
	}
	return cleaned
}

func MaskPhone(p string) string {
	cleaned := strings.TrimSpace(p)
	if len(cleaned) < 7 {
		return "••••••••"
	}
	prefix := cleaned[:4]
	suffix := cleaned[len(cleaned)-2:]
	return prefix + "-••••-" + suffix
}

func MaskEmail(e string) string {
	parts := strings.Split(e, "@")
	if len(parts) != 2 || len(parts[0]) == 0 {
		return "••••@••••"
	}
	name := parts[0]
	if len(name) <= 2 {
		return name[:1] + "•••@" + parts[1]
	}
	return name[:2] + "•••@" + parts[1]
}

func (s *Store) List(filter ListFilter) []Person {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []Person
	q := strings.ToLower(strings.TrimSpace(filter.Query))
	filterStanding := strings.ToLower(strings.TrimSpace(filter.Standing))

	for _, id := range s.order {
		p := s.people[id]

		if q != "" {
			nameMatch := strings.Contains(strings.ToLower(p.FullName), q)
			phoneMatch := strings.Contains(p.Phone, q)
			householdMatch := strings.Contains(strings.ToLower(p.HouseholdName), q)
			if !nameMatch && !phoneMatch && !householdMatch {
				continue
			}
		}

		if filterStanding != "" && filterStanding != "all" {
			currentStanding := strings.ToLower(string(p.Standing))
			if !strings.Contains(currentStanding, filterStanding) {
				continue
			}
		}

		if filter.CareGroup != "" && filter.CareGroup != "all" {
			if !strings.EqualFold(p.CareGroupName, filter.CareGroup) {
				continue
			}
		}

		// Apply privacy masking if demanded (AD-3, BR-4)
		if filter.Mask && !p.PrivacyOptIn {
			if p.Phone != "" && p.Phone != "—" {
				p.Phone = MaskPhone(p.Phone)
			}
			if p.SecondPhone != "" {
				p.SecondPhone = MaskPhone(p.SecondPhone)
			}
			if p.Email != "" {
				p.Email = MaskEmail(p.Email)
			}
		}

		result = append(result, p)
	}

	return result
}

func (s *Store) Get(id string, mask bool) (*Person, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	p, exists := s.people[id]
	if !exists {
		return nil, errors.New("person not found")
	}

	if mask && !p.PrivacyOptIn {
		if p.Phone != "" && p.Phone != "—" {
			p.Phone = MaskPhone(p.Phone)
		}
		if p.SecondPhone != "" && p.SecondPhone != "—" {
			p.SecondPhone = MaskPhone(p.SecondPhone)
		}
		if p.Email != "" {
			p.Email = MaskEmail(p.Email)
		}
	}

	return &p, nil
}

func (s *Store) Create(req CreatePersonRequest) (*Person, error) {
	if strings.TrimSpace(req.FullName) == "" {
		return nil, errors.New("full name is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	s.seq++
	id := fmt.Sprintf("per-%03d", s.seq)

	standing := req.Standing
	if standing == "" {
		standing = StandingMember
	}

	lifecycle := req.Lifecycle
	if lifecycle == "" {
		lifecycle = LifecycleActive
	}

	normPhone := strings.TrimSpace(req.Phone)
	if normPhone != "" && normPhone != "—" {
		normPhone = NormalizePhone(normPhone)
	}

	normSecondPhone := strings.TrimSpace(req.SecondPhone)
	if normSecondPhone != "" && normSecondPhone != "—" {
		normSecondPhone = NormalizePhone(normSecondPhone)
	}

	p := Person{
		ID:              id,
		FullName:        strings.TrimSpace(req.FullName),
		Phone:           normPhone,
		SecondPhone:     normSecondPhone,
		Email:           strings.TrimSpace(req.Email),
		DateOfBirth:     strings.TrimSpace(req.DateOfBirth),
		WithUsSince:     strings.TrimSpace(req.WithUsSince),
		Standing:        standing,
		Lifecycle:       lifecycle,
		HouseholdID:     strings.TrimSpace(req.HouseholdID),
		HouseholdName:   strings.TrimSpace(req.HouseholdName),
		RoleInHousehold: req.RoleInHousehold,
		CareGroupID:     strings.TrimSpace(req.CareGroupID),
		CareGroupName:   strings.TrimSpace(req.CareGroupName),
		Notes:           strings.TrimSpace(req.Notes),
		PrivacyOptIn:    req.PrivacyOptIn,
		CreatedAt:       time.Now().UTC(),
		UpdatedAt:       time.Now().UTC(),
	}

	s.people[id] = p
	s.order = append(s.order, id)
	return &p, nil
}

func (s *Store) Update(id string, req UpdatePersonRequest) (*Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	p, exists := s.people[id]
	if !exists {
		return nil, errors.New("person not found")
	}

	if req.FullName != nil {
		p.FullName = strings.TrimSpace(*req.FullName)
	}
	if req.Phone != nil {
		v := strings.TrimSpace(*req.Phone)
		if v != "" && v != "—" {
			v = NormalizePhone(v)
		}
		p.Phone = v
	}
	if req.SecondPhone != nil {
		v := strings.TrimSpace(*req.SecondPhone)
		if v != "" && v != "—" {
			v = NormalizePhone(v)
		}
		p.SecondPhone = v
	}
	if req.Email != nil {
		p.Email = strings.TrimSpace(*req.Email)
	}
	if req.DateOfBirth != nil {
		p.DateOfBirth = strings.TrimSpace(*req.DateOfBirth)
	}
	if req.WithUsSince != nil {
		p.WithUsSince = strings.TrimSpace(*req.WithUsSince)
	}
	if req.Standing != nil {
		p.Standing = *req.Standing
	}
	if req.Lifecycle != nil {
		p.Lifecycle = *req.Lifecycle
	}
	if req.HouseholdID != nil {
		p.HouseholdID = strings.TrimSpace(*req.HouseholdID)
	}
	if req.HouseholdName != nil {
		p.HouseholdName = strings.TrimSpace(*req.HouseholdName)
	}
	if req.RoleInHousehold != nil {
		p.RoleInHousehold = *req.RoleInHousehold
	}
	if req.CareGroupID != nil {
		p.CareGroupID = strings.TrimSpace(*req.CareGroupID)
	}
	if req.CareGroupName != nil {
		p.CareGroupName = strings.TrimSpace(*req.CareGroupName)
	}
	if req.Notes != nil {
		p.Notes = strings.TrimSpace(*req.Notes)
	}
	if req.PrivacyOptIn != nil {
		p.PrivacyOptIn = *req.PrivacyOptIn
	}
	p.UpdatedAt = time.Now().UTC()

	s.people[id] = p
	return &p, nil
}

func (s *Store) Count() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.people)
}

func (s *Store) SeedInitialDemoData() {
	s.mu.Lock()
	defer s.mu.Unlock()

	demo := []Person{
		{
			ID:              "per-001",
			FullName:        "Budi Halim",
			Phone:           "0812-1122-3344",
			DateOfBirth:     "12 May 1978",
			Age:             48,
			Standing:        StandingRegistered,
			Lifecycle:       LifecycleActive,
			HouseholdID:     "hh-001",
			HouseholdName:   "Halim household",
			RoleInHousehold: RoleHead,
			CareGroupName:   "Anugerah",
			PrivacyOptIn:    false,
		},
		{
			ID:              "per-002",
			FullName:        "Melisa Halim",
			Phone:           "0813-9080-1122",
			DateOfBirth:     "8 August 1981",
			Age:             45,
			Standing:        StandingRegistered,
			Lifecycle:       LifecycleActive,
			HouseholdID:     "hh-001",
			HouseholdName:   "Halim household",
			RoleInHousehold: RoleSpouse,
			CareGroupName:   "Anugerah",
			PrivacyOptIn:    false,
		},
		{
			ID:              "per-003",
			FullName:        "Gavriel Halim",
			Phone:           "—",
			DateOfBirth:     "22 October 2012",
			Age:             14,
			Standing:        StandingMember,
			Lifecycle:       LifecycleActive,
			HouseholdID:     "hh-001",
			HouseholdName:   "Halim household",
			RoleInHousehold: RoleChild,
			CareGroupName:   "Anugerah",
			PrivacyOptIn:    true,
		},
		{
			ID:              "per-004",
			FullName:        "Andreas Wibowo",
			Phone:           "0811-2200-3311",
			DateOfBirth:     "3 March 1982",
			Age:             44,
			Standing:        StandingMember,
			Lifecycle:       LifecycleActive,
			HouseholdID:     "hh-002",
			HouseholdName:   "Wibowo household",
			RoleInHousehold: RoleHead,
			CareGroupName:   "Anugerah",
			PrivacyOptIn:    false,
		},
	}

	for _, p := range demo {
		p.CreatedAt = time.Now().UTC()
		p.UpdatedAt = time.Now().UTC()
		s.people[p.ID] = p
		s.order = append(s.order, p.ID)
	}
}
