package people

import (
	"bytes"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strings"
	"time"
)

type ImportRow struct {
	RowNumber     int               `json:"row_number"`
	Raw           map[string]string `json:"raw"`
	FullName      string            `json:"full_name"`
	Phone         string            `json:"phone"`
	Email         string            `json:"email,omitempty"`
	Address       string            `json:"address,omitempty"`
	DateOfBirth   string            `json:"date_of_birth,omitempty"`
	Standing      string            `json:"standing,omitempty"`
	CareGroup     string            `json:"care_group,omitempty"`
	Errors        []string          `json:"errors"`
	IsDuplicate   bool              `json:"is_duplicate"`
	DuplicateOfID string            `json:"duplicate_of_id,omitempty"`
}

type ImportPreviewResponse struct {
	TotalRows  int         `json:"total_rows"`
	ValidRows  int         `json:"valid_rows"`
	ErrorRows  int         `json:"error_rows"`
	Duplicates int         `json:"duplicates"`
	Columns    []string    `json:"columns"`
	Preview    []ImportRow `json:"preview"`
}

type DuplicatePair struct {
	ID        string `json:"id"`
	Reason    string `json:"reason"`
	Primary   Person `json:"primary"`
	Candidate Person `json:"candidate"`
}

type MergeRequest struct {
	PrimaryID   string `json:"primary_id"`
	SecondaryID string `json:"secondary_id"`
	FullName    string `json:"full_name"`
	Phone       string `json:"phone"`
	DateOfBirth string `json:"date_of_birth,omitempty"`
	HouseholdID string `json:"household_id,omitempty"`
	CareGroupID string `json:"care_group_id,omitempty"`
}

func (s *Store) ParseCSVImport(reader io.Reader) (*ImportPreviewResponse, error) {
	csvReader := csv.NewReader(reader)
	csvReader.TrimLeadingSpace = true

	headers, err := csvReader.Read()
	if err != nil {
		return nil, fmt.Errorf("failed to read CSV headers: %w", err)
	}

	headerMap := make(map[string]int)
	for i, h := range headers {
		headerMap[strings.ToLower(strings.TrimSpace(h))] = i
	}

	// Helper to find column index
	findCol := func(candidates ...string) int {
		for _, c := range candidates {
			if idx, ok := headerMap[strings.ToLower(c)]; ok {
				return idx
			}
		}
		return -1
	}

	nameIdx := findCol("nama", "name", "full name", "full_name")
	phoneIdx := findCol("hp", "phone", "telepon", "handphone", "telp")
	emailIdx := findCol("email", "surel")
	addrIdx := findCol("alamat", "address")
	dobIdx := findCol("tgl_lahir", "dob", "birth_date", "date of birth", "tgl lahir")
	standingIdx := findCol("status", "standing", "keanggotaan")
	careGroupIdx := findCol("care_group", "care group", "komsel", "wilayah")

	s.mu.RLock()
	existingPhones := make(map[string]string)
	existingEmails := make(map[string]string)
	for _, p := range s.people {
		if p.Phone != "" && p.Phone != "—" {
			existingPhones[NormalizePhone(p.Phone)] = p.ID
		}
		if p.Email != "" {
			existingEmails[strings.ToLower(p.Email)] = p.ID
		}
	}
	s.mu.RUnlock()

	var rows []ImportRow
	rowNum := 1
	validCount := 0
	errorCount := 0
	dupCount := 0

	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			continue
		}
		rowNum++

		row := ImportRow{
			RowNumber: rowNum,
			Raw:       make(map[string]string),
			Errors:    make([]string, 0),
		}

		for i, h := range headers {
			if i < len(record) {
				row.Raw[h] = record[i]
			}
		}

		if nameIdx >= 0 && nameIdx < len(record) {
			row.FullName = strings.TrimSpace(record[nameIdx])
		}
		if phoneIdx >= 0 && phoneIdx < len(record) {
			row.Phone = strings.TrimSpace(record[phoneIdx])
		}
		if emailIdx >= 0 && emailIdx < len(record) {
			row.Email = strings.TrimSpace(record[emailIdx])
		}
		if addrIdx >= 0 && addrIdx < len(record) {
			row.Address = strings.TrimSpace(record[addrIdx])
		}
		if dobIdx >= 0 && dobIdx < len(record) {
			row.DateOfBirth = strings.TrimSpace(record[dobIdx])
		}
		if standingIdx >= 0 && standingIdx < len(record) {
			row.Standing = strings.TrimSpace(record[standingIdx])
		}
		if careGroupIdx >= 0 && careGroupIdx < len(record) {
			row.CareGroup = strings.TrimSpace(record[careGroupIdx])
		}

		// Validation rules
		if row.FullName == "" {
			row.Errors = append(row.Errors, "Missing full name")
		}

		if row.Phone != "" {
			normalized := NormalizePhone(row.Phone)
			if len(normalized) < 10 {
				row.Errors = append(row.Errors, "Invalid phone number format")
			} else {
				// Check for duplicates (BR-MEM-3)
				if dupID, exists := existingPhones[normalized]; exists {
					row.IsDuplicate = true
					row.DuplicateOfID = dupID
					dupCount++
				}
			}
		}

		if row.Email != "" {
			if dupID, exists := existingEmails[strings.ToLower(row.Email)]; exists {
				if !row.IsDuplicate {
					row.IsDuplicate = true
					row.DuplicateOfID = dupID
					dupCount++
				}
			}
		}

		if len(row.Errors) > 0 {
			errorCount++
		} else {
			validCount++
		}

		rows = append(rows, row)
	}

	return &ImportPreviewResponse{
		TotalRows:  len(rows),
		ValidRows:  validCount,
		ErrorRows:  errorCount,
		Duplicates: dupCount,
		Columns:    headers,
		Preview:    rows,
	}, nil
}

func (s *Store) CommitImport(rows []ImportRow) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	imported := 0
	for _, r := range rows {
		if len(r.Errors) > 0 || r.IsDuplicate {
			continue
		}

		s.seq++
		id := fmt.Sprintf("per-%03d", s.seq)
		p := Person{
			ID:          id,
			FullName:    r.FullName,
			Phone:       NormalizePhone(r.Phone),
			Email:       r.Email,
			DateOfBirth: r.DateOfBirth,
			Standing:    StandingMember,
			Lifecycle:   LifecycleActive,
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
		}
		s.people[id] = p
		s.order = append(s.order, id)
		imported++
	}

	return imported, nil
}

func (s *Store) GetDuplicates() []DuplicatePair {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Find duplicate phone numbers and emails among people
	byPhone := make(map[string][]Person)
	byEmail := make(map[string][]Person)
	for _, p := range s.people {
		if p.Phone != "" && p.Phone != "—" {
			norm := NormalizePhone(p.Phone)
			byPhone[norm] = append(byPhone[norm], p)
		}
		if p.Email != "" {
			normEmail := strings.ToLower(strings.TrimSpace(p.Email))
			byEmail[normEmail] = append(byEmail[normEmail], p)
		}
	}

	var pairs []DuplicatePair
	seenPairs := make(map[string]bool)

	for phone, group := range byPhone {
		if len(group) >= 2 {
			pairKey := fmt.Sprintf("%s:%s", group[0].ID, group[1].ID)
			seenPairs[pairKey] = true
			pairs = append(pairs, DuplicatePair{
				ID:        fmt.Sprintf("dup-phone-%s", phone),
				Reason:    fmt.Sprintf("Shared phone number: %s", phone),
				Primary:   group[0],
				Candidate: group[1],
			})
		}
	}

	for email, group := range byEmail {
		if len(group) >= 2 {
			pairKey := fmt.Sprintf("%s:%s", group[0].ID, group[1].ID)
			if !seenPairs[pairKey] {
				pairs = append(pairs, DuplicatePair{
					ID:        fmt.Sprintf("dup-email-%s", email),
					Reason:    fmt.Sprintf("Shared email address: %s", email),
					Primary:   group[0],
					Candidate: group[1],
				})
			}
		}
	}

	return pairs
}

func (s *Store) Merge(req MergeRequest) (*Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	primary, exists := s.people[req.PrimaryID]
	if !exists {
		return nil, errors.New("primary person record not found")
	}

	secondary, existsSec := s.people[req.SecondaryID]
	if !existsSec {
		return nil, errors.New("secondary person record not found")
	}

	// Apply resolved merge values
	if req.FullName != "" {
		primary.FullName = req.FullName
	}
	if req.Phone != "" {
		primary.Phone = NormalizePhone(req.Phone)
	}
	if req.DateOfBirth != "" {
		primary.DateOfBirth = req.DateOfBirth
	}
	if req.HouseholdID != "" {
		primary.HouseholdID = req.HouseholdID
	}
	if req.CareGroupID != "" {
		primary.CareGroupID = req.CareGroupID
	}
	primary.UpdatedAt = time.Now().UTC()
	s.people[primary.ID] = primary

	// Secondary record is archived / marked inactive (transferred/merged)
	secondary.Lifecycle = LifecycleInactive
	secondary.Notes = fmt.Sprintf("Merged into %s (%s) on %s", primary.FullName, primary.ID, time.Now().Format("2006-01-02"))
	secondary.UpdatedAt = time.Now().UTC()
	s.people[secondary.ID] = secondary

	return &primary, nil
}

// SampleCSVData returns sample test CSV data
func SampleCSVData() *bytes.Buffer {
	csvStr := `Nama,HP,Email,Alamat,Tgl Lahir
Budi Halim,0812-1122-3344,budi@halim.com,Sunter Agung,1978-05-12
Melisa Tan,0813-8899-7766,melisa@test.com,Kelapa Gading,1985-08-20
Bad Record,,bad@email.com,,
`
	return bytes.NewBufferString(csvStr)
}
