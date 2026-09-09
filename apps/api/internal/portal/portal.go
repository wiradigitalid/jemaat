package portal

import (
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"strings"
	"sync"
	"time"
)

type ChurchProfile struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Address            string    `json:"address"`
	City               string    `json:"city"`
	TimeZone           string    `json:"time_zone"`
	WorshipDay         string    `json:"worship_day"`
	Code               string    `json:"code"`
	DeepLink           string    `json:"deep_link"`
	Phone              string    `json:"phone"`
	Email              string    `json:"email"`
	DevicesFollowing   int       `json:"devices_following"`
	MembersSignedIn    int       `json:"members_signed_in"`
	ApplicantsWaiting  int       `json:"applicants_waiting"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type UpdateProfileRequest struct {
	Name       *string `json:"name,omitempty"`
	Address    *string `json:"address,omitempty"`
	City       *string `json:"city,omitempty"`
	TimeZone   *string `json:"time_zone,omitempty"`
	WorshipDay *string `json:"worship_day,omitempty"`
	Phone      *string `json:"phone,omitempty"`
	Email      *string `json:"email,omitempty"`
}

type Store struct {
	mu      sync.RWMutex
	profile ChurchProfile
}

func NewStore() *Store {
	now := time.Now().UTC()
	initialCode := "GRC-BDG"
	s := &Store{
		profile: ChurchProfile{
			ID:                "chu-001",
			Name:              "Immanuel Church, Sunter",
			Address:           "Jl. Danau Sunter Utara Blok A No. 4, Jakarta Utara",
			City:              "Jakarta Utara",
			TimeZone:          "WIB · GMT+7",
			WorshipDay:        "Saturday",
			Code:              initialCode,
			DeepLink:          fmt.Sprintf("jemaat://church?code=%s", initialCode),
			Phone:             "+62 812-3456-7890",
			Email:             "office@immanuel-sunter.church",
			DevicesFollowing:  312,
			MembersSignedIn:   48,
			ApplicantsWaiting: 5,
			UpdatedAt:         now,
		},
	}
	return s
}

// LookupCode performs case-insensitive, normalized 6-digit church code resolution (UC-16, AD-6, BR-POR-2).
func (s *Store) LookupCode(inputCode string) (*ChurchProfile, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	normInput := normalizeCode(inputCode)
	normCurrent := normalizeCode(s.profile.Code)

	if normInput == "" || normInput != normCurrent {
		return nil, errors.New("invalid or expired church code")
	}

	return &s.profile, nil
}

func normalizeCode(c string) string {
	c = strings.ReplaceAll(c, "-", "")
	c = strings.ReplaceAll(c, " ", "")
	return strings.ToUpper(strings.TrimSpace(c))
}

func (s *Store) GetProfile() ChurchProfile {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.profile
}

func (s *Store) UpdateProfile(req UpdateProfileRequest) (*ChurchProfile, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if req.Name != nil && *req.Name != "" {
		s.profile.Name = *req.Name
	}
	if req.Address != nil {
		s.profile.Address = *req.Address
	}
	if req.City != nil {
		s.profile.City = *req.City
	}
	if req.TimeZone != nil {
		s.profile.TimeZone = *req.TimeZone
	}
	if req.WorshipDay != nil {
		s.profile.WorshipDay = *req.WorshipDay
	}
	if req.Phone != nil {
		s.profile.Phone = *req.Phone
	}
	if req.Email != nil {
		s.profile.Email = *req.Email
	}

	s.profile.UpdatedAt = time.Now().UTC()
	return &s.profile, nil
}

// RegenerateCode generates a new 6-digit alphanumeric code (BR-POR-2, AD-6).
func (s *Store) RegenerateCode() (*ChurchProfile, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	b := make([]byte, 6)
	for i := range b {
		idx, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return nil, errors.New("failed to generate random code")
		}
		b[i] = charset[idx.Int64()]
	}

	newCode := fmt.Sprintf("%s-%s", string(b[:3]), string(b[3:]))
	s.profile.Code = newCode
	s.profile.DeepLink = fmt.Sprintf("jemaat://church?code=%s", newCode)
	s.profile.UpdatedAt = time.Now().UTC()

	return &s.profile, nil
}

// GenerateQRSVG returns an SVG QR representation for church welcome posters.
func (s *Store) GenerateQRSVG() string {
	s.mu.RLock()
	code := s.profile.Code
	s.mu.RUnlock()

	return fmt.Sprintf(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180"><rect width="180" height="180" fill="#FFFFFF"/><rect x="18" y="18" width="40" height="40" fill="#1C1917"/><rect x="26" y="26" width="24" height="24" fill="#FFFFFF"/><rect x="32" y="32" width="12" height="12" fill="#1C1917"/><rect x="122" y="18" width="40" height="40" fill="#1C1917"/><rect x="130" y="26" width="24" height="24" fill="#FFFFFF"/><rect x="136" y="32" width="12" height="12" fill="#1C1917"/><rect x="18" y="122" width="40" height="40" fill="#1C1917"/><rect x="26" y="130" width="24" height="24" fill="#FFFFFF"/><rect x="32" y="136" width="12" height="12" fill="#1C1917"/><text x="90" y="95" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#1C1917">%s</text></svg>`, code)
}
