package server

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/people"
)

type DataExportResponse struct {
	ChurchName     string          `json:"church_name"`
	ExportedAt     time.Time       `json:"exported_at"`
	ExportedBy     string          `json:"exported_by"`
	TotalMembers   int             `json:"total_members"`
	TotalHousehold int             `json:"total_households"`
	People         []people.Person `json:"people"`
	Households     interface{}     `json:"households"`
}

func (s *Server) handleDataExport(w http.ResponseWriter, r *http.Request) {
	operator := "Lidya S."
	if admin, ok := r.Context().Value(auth.AdminContextKey).(*auth.AdminUser); ok && admin != nil {
		operator = admin.Name
	}

	format := strings.ToLower(r.URL.Query().Get("format"))
	category := strings.ToLower(r.URL.Query().Get("category"))
	includeAddresses := r.URL.Query().Get("include_addresses") == "true"

	allPeople := s.peopleStore.List(people.ListFilter{})
	allHouseholds := s.householdStore.List()

	// If format is CSV or XLSX stream
	if format == "xlsx" || format == "csv" {
		w.Header().Set("Content-Type", "text/csv; charset=utf-8")
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"jemaat-%s-%s.csv\"", category, time.Now().Format("20060102")))
		w.WriteHeader(http.StatusOK)

		cw := csv.NewWriter(w)
		defer cw.Flush()

		// Write clean header row
		_ = cw.Write([]string{"ID", "Full Name", "Phone", "Standing", "Lifecycle", "Household", "Care Group", "Address"})

		for _, p := range allPeople {
			addr := "— (masked)"
			if includeAddresses && p.HouseholdName != "" {
				addr = p.HouseholdName
			}
			_ = cw.Write([]string{
				p.ID,
				p.FullName,
				p.Phone,
				string(p.Standing),
				string(p.Lifecycle),
				p.HouseholdName,
				p.CareGroupName,
				addr,
			})
		}
		return
	}

	exportData := DataExportResponse{
		ChurchName:     "Immanuel Church, Sunter",
		ExportedAt:     time.Now().UTC(),
		ExportedBy:     operator,
		TotalMembers:   len(allPeople),
		TotalHousehold: len(allHouseholds),
		People:         allPeople,
		Households:     allHouseholds,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(exportData)
}
