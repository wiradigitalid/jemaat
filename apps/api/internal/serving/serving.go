package serving

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"
)

type ServingRole struct {
	ID               string   `json:"id"`
	TeamID           string   `json:"team_id"`
	Name             string   `json:"name"`
	RequiredCount    int      `json:"required_count"`
	InterestedCount  int      `json:"interested_count"`
	MinQualification string   `json:"min_qualification,omitempty"`
	Volunteers       []string `json:"volunteers,omitempty"` // names of volunteers
}

type MinistryTeam struct {
	ID              string        `json:"id"`
	Name            string        `json:"name"`
	LeaderPersonID  string        `json:"leader_person_id,omitempty"`
	LeaderName      string        `json:"leader_name,omitempty"`
	RolesCount      int           `json:"roles_count"`
	InterestedCount int           `json:"interested_count"`
	Roles           []ServingRole `json:"roles"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
}

type CreateTeamRequest struct {
	Name           string `json:"name"`
	LeaderPersonID string `json:"leader_person_id,omitempty"`
	LeaderName     string `json:"leader_name,omitempty"`
}

type CreateRoleRequest struct {
	Name             string `json:"name"`
	RequiredCount    int    `json:"required_count"`
	MinQualification string `json:"min_qualification,omitempty"`
}

type Store struct {
	mu    sync.RWMutex
	teams map[string]MinistryTeam
	order []string
	seq   int
}

func NewStore() *Store {
	s := &Store{
		teams: make(map[string]MinistryTeam),
		order: make([]string, 0),
		seq:   10,
	}

	s.seedDemo()
	return s
}

func (s *Store) seedDemo() {
	musicRoles := []ServingRole{
		{ID: "role-101", TeamID: "team-01", Name: "Worship Leader", RequiredCount: 1, InterestedCount: 6, Volunteers: []string{"Budi Halim", "Andreas W."}},
		{ID: "role-102", TeamID: "team-01", Name: "Acoustic Guitar", RequiredCount: 1, InterestedCount: 9, Volunteers: []string{"Yosafat P."}},
		{ID: "role-103", TeamID: "team-01", Name: "Keyboard / Piano", RequiredCount: 1, InterestedCount: 8, Volunteers: []string{"Melisa H."}},
		{ID: "role-104", TeamID: "team-01", Name: "Bass Guitar", RequiredCount: 1, InterestedCount: 5, Volunteers: []string{"Petrus T."}},
		{ID: "role-105", TeamID: "team-01", Name: "Drums", RequiredCount: 1, InterestedCount: 7, Volunteers: []string{"Kevin P."}},
		{ID: "role-106", TeamID: "team-01", Name: "Vocalist / Backing", RequiredCount: 2, InterestedCount: 14, Volunteers: []string{"Sri P.", "Intan P."}},
	}

	multimediaRoles := []ServingRole{
		{ID: "role-201", TeamID: "team-02", Name: "Sound Engineer (FOH)", RequiredCount: 1, InterestedCount: 4},
		{ID: "role-202", TeamID: "team-02", Name: "Presentation Slides", RequiredCount: 1, InterestedCount: 6},
		{ID: "role-203", TeamID: "team-02", Name: "Live Streaming Switcher", RequiredCount: 1, InterestedCount: 3},
		{ID: "role-204", TeamID: "team-02", Name: "Camera Operator 1", RequiredCount: 1, InterestedCount: 5},
		{ID: "role-205", TeamID: "team-02", Name: "Stage Lighting", RequiredCount: 1, InterestedCount: 3},
	}

	teams := []MinistryTeam{
		{
			ID:              "team-01",
			Name:            "Music",
			LeaderName:      "Budi Halim",
			RolesCount:      len(musicRoles),
			InterestedCount: 49,
			Roles:           musicRoles,
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		},
		{
			ID:              "team-02",
			Name:            "Multimedia",
			LeaderName:      "Kevin Prasetyo",
			RolesCount:      len(multimediaRoles),
			InterestedCount: 21,
			Roles:           multimediaRoles,
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		},
		{
			ID:              "team-03",
			Name:            "Prayer",
			RolesCount:      2,
			InterestedCount: 12,
			Roles:           []ServingRole{{ID: "role-301", TeamID: "team-03", Name: "Intercessor", RequiredCount: 4, InterestedCount: 12}},
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		},
		{
			ID:              "team-04",
			Name:            "Teaching",
			RolesCount:      4,
			InterestedCount: 15,
			Roles:           []ServingRole{{ID: "role-401", TeamID: "team-04", Name: "Sunday School Teacher", RequiredCount: 3, InterestedCount: 15}},
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		},
		{
			ID:              "team-05",
			Name:            "Visitation",
			RolesCount:      3,
			InterestedCount: 8,
			Roles:           []ServingRole{{ID: "role-501", TeamID: "team-05", Name: "Pastoral Visitor", RequiredCount: 2, InterestedCount: 8}},
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		},
		{
			ID:              "team-06",
			Name:            "Hospitality",
			RolesCount:      4,
			InterestedCount: 28,
			Roles:           []ServingRole{{ID: "role-601", TeamID: "team-06", Name: "Usher & Welcome Desk", RequiredCount: 4, InterestedCount: 28}},
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		},
	}

	for _, t := range teams {
		s.teams[t.ID] = t
		s.order = append(s.order, t.ID)
	}
}

func (s *Store) List() []MinistryTeam {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []MinistryTeam
	for _, id := range s.order {
		result = append(result, s.teams[id])
	}
	return result
}

func (s *Store) Get(id string) (*MinistryTeam, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	t, exists := s.teams[id]
	if !exists {
		return nil, errors.New("ministry team not found")
	}
	return &t, nil
}

func (s *Store) Create(req CreateTeamRequest) (*MinistryTeam, error) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return nil, errors.New("ministry team name is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	s.seq++
	id := fmt.Sprintf("team-%02d", s.seq)

	team := MinistryTeam{
		ID:              id,
		Name:            name,
		LeaderPersonID:  req.LeaderPersonID,
		LeaderName:      req.LeaderName,
		RolesCount:      0,
		InterestedCount: 0,
		Roles:           make([]ServingRole, 0),
		CreatedAt:       time.Now().UTC(),
		UpdatedAt:       time.Now().UTC(),
	}

	s.teams[id] = team
	s.order = append(s.order, id)
	return &team, nil
}

func (s *Store) AddRole(teamID string, req CreateRoleRequest) (*ServingRole, error) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return nil, errors.New("role name is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	team, exists := s.teams[teamID]
	if !exists {
		return nil, errors.New("ministry team not found")
	}

	roleID := fmt.Sprintf("role-%d", time.Now().UnixNano())
	reqCount := req.RequiredCount
	if reqCount <= 0 {
		reqCount = 1
	}

	role := ServingRole{
		ID:               roleID,
		TeamID:           teamID,
		Name:             name,
		RequiredCount:    reqCount,
		MinQualification: req.MinQualification,
		Volunteers:       make([]string, 0),
	}

	team.Roles = append(team.Roles, role)
	team.RolesCount = len(team.Roles)
	team.UpdatedAt = time.Now().UTC()
	s.teams[teamID] = team

	return &role, nil
}

func (s *Store) UpdateTeam(id string, name string) (*MinistryTeam, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	team, exists := s.teams[id]
	if !exists {
		return nil, errors.New("ministry team not found")
	}

	team.Name = strings.TrimSpace(name)
	team.UpdatedAt = time.Now().UTC()
	s.teams[id] = team
	return &team, nil
}
