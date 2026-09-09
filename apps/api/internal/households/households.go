package households

import (
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"

	"jemaat/apps/api/internal/people"
)

type ResidenceCategory string

const (
	CategoryFamily        ResidenceCategory = "family"
	CategoryAlsoLivesHere ResidenceCategory = "also_lives_here"
	CategoryMovedOut      ResidenceCategory = "moved_out"
)

type HouseholdMember struct {
	PersonID       string            `json:"person_id"`
	FullName       string            `json:"full_name"`
	Standing       string            `json:"standing"`
	Age            int               `json:"age"`
	Relationship   string            `json:"relationship"` // Head of household, Wife, Son, Household helper, etc.
	Category       ResidenceCategory `json:"category"`
	Phone          string            `json:"phone,omitempty"`
	OwnAddressNote string            `json:"own_address_note,omitempty"`
	MovedOutNote   string            `json:"moved_out_note,omitempty"`
	NewHousehold   string            `json:"new_household,omitempty"`
	IsHead         bool              `json:"is_head"`
}

type Household struct {
	ID                  string            `json:"id"`
	Name                string            `json:"name"`
	Address             string            `json:"address"`
	PrimaryContactName  string            `json:"primary_contact_name"`
	PrimaryContactPhone string            `json:"primary_contact_phone"`
	HeadPersonID        string            `json:"head_person_id"`
	Members             []HouseholdMember `json:"members"`
	AlsoAtAddress       []string          `json:"also_at_address,omitempty"`
	CreatedAt           time.Time         `json:"created_at"`
	UpdatedAt           time.Time         `json:"updated_at"`
}

type CreateHouseholdRequest struct {
	Name         string `json:"name"`
	Address      string `json:"address"`
	HeadPersonID string `json:"head_person_id,omitempty"`
}

type UpdateAddressRequest struct {
	Address string `json:"address"`
}

type SetHeadRequest struct {
	PersonID string `json:"person_id"`
}

type LinkMemberRequest struct {
	PersonID       string            `json:"person_id"`
	FullName       string            `json:"full_name"`
	Standing       string            `json:"standing,omitempty"`
	Age            int               `json:"age,omitempty"`
	Relationship   string            `json:"relationship"`
	Category       ResidenceCategory `json:"category"`
	Phone          string            `json:"phone,omitempty"`
	OwnAddressNote string            `json:"own_address_note,omitempty"`
	MovedOutNote   string            `json:"moved_out_note,omitempty"`
	NewHousehold   string            `json:"new_household,omitempty"`
}

type Store struct {
	mu         sync.RWMutex
	households map[string]Household
	order      []string
	seq        int
	peopleSvc  *people.Store
}

func NewStore(peopleSvc *people.Store) *Store {
	s := &Store{
		households: make(map[string]Household),
		order:      make([]string, 0),
		seq:        10,
		peopleSvc:  peopleSvc,
	}

	// Seed demo household matching .work/design/AdminHousehold.dc.html
	s.seedDemo()
	return s
}

func (s *Store) seedDemo() {
	hh := Household{
		ID:                  "hh-001",
		Name:                "Keluarga Prasetyo",
		Address:             "Sunter Agung Q4/12, Jakarta Utara",
		PrimaryContactName:  "Bambang Prasetyo",
		PrimaryContactPhone: "+62 812-3344-9900",
		HeadPersonID:        "per-bp",
		AlsoAtAddress:       []string{"Keluarga Halim (3 people · Andreas H. is head)"},
		CreatedAt:           time.Now().UTC(),
		UpdatedAt:           time.Now().UTC(),
		Members: []HouseholdMember{
			{
				PersonID:     "per-bp",
				FullName:     "Bambang Prasetyo",
				Standing:     "Registered Member",
				Age:          62,
				Relationship: "Head of household",
				Category:     CategoryFamily,
				Phone:        "+62 812-3344-9900",
				IsHead:       true,
			},
			{
				PersonID:     "per-sp",
				FullName:     "Sri Prasetyo",
				Standing:     "Registered Member",
				Age:          59,
				Relationship: "Wife",
				Category:     CategoryFamily,
				IsHead:       false,
			},
			{
				PersonID:     "per-yp",
				FullName:     "Yosafat Prasetyo",
				Standing:     "Member",
				Age:          46,
				Relationship: "Son",
				Category:     CategoryFamily,
				IsHead:       false,
			},
			{
				PersonID:     "per-ip",
				FullName:     "Intan Prasetyo",
				Standing:     "Registered Member",
				Age:          44,
				Relationship: "Daughter-in-law",
				Category:     CategoryFamily,
				IsHead:       false,
			},
			{
				PersonID:     "per-rp",
				FullName:     "Rafael Prasetyo",
				Standing:     "Guest",
				Age:          11,
				Relationship: "Grandchild",
				Category:     CategoryFamily,
				IsHead:       false,
			},
			{
				PersonID:       "per-kp",
				FullName:       "Kevin Prasetyo",
				Standing:       "Member",
				Age:            20,
				Relationship:   "Grandchild",
				Category:       CategoryFamily,
				OwnAddressNote: "Own address",
				IsHead:         false,
			},
			{
				PersonID:     "per-nu",
				FullName:     "Nuraini",
				Standing:     "Guest",
				Age:          41,
				Relationship: "Household helper",
				Category:     CategoryAlsoLivesHere,
				IsHead:       false,
			},
			{
				PersonID:     "per-pt",
				FullName:     "Petrus Tanjung",
				Standing:     "Member",
				Age:          24,
				Relationship: "Boards here",
				Category:     CategoryAlsoLivesHere,
				IsHead:       false,
			},
			{
				PersonID:     "per-mt",
				FullName:     "Melisa Tanudjaja",
				Standing:     "Registered Member",
				Age:          32,
				Relationship: "Daughter",
				Category:     CategoryMovedOut,
				MovedOutNote: "married January 2024",
				NewHousehold: "Keluarga Tanudjaja",
				IsHead:       false,
			},
		},
	}

	s.households[hh.ID] = hh
	s.order = append(s.order, hh.ID)
}

func (s *Store) List() []Household {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []Household
	for _, id := range s.order {
		result = append(result, s.households[id])
	}
	return result
}

func (s *Store) Get(id string) (*Household, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	hh, exists := s.households[id]
	if !exists {
		return nil, errors.New("household not found")
	}
	return &hh, nil
}

func (s *Store) Create(req CreateHouseholdRequest) (*Household, error) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		return nil, errors.New("household name is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	s.seq++
	id := fmt.Sprintf("hh-%03d", s.seq)

	hh := Household{
		ID:           id,
		Name:         name,
		Address:      strings.TrimSpace(req.Address),
		HeadPersonID: req.HeadPersonID,
		Members:      make([]HouseholdMember, 0),
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}

	s.households[id] = hh
	s.order = append(s.order, id)
	return &hh, nil
}

// UpdateAddress updates household address and synchronizes to active family members (BR-MEM-2)
func (s *Store) UpdateAddress(id, newAddress string) (*Household, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	hh, exists := s.households[id]
	if !exists {
		return nil, errors.New("household not found")
	}

	trimmed := strings.TrimSpace(newAddress)
	hh.Address = trimmed
	hh.UpdatedAt = time.Now().UTC()
	s.households[id] = hh

	// Synchronize address in people store for members (BR-MEM-2)
	if s.peopleSvc != nil {
		for _, m := range hh.Members {
			if m.Category == CategoryFamily || m.Category == CategoryAlsoLivesHere {
				_, _ = s.peopleSvc.Update(m.PersonID, people.UpdatePersonRequest{
					HouseholdName: &hh.Name,
				})
			}
		}
	}

	return &hh, nil
}

// SetHead designates a single person as Head of Household, ensuring BR-1 (single head)
func (s *Store) SetHead(id, personID string) (*Household, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	hh, exists := s.households[id]
	if !exists {
		return nil, errors.New("household not found")
	}

	found := false
	for i := range hh.Members {
		if hh.Members[i].PersonID == personID {
			found = true
			hh.Members[i].IsHead = true
			hh.Members[i].Relationship = "Head of household"
			hh.HeadPersonID = personID
			hh.PrimaryContactName = hh.Members[i].FullName
			if hh.Members[i].Phone != "" {
				hh.PrimaryContactPhone = hh.Members[i].Phone
			}
		} else if hh.Members[i].IsHead {
			// Demote previous head to ensure strictly one head of household (BR-1)
			hh.Members[i].IsHead = false
			if hh.Members[i].Relationship == "Head of household" {
				hh.Members[i].Relationship = "Family Member"
			}
		}
	}

	if !found {
		return nil, errors.New("designated person is not a member of this household")
	}

	hh.UpdatedAt = time.Now().UTC()
	s.households[id] = hh
	return &hh, nil
}

// LinkMember adds or updates a member in this household
func (s *Store) LinkMember(id string, req LinkMemberRequest) (*Household, error) {
	if strings.TrimSpace(req.FullName) == "" {
		return nil, errors.New("member full name is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	hh, exists := s.households[id]
	if !exists {
		return nil, errors.New("household not found")
	}

	category := req.Category
	if category == "" {
		category = CategoryFamily
	}

	rel := strings.TrimSpace(req.Relationship)
	if rel == "" {
		rel = "Family Member"
	}

	isHead := strings.EqualFold(rel, "Head") || strings.EqualFold(rel, "Head of household")
	if isHead {
		// Enforce single head rule (BR-1)
		for i := range hh.Members {
			if hh.Members[i].IsHead {
				hh.Members[i].IsHead = false
				if hh.Members[i].Relationship == "Head of household" {
					hh.Members[i].Relationship = "Family Member"
				}
			}
		}
		hh.HeadPersonID = req.PersonID
		hh.PrimaryContactName = req.FullName
		if req.Phone != "" {
			hh.PrimaryContactPhone = req.Phone
		}
	}

	member := HouseholdMember{
		PersonID:       req.PersonID,
		FullName:       req.FullName,
		Standing:       req.Standing,
		Age:            req.Age,
		Relationship:   rel,
		Category:       category,
		Phone:          req.Phone,
		OwnAddressNote: req.OwnAddressNote,
		MovedOutNote:   req.MovedOutNote,
		NewHousehold:   req.NewHousehold,
		IsHead:         isHead,
	}

	hh.Members = append(hh.Members, member)
	hh.UpdatedAt = time.Now().UTC()
	s.households[id] = hh
	return &hh, nil
}

// UnlinkMember removes a person from this household without deleting the person record (BR-MEM-2)
func (s *Store) UnlinkMember(id, personID string) (*Household, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	hh, exists := s.households[id]
	if !exists {
		return nil, errors.New("household not found")
	}

	foundIndex := -1
	for i, m := range hh.Members {
		if m.PersonID == personID {
			foundIndex = i
			break
		}
	}

	if foundIndex == -1 {
		return nil, errors.New("member not found in household")
	}

	hh.Members = append(hh.Members[:foundIndex], hh.Members[foundIndex+1:]...)
	hh.UpdatedAt = time.Now().UTC()
	s.households[id] = hh

	// Clear household association on the person record without deleting the person (BR-MEM-2)
	if s.peopleSvc != nil {
		emptyName := ""
		emptyID := ""
		_, _ = s.peopleSvc.Update(personID, people.UpdatePersonRequest{
			HouseholdName: &emptyName,
			HouseholdID:   &emptyID,
		})
	}

	return &hh, nil
}
