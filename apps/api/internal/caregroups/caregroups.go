package caregroups

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"
)

type CareGroupMember struct {
	PersonID   string    `json:"person_id"`
	FullName   string    `json:"full_name"`
	Standing   string    `json:"standing"`
	IsLeader   bool      `json:"is_leader"`
	EnrolledAt time.Time `json:"enrolled_at"`
}

type CareGroup struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	Zone           string            `json:"zone"` // e.g. "Sunter"
	LeaderPersonID string            `json:"leader_person_id,omitempty"`
	LeaderName     string            `json:"leader_name"`
	MeetingDay     string            `json:"meeting_day"` // e.g. "Wednesdays"
	MeetingTime    string            `json:"meeting_time,omitempty"`
	MeetingAddress string            `json:"meeting_address,omitempty"`
	MembersCount   int               `json:"members_count"`
	Members        []CareGroupMember `json:"members,omitempty"`
	CreatedAt      time.Time         `json:"created_at"`
	UpdatedAt      time.Time         `json:"updated_at"`
}

type UnplacedPerson struct {
	PersonID    string    `json:"person_id"`
	FullName    string    `json:"full_name"`
	Initials    string    `json:"initials"`
	Zone        string    `json:"zone"`
	RequestedAt time.Time `json:"requested_at"`
}

type CreateCareGroupRequest struct {
	Name           string `json:"name"`
	Zone           string `json:"zone"`
	LeaderPersonID string `json:"leader_person_id,omitempty"`
	LeaderName     string `json:"leader_name,omitempty"`
	MeetingDay     string `json:"meeting_day,omitempty"`
	MeetingTime    string `json:"meeting_time,omitempty"`
	MeetingAddress string `json:"meeting_address,omitempty"`
}

type EnrollMemberRequest struct {
	PersonID string `json:"person_id"`
	FullName string `json:"full_name,omitempty"`
	Standing string `json:"standing,omitempty"`
	IsLeader bool   `json:"is_leader,omitempty"`
}

type Store struct {
	mu          sync.RWMutex
	groups      map[string]CareGroup
	order       []string
	unplaced    []UnplacedPerson
	seq         int
}

func NewStore() *Store {
	s := &Store{
		groups:   make(map[string]CareGroup),
		order:    make([]string, 0),
		unplaced: make([]UnplacedPerson, 0),
		seq:      100,
	}

	s.seedDemoGroups()
	return s
}

func (s *Store) seedDemoGroups() {
	// Seed demo groups matching AdminGroups.dc.html
	now := time.Now().UTC()

	anugerahMembers := []CareGroupMember{
		{PersonID: "per-bh", FullName: "Budi Hartono", Standing: "Registered Member", IsLeader: true, EnrolledAt: now},
		{PersonID: "per-mt", FullName: "Melisa Tanudjaja", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-ah", FullName: "Andreas Halim", Standing: "Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-ip", FullName: "Intan Prasetyo", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-ga", FullName: "Grace Anjani", Standing: "Guest", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-dk", FullName: "Dedi Kurnia", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-ts", FullName: "Tigor Siahaan", Standing: "Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-sl", FullName: "Samuel Lubis", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-yt", FullName: "Yuni Tarigan", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-rs", FullName: "Riko Simanjuntak", Standing: "Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-mw", FullName: "Maya Wibowo", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-ds", FullName: "David Sitompul", Standing: "Member", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-jt", FullName: "Jessica Tan", Standing: "Community", IsLeader: false, EnrolledAt: now},
		{PersonID: "per-kh", FullName: "Kevin Halim", Standing: "Registered Member", IsLeader: false, EnrolledAt: now},
	}

	demo := []CareGroup{
		{
			ID:             "cg-01",
			Name:           "Anugerah",
			Zone:           "Sunter",
			LeaderPersonID: "per-bh",
			LeaderName:     "Budi Hartono",
			MeetingDay:     "Wednesdays",
			MeetingTime:    "19:30",
			MeetingAddress: "Jl. Danau Sunter Utara Blok F No. 12",
			MembersCount:   14,
			Members:        anugerahMembers,
			CreatedAt:      now,
			UpdatedAt:      now,
		},
		{
			ID:             "cg-02",
			Name:           "Kasih",
			Zone:           "Kelapa Gading",
			LeaderPersonID: "per-mt",
			LeaderName:     "Melisa Tanudjaja",
			MeetingDay:     "Thursdays",
			MeetingTime:    "19:30",
			MeetingAddress: "Jl. Boulevard Barat Blok LC No. 8",
			MembersCount:   12,
			CreatedAt:      now,
			UpdatedAt:      now,
		},
		{
			ID:             "cg-03",
			Name:           "Damai",
			Zone:           "Sunter",
			LeaderPersonID: "per-ms",
			LeaderName:     "Maruli Siregar",
			MeetingDay:     "Fridays",
			MeetingTime:    "19:30",
			MeetingAddress: "Jl. Danau Indah Raya Blok A1",
			MembersCount:   11,
			CreatedAt:      now,
			UpdatedAt:      now,
		},
		{
			ID:             "cg-04",
			Name:           "Setia",
			Zone:           "Pluit",
			LeaderPersonID: "per-ga",
			LeaderName:     "Grace Anjani",
			MeetingDay:     "Thursdays",
			MeetingTime:    "19:00",
			MeetingAddress: "Jl. Pluit Kencana No. 45",
			MembersCount:   13,
			CreatedAt:      now,
			UpdatedAt:      now,
		},
		{
			ID:             "cg-05",
			Name:           "Harapan",
			Zone:           "Kemayoran",
			LeaderPersonID: "",
			LeaderName:     "No leader yet",
			MeetingDay:     "Wednesdays",
			MeetingTime:    "19:30",
			MeetingAddress: "Apartemen Mediterania Kemayoran",
			MembersCount:   11,
			CreatedAt:      now,
			UpdatedAt:      now,
		},
	}

	for _, g := range demo {
		s.groups[g.ID] = g
		s.order = append(s.order, g.ID)
	}

	// Seed unplaced queue matching AdminGroups.dc.html
	s.unplaced = []UnplacedPerson{
		{PersonID: "per-rw", FullName: "Rian Wijaya", Initials: "RW", Zone: "Sunter", RequestedAt: now},
		{PersonID: "per-sr", FullName: "Sinta Rahmat", Initials: "SR", Zone: "Sunter", RequestedAt: now},
		{PersonID: "per-ft", FullName: "Fandi Tobing", Initials: "FT", Zone: "Pluit", RequestedAt: now},
		{PersonID: "per-hl", FullName: "Hendra Lie", Initials: "HL", Zone: "Kemayoran", RequestedAt: now},
		{PersonID: "per-nk", FullName: "Nita Kusuma", Initials: "NK", Zone: "Kelapa Gading", RequestedAt: now},
	}
}

func (s *Store) List() []CareGroup {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]CareGroup, 0, len(s.order))
	for _, id := range s.order {
		result = append(result, s.groups[id])
	}
	return result
}

func (s *Store) Get(id string) (*CareGroup, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	g, exists := s.groups[id]
	if !exists {
		return nil, errors.New("care group not found")
	}
	return &g, nil
}

func (s *Store) Create(req CreateCareGroupRequest) (*CareGroup, error) {
	if req.Name == "" || req.Zone == "" {
		return nil, errors.New("name and zone are required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	// Prevent duplicate care group name within the same zone (UC-11)
	for _, existing := range s.groups {
		if strings.EqualFold(existing.Name, req.Name) && strings.EqualFold(existing.Zone, req.Zone) {
			return nil, errors.New("a care group with this name already exists in this zone")
		}
	}

	s.seq++
	id := fmt.Sprintf("cg-%03d", s.seq)

	leaderName := req.LeaderName
	if leaderName == "" {
		leaderName = "No leader yet"
	}

	now := time.Now().UTC()
	g := CareGroup{
		ID:             id,
		Name:           req.Name,
		Zone:           req.Zone,
		LeaderPersonID: req.LeaderPersonID,
		LeaderName:     leaderName,
		MeetingDay:     req.MeetingDay,
		MeetingTime:    req.MeetingTime,
		MeetingAddress: req.MeetingAddress,
		MembersCount:   0,
		Members:        make([]CareGroupMember, 0),
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	s.groups[id] = g
	s.order = append(s.order, id)
	return &g, nil
}

func (s *Store) EnrollMember(groupID string, req EnrollMemberRequest) (*CareGroup, error) {
	if req.PersonID == "" {
		return nil, errors.New("person_id is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	g, exists := s.groups[groupID]
	if !exists {
		return nil, errors.New("care group not found")
	}

	// Check if already in this group
	for _, m := range g.Members {
		if m.PersonID == req.PersonID {
			return &g, nil
		}
	}

	standing := req.Standing
	if standing == "" {
		standing = "Member"
	}

	newMember := CareGroupMember{
		PersonID:   req.PersonID,
		FullName:   req.FullName,
		Standing:   standing,
		IsLeader:   req.IsLeader,
		EnrolledAt: time.Now().UTC(),
	}

	g.Members = append(g.Members, newMember)
	g.MembersCount = len(g.Members)
	if req.IsLeader {
		g.LeaderPersonID = req.PersonID
		g.LeaderName = req.FullName
	}
	g.UpdatedAt = time.Now().UTC()
	s.groups[groupID] = g

	// Remove from unplaced queue if present
	newUnplaced := make([]UnplacedPerson, 0, len(s.unplaced))
	for _, u := range s.unplaced {
		if u.PersonID != req.PersonID {
			newUnplaced = append(newUnplaced, u)
		}
	}
	s.unplaced = newUnplaced

	return &g, nil
}

func (s *Store) RemoveMember(groupID, personID string) (*CareGroup, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	g, exists := s.groups[groupID]
	if !exists {
		return nil, errors.New("care group not found")
	}

	newMembers := make([]CareGroupMember, 0, len(g.Members))
	found := false
	for _, m := range g.Members {
		if m.PersonID == personID {
			found = true
			if m.IsLeader {
				g.LeaderPersonID = ""
				g.LeaderName = "No leader yet"
			}
			continue
		}
		newMembers = append(newMembers, m)
	}

	if !found {
		return nil, errors.New("member not found in this care group")
	}

	g.Members = newMembers
	g.MembersCount = len(newMembers)
	g.UpdatedAt = time.Now().UTC()
	s.groups[groupID] = g

	return &g, nil
}

func (s *Store) ListUnplaced() []UnplacedPerson {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]UnplacedPerson, len(s.unplaced))
	copy(result, s.unplaced)
	return result
}
