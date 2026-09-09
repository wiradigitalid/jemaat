package portal

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"
)

var (
	ErrGrantNotFound        = errors.New("access grant not found")
	ErrMinTwoAdminsEnforced = errors.New("cannot revoke administrator: church must have at least two administrators at all times")
	ErrInvalidRole          = errors.New("invalid access role: must be Administrator, Church office, or Care group leader")
)

type AccessRole string

const (
	RoleAdministrator   AccessRole = "Administrator"
	RoleChurchOffice    AccessRole = "Church office"
	RoleCareGroupLeader AccessRole = "Care group leader"
)

type AccessRoleGrant struct {
	ID        string     `json:"id"`
	PersonID  string     `json:"person_id"`
	FullName  string     `json:"full_name"`
	Initials  string     `json:"initials"`
	Standing  string     `json:"standing"`
	Role      AccessRole `json:"role"`
	RoleLabel string     `json:"role_label"`
	GivenBy   string     `json:"given_by"`
	GivenDate string     `json:"given_date"`
	LastUsed  string     `json:"last_used"`
	CreatedAt time.Time  `json:"created_at"`
}

type GrantRoleRequest struct {
	PersonID  string     `json:"person_id"`
	FullName  string     `json:"full_name"`
	Standing  string     `json:"standing"`
	Role      AccessRole `json:"role"`
	RoleLabel string     `json:"role_label,omitempty"`
}

type RoleStore struct {
	mu     sync.RWMutex
	grants map[string]AccessRoleGrant
	order  []string
	seq    int
}

func NewRoleStore() *RoleStore {
	rs := &RoleStore{
		grants: make(map[string]AccessRoleGrant),
		order:  make([]string, 0),
		seq:    100,
	}

	rs.seedDemoGrants()
	return rs
}

func (rs *RoleStore) seedDemoGrants() {
	now := time.Now().UTC()

	// Seed rows matching WebRoles.dc.html
	demo := []AccessRoleGrant{
		{
			ID:        "rol-01",
			PersonID:  "per-ls",
			FullName:  "Lidya Suryani",
			Initials:  "LS",
			Standing:  "Registered Member",
			Role:      RoleChurchOffice,
			RoleLabel: "Church office",
			GivenBy:   "Andreas Wibowo",
			GivenDate: "Feb 2021",
			LastUsed:  "used yesterday",
			CreatedAt: now.Add(-365 * 24 * time.Hour),
		},
		{
			ID:        "rol-02",
			PersonID:  "per-aw",
			FullName:  "Andreas Wibowo",
			Initials:  "AW",
			Standing:  "Community",
			Role:      RoleAdministrator,
			RoleLabel: "Administrator",
			GivenBy:   "The first account",
			GivenDate: "Jan 2021",
			LastUsed:  "used 3 days ago",
			CreatedAt: now.Add(-400 * 24 * time.Hour),
		},
		{
			ID:        "rol-03",
			PersonID:  "per-bh",
			FullName:  "Budi Halim",
			Initials:  "BH",
			Standing:  "Registered Member",
			Role:      RoleCareGroupLeader,
			RoleLabel: "Leads Anugerah",
			GivenBy:   "Lidya Suryani",
			GivenDate: "Feb 2021",
			LastUsed:  "used yesterday",
			CreatedAt: now.Add(-300 * 24 * time.Hour),
		},
		{
			ID:        "rol-04",
			PersonID:  "per-rs",
			FullName:  "Ruth Simanjuntak",
			Initials:  "RS",
			Standing:  "Registered Member",
			Role:      RoleCareGroupLeader,
			RoleLabel: "Leads Damai",
			GivenBy:   "Lidya Suryani",
			GivenDate: "Mar 2023",
			LastUsed:  "used last week",
			CreatedAt: now.Add(-200 * 24 * time.Hour),
		},
		{
			ID:        "rol-05",
			PersonID:  "per-mn",
			FullName:  "Maruli Nainggolan",
			Initials:  "MN",
			Standing:  "Registered Member",
			Role:      RoleCareGroupLeader,
			RoleLabel: "Leads Harapan",
			GivenBy:   "Lidya Suryani",
			GivenDate: "Aug 2024",
			LastUsed:  "never signed in",
			CreatedAt: now.Add(-100 * 24 * time.Hour),
		},
		{
			ID:        "rol-06",
			PersonID:  "per-gs",
			FullName:  "Grace Sutanto",
			Initials:  "GS",
			Standing:  "Guest",
			Role:      RoleCareGroupLeader,
			RoleLabel: "Leads Young Adults",
			GivenBy:   "Lidya Suryani",
			GivenDate: "Jan 2026",
			LastUsed:  "used yesterday",
			CreatedAt: now.Add(-40 * 24 * time.Hour),
		},
		{
			ID:        "rol-07",
			PersonID:  "per-mh",
			FullName:  "Pdt. Marulitua Hutagalung",
			Initials:  "MH",
			Standing:  "Registered Member",
			Role:      RoleAdministrator,
			RoleLabel: "Administrator",
			GivenBy:   "Andreas Wibowo",
			GivenDate: "Feb 2021",
			LastUsed:  "used 5 days ago",
			CreatedAt: now.Add(-350 * 24 * time.Hour),
		},
	}

	for _, g := range demo {
		rs.grants[g.ID] = g
		rs.order = append(rs.order, g.ID)
	}
}

func (rs *RoleStore) List() []AccessRoleGrant {
	rs.mu.RLock()
	defer rs.mu.RUnlock()

	result := make([]AccessRoleGrant, 0, len(rs.order))
	for _, id := range rs.order {
		result = append(result, rs.grants[id])
	}
	return result
}

func (rs *RoleStore) Grant(req GrantRoleRequest, givenBy string) (*AccessRoleGrant, error) {
	if req.PersonID == "" || req.FullName == "" {
		return nil, errors.New("person_id and full_name are required")
	}

	switch req.Role {
	case RoleAdministrator, RoleChurchOffice, RoleCareGroupLeader:
		// valid
	default:
		return nil, ErrInvalidRole
	}

	rs.mu.Lock()
	defer rs.mu.Unlock()

	rs.seq++
	id := fmt.Sprintf("rol-%03d", rs.seq)

	roleLabel := req.RoleLabel
	if roleLabel == "" {
		roleLabel = string(req.Role)
	}

	initials := "—"
	words := strings.Fields(req.FullName)
	if len(words) >= 2 {
		r1 := []rune(words[0])
		r2 := []rune(words[1])
		if len(r1) > 0 && len(r2) > 0 {
			initials = strings.ToUpper(fmt.Sprintf("%c%c", r1[0], r2[0]))
		}
	} else if len(words) == 1 {
		r := []rune(words[0])
		if len(r) > 0 {
			initials = strings.ToUpper(string(r[0]))
		}
	}

	g := AccessRoleGrant{
		ID:        id,
		PersonID:  req.PersonID,
		FullName:  req.FullName,
		Initials:  initials,
		Standing:  req.Standing,
		Role:      req.Role,
		RoleLabel: roleLabel,
		GivenBy:   givenBy,
		GivenDate: time.Now().Format("Jan 2006"),
		LastUsed:  "never signed in",
		CreatedAt: time.Now().UTC(),
	}

	rs.grants[id] = g
	rs.order = append(rs.order, id)
	return &g, nil
}

// Revoke removes an administrative or leadership grant.
// Safety invariant: A church must maintain at least 2 active administrators at all times (SPEC-4-03, WebRoles.dc.html).
func (rs *RoleStore) Revoke(id string) error {
	rs.mu.Lock()
	defer rs.mu.Unlock()

	target, exists := rs.grants[id]
	if !exists {
		return ErrGrantNotFound
	}

	if target.Role == RoleAdministrator {
		adminCount := 0
		for _, g := range rs.grants {
			if g.Role == RoleAdministrator {
				adminCount++
			}
		}
		if adminCount <= 2 {
			return ErrMinTwoAdminsEnforced
		}
	}

	delete(rs.grants, id)

	newOrder := make([]string, 0, len(rs.order)-1)
	for _, gID := range rs.order {
		if gID != id {
			newOrder = append(newOrder, gID)
		}
	}
	rs.order = newOrder

	return nil
}
