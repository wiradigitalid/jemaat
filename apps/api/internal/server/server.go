package server

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/caregroups"
	"jemaat/apps/api/internal/households"
	"jemaat/apps/api/internal/people"
	"jemaat/apps/api/internal/portal"
	"jemaat/apps/api/internal/serving"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct {
	router         *chi.Mux
	authService    *auth.Service
	peopleStore    *people.Store
	householdStore *households.Store
	servingStore   *serving.Store
	rosterStore    *serving.RosterStore
	caregroupStore *caregroups.Store
	meetingStore   *caregroups.MeetingStore
	portalStore    *portal.Store
}

func NewServer(authService *auth.Service) *Server {
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	cgStore := caregroups.NewStore()
	return NewServerWithAllStores(authService, pStore, hStore, sStore, rStore, cgStore)
}

func NewServerWithStore(authService *auth.Service, peopleStore *people.Store) *Server {
	hStore := households.NewStore(peopleStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	cgStore := caregroups.NewStore()
	return NewServerWithAllStores(authService, peopleStore, hStore, sStore, rStore, cgStore)
}

func NewServerWithStores(authService *auth.Service, peopleStore *people.Store, householdStore *households.Store) *Server {
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	cgStore := caregroups.NewStore()
	return NewServerWithAllStores(authService, peopleStore, householdStore, sStore, rStore, cgStore)
}

func NewServerWithAllStores(authService *auth.Service, peopleStore *people.Store, householdStore *households.Store, servingStore *serving.Store, rosterStore *serving.RosterStore, optionalCgStore ...*caregroups.Store) *Server {
	var cgStore *caregroups.Store
	if len(optionalCgStore) > 0 && optionalCgStore[0] != nil {
		cgStore = optionalCgStore[0]
	} else {
		cgStore = caregroups.NewStore()
	}

	s := &Server{
		router:         chi.NewRouter(),
		authService:    authService,
		peopleStore:    peopleStore,
		householdStore: householdStore,
		servingStore:   servingStore,
		rosterStore:    rosterStore,
		caregroupStore: cgStore,
		meetingStore:   caregroups.NewMeetingStore(),
		portalStore:    portal.NewStore(),
	}

	s.setupMiddleware()
	s.setupRoutes()
	return s
}

func (s *Server) Router() *chi.Mux {
	return s.router
}

func (s *Server) setupMiddleware() {
	s.router.Use(middleware.RequestID)
	s.router.Use(middleware.RealIP)
	s.router.Use(middleware.Logger)
	s.router.Use(middleware.Recoverer)
	s.router.Use(middleware.Timeout(60 * time.Second))

	s.router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
}

func (s *Server) setupRoutes() {
	s.router.Route("/api/v1", func(r chi.Router) {
		// Public health check and church lookup
		r.Get("/health", s.handleHealth)
		r.Get("/church/lookup", s.handleLookupChurch)

		// Public authentication routes
		r.Route("/auth", func(authRouter chi.Router) {
			authRouter.Post("/request-link", s.handleRequestLink)
			authRouter.Post("/verify", s.handleVerify)

			// Protected auth route
			authRouter.Group(func(protected chi.Router) {
				protected.Use(s.authService.Middleware)
				protected.Get("/me", s.handleMe)
			})
		})

		// Protected church office desk routes
		r.Group(func(protected chi.Router) {
			protected.Use(s.authService.Middleware)
			protected.Get("/desk/summary", s.handleDeskSummary)

			// People endpoints (SPEC-1-02, SPEC-1-04, SPEC-1-05)
			protected.Get("/people", s.handleListPeople)
			protected.Post("/people", s.handleCreatePerson)
			protected.Get("/people/{id}", s.handleGetPerson)
			protected.Put("/people/{id}", s.handleUpdatePerson)
			protected.Put("/people/{id}/status", s.handleUpdatePersonStatus)
			protected.Post("/people/{id}/transfer", s.handleTransferPerson)
			protected.Get("/people/{id}/audit", s.handleGetPersonAudit)
			protected.Post("/people/import", s.handleImportPreview)
			protected.Post("/people/import/commit", s.handleImportCommit)
			protected.Get("/people/duplicates", s.handleGetDuplicates)
			protected.Post("/people/merge", s.handleMergePeople)

			// Household endpoints (SPEC-1-03)
			protected.Get("/households", s.handleListHouseholds)
			protected.Post("/households", s.handleCreateHousehold)
			protected.Get("/households/{id}", s.handleGetHousehold)
			protected.Put("/households/{id}/address", s.handleUpdateHouseholdAddress)
			protected.Put("/households/{id}/head", s.handleSetHouseholdHead)
			protected.Post("/households/{id}/members", s.handleLinkHouseholdMember)
			protected.Delete("/households/{id}/members/{personId}", s.handleUnlinkHouseholdMember)

			// Data Export endpoints (SPEC-1-06)
			protected.Get("/data/export", s.handleDataExport)

			// Ministry Teams & Roles endpoints (SPEC-2-01)
			protected.Get("/ministry-teams", s.handleListMinistryTeams)
			protected.Post("/ministry-teams", s.handleCreateMinistryTeam)
			protected.Get("/ministry-teams/{id}/roles", s.handleListTeamRoles)
			protected.Post("/ministry-teams/{id}/roles", s.handleAddTeamRole)
			protected.Put("/ministry-teams/{id}", s.handleUpdateMinistryTeam)

			// Volunteer Scheduling & Roster Matrix endpoints (SPEC-2-02)
			protected.Get("/services", s.handleListServices)
			protected.Get("/roster-matrix", s.handleGetRosterMatrix)
			protected.Post("/roster-assignments", s.handleCreateRosterAssignment)
			protected.Put("/roster-assignments/{id}/status", s.handleUpdateRosterAssignmentStatus)
			protected.Post("/roster-assignments/{id}/substitute", s.handleAssignSubstitute)
			protected.Post("/services", s.handleCreateService)
			protected.Get("/services/{id}/roster", s.handleGetServiceRoster)
			protected.Delete("/roster-assignments/{id}", s.handleDeleteRosterAssignment)

			// Volunteer Availability & Blockout Dates endpoints (SPEC-2-03, BR-2, AD-4)
			protected.Get("/volunteers/availability", s.handleListAvailability)
			protected.Post("/volunteers/availability", s.handleAddAvailability)

			// Care Groups & Member Enrollment endpoints (SPEC-3-01, UC-11, UC-14, FR-9)
			protected.Get("/care-groups", s.handleListCareGroups)
			protected.Post("/care-groups", s.handleCreateCareGroup)
			protected.Get("/care-groups/unplaced", s.handleListUnplacedCareGroup)
			protected.Get("/care-groups/{id}", s.handleGetCareGroup)
			protected.Post("/care-groups/{id}/members", s.handleEnrollCareGroupMember)
			protected.Delete("/care-groups/{id}/members/{personId}", s.handleRemoveCareGroupMember)

			// Meeting Reports, Attendance Sync & Pastoral Alerts (SPEC-3-02, UC-12, UC-13, FR-10, FR-11, FR-17, BR-3, AD-5)
			protected.Get("/care-groups/{id}/meetings", s.handleListCareGroupMeetings)
			protected.Post("/care-groups/{id}/meetings", s.handleCreateCareGroupMeeting)
			protected.Post("/care-groups/attendance/sync", s.handleSyncAttendance)
			protected.Get("/care-groups/absence-alerts", s.handleListAbsenceAlerts)
			protected.Post("/pastoral/alerts/{id}/contact", s.handleContactPastoralAlert)
			protected.Post("/pastoral/alerts/{id}/dismiss", s.handleDismissPastoralAlert)

			// Church Tenant Profile & QR Code Print Generator (SPEC-4-01, UC-15, UC-16, FR-12, FR-13, AD-6, BR-POR-2)
			protected.Get("/church/profile", s.handleGetChurchProfile)
			protected.Put("/church/profile", s.handleUpdateChurchProfile)
			protected.Post("/church/code/regenerate", s.handleRegenerateChurchCode)
			protected.Get("/church/qr", s.handleGetChurchQR)
		})
	})
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "ok",
		"database":  "connected",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"version":   "0.1.0",
	})
}

func (s *Server) handleRequestLink(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req auth.AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	if req.Phone == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "phone number is required"})
		return
	}

	token, code, err := s.authService.RequestLink(req.Phone)
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "sent",
		"message":   "Magic link and 6-digit OTP generated for WhatsApp delivery",
		"debug_token": token,
		"debug_otp":   code,
	})
}

func (s *Server) handleVerify(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req auth.VerifyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request payload"})
		return
	}

	res, err := s.authService.Verify(req.Phone, req.Token, req.Code, req.SharedComputer)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) handleMe(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	admin, ok := r.Context().Value(auth.AdminContextKey).(*auth.AdminUser)
	if !ok || admin == nil {
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(admin)
}

func (s *Server) handleDeskSummary(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"church": map[string]interface{}{
			"id":   "chu-001",
			"name": "Immanuel Church, Sunter",
			"city": "Jakarta Utara",
		},
		"applicants_waiting": 5,
		"members_total":      s.peopleStore.Count(),
	})
}

func (s *Server) handleListPeople(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	q := r.URL.Query().Get("q")
	standing := r.URL.Query().Get("standing")
	careGroup := r.URL.Query().Get("care_group")
	maskStr := r.URL.Query().Get("mask")
	mask := false
	if maskStr != "" {
		mask, _ = strconv.ParseBool(maskStr)
	}

	filter := people.ListFilter{
		Query:     q,
		Standing:  standing,
		CareGroup: careGroup,
		Mask:      mask,
	}

	list := s.peopleStore.List(filter)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  list,
		"total": len(list),
	})
}

func (s *Server) handleCreatePerson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req people.CreatePersonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	person, err := s.peopleStore.Create(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(person)
}

func (s *Server) handleGetPerson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	maskStr := r.URL.Query().Get("mask")
	mask := false
	if maskStr != "" {
		mask, _ = strconv.ParseBool(maskStr)
	}

	person, err := s.peopleStore.Get(id, mask)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(person)
}

func (s *Server) handleUpdatePerson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req people.UpdatePersonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	person, err := s.peopleStore.Update(id, req)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(person)
}

func (s *Server) handleListHouseholds(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	list := s.householdStore.List()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  list,
		"total": len(list),
	})
}

func (s *Server) handleCreateHousehold(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req households.CreateHouseholdRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	hh, err := s.householdStore.Create(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(hh)
}

func (s *Server) handleGetHousehold(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	hh, err := s.householdStore.Get(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(hh)
}

func (s *Server) handleUpdateHouseholdAddress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req households.UpdateAddressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	hh, err := s.householdStore.UpdateAddress(id, req.Address)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(hh)
}

func (s *Server) handleSetHouseholdHead(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req households.SetHeadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	hh, err := s.householdStore.SetHead(id, req.PersonID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(hh)
}

func (s *Server) handleLinkHouseholdMember(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req households.LinkMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	hh, err := s.householdStore.LinkMember(id, req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(hh)
}

func (s *Server) handleUnlinkHouseholdMember(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")
	personID := chi.URLParam(r, "personId")

	hh, err := s.householdStore.UnlinkMember(id, personID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(hh)
}

func (s *Server) handleImportPreview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	preview, err := s.peopleStore.ParseCSVImport(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(preview)
}

func (s *Server) handleImportCommit(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		Rows []people.ImportRow `json:"rows"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	imported, err := s.peopleStore.CommitImport(req.Rows)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"imported": imported,
		"status":   "success",
	})
}

func (s *Server) handleGetDuplicates(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	dups := s.peopleStore.GetDuplicates()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  dups,
		"total": len(dups),
	})
}

func (s *Server) handleMergePeople(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req people.MergeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	merged, err := s.peopleStore.Merge(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(merged)
}

func (s *Server) handleUpdatePersonStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req people.StatusTransitionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	operator := "Lidya S."
	if admin, ok := r.Context().Value(auth.AdminContextKey).(*auth.AdminUser); ok && admin != nil {
		operator = admin.Name
	}

	person, err := s.peopleStore.UpdateMembershipStatus(id, req, operator)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(person)
}

func (s *Server) handleTransferPerson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req people.TransferRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	operator := "Lidya S."
	if admin, ok := r.Context().Value(auth.AdminContextKey).(*auth.AdminUser); ok && admin != nil {
		operator = admin.Name
	}

	transferRec, err := s.peopleStore.RecordTransfer(id, req, operator)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(transferRec)
}

func (s *Server) handleGetPersonAudit(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	audits := s.peopleStore.GetAuditHistory(id)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  audits,
		"total": len(audits),
	})
}

func (s *Server) handleListMinistryTeams(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	teams := s.servingStore.List()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  teams,
		"total": len(teams),
	})
}

func (s *Server) handleCreateMinistryTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req serving.CreateTeamRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	team, err := s.servingStore.Create(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(team)
}

func (s *Server) handleListTeamRoles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	team, err := s.servingStore.Get(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  team.Roles,
		"total": len(team.Roles),
	})
}

func (s *Server) handleAddTeamRole(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req serving.CreateRoleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	role, err := s.servingStore.AddRole(id, req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(role)
}

func (s *Server) handleUpdateMinistryTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	team, err := s.servingStore.UpdateTeam(id, req.Name)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(team)
}

func (s *Server) handleListServices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	srvs := s.rosterStore.ListServices()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  srvs,
		"total": len(srvs),
	})
}

func (s *Server) handleGetRosterMatrix(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	matrix := s.rosterStore.GetMatrix()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(matrix)
}

func (s *Server) handleCreateRosterAssignment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req serving.CreateAssignmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	teamName := "Media"
	roleName := "Role"
	if team, err := s.servingStore.Get(req.TeamID); err == nil {
		teamName = team.Name
		for _, rl := range team.Roles {
			if rl.ID == req.RoleID {
				roleName = rl.Name
				break
			}
		}
	}

	dateLabel := "SAT 7 MAR"
	serviceDate := "2026-03-07"
	for _, srv := range s.rosterStore.ListServices() {
		if srv.ID == req.ServiceID {
			dateLabel = srv.DateLabel
			serviceDate = srv.Date
			break
		}
	}

	asg, conflict, err := s.rosterStore.CreateAssignment(req, teamName, roleName, dateLabel, serviceDate)
	if err != nil {
		if conflict != nil && conflict.HasConflict {
			w.WriteHeader(http.StatusConflict)
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"error":    "conflict_detected",
				"message":  err.Error(),
				"conflict": conflict,
			})
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(asg)
}

func (s *Server) handleUpdateRosterAssignmentStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req serving.UpdateAssignmentStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	asg, err := s.rosterStore.UpdateStatus(id, req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(asg)
}

func (s *Server) handleAssignSubstitute(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req serving.AssignSubstituteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	asg, err := s.rosterStore.AssignSubstitute(id, req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(asg)
}

func (s *Server) handleCreateService(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		Name      string `json:"name"`
		Date      string `json:"date"`
		DateLabel string `json:"date_label"`
		TimeSlot  string `json:"time_slot"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	srv := s.rosterStore.CreateService(req.Name, req.Date, req.DateLabel, req.TimeSlot)
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(srv)
}

func (s *Server) handleGetServiceRoster(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	roster := s.rosterStore.GetServiceRoster(id)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"service_id":  id,
		"assignments": roster,
		"total":       len(roster),
	})
}

func (s *Server) handleDeleteRosterAssignment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	if deleted := s.rosterStore.DeleteAssignment(id); !deleted {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "assignment not found"})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":  "deleted",
		"message": "assignment removed",
	})
}

func (s *Server) handleListAvailability(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	personID := r.URL.Query().Get("person_id")

	list := s.rosterStore.ConflictEngine().ListAvailability(personID)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  list,
		"total": len(list),
	})
}

func (s *Server) handleAddAvailability(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req serving.CreateAvailabilityRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	avail, err := s.rosterStore.ConflictEngine().AddAvailability(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(avail)
}

func (s *Server) handleListCareGroups(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	groups := s.caregroupStore.List()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  groups,
		"total": len(groups),
	})
}

func (s *Server) handleCreateCareGroup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req caregroups.CreateCareGroupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	group, err := s.caregroupStore.Create(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(group)
}

func (s *Server) handleListUnplacedCareGroup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	unplaced := s.caregroupStore.ListUnplaced()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  unplaced,
		"total": len(unplaced),
	})
}

func (s *Server) handleGetCareGroup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	group, err := s.caregroupStore.Get(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(group)
}

func (s *Server) handleEnrollCareGroupMember(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req caregroups.EnrollMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	// Fetch person name and standing if not provided
	if p, err := s.peopleStore.Get(req.PersonID, false); err == nil {
		if req.FullName == "" {
			req.FullName = p.FullName
		}
		if req.Standing == "" {
			req.Standing = string(p.Standing)
		}
	}

	group, err := s.caregroupStore.EnrollMember(id, req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	// Synchronize member record
	_, _ = s.peopleStore.Update(req.PersonID, people.UpdatePersonRequest{
		CareGroupID:   &id,
		CareGroupName: &group.Name,
	})

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(group)
}

func (s *Server) handleRemoveCareGroupMember(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	groupID := chi.URLParam(r, "id")
	personID := chi.URLParam(r, "personId")

	group, err := s.caregroupStore.RemoveMember(groupID, personID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	// Clear person's care group linkage
	emptyStr := ""
	_, _ = s.peopleStore.Update(personID, people.UpdatePersonRequest{
		CareGroupID:   &emptyStr,
		CareGroupName: &emptyStr,
	})

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(group)
}

func (s *Server) handleListCareGroupMeetings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	meetings := s.meetingStore.ListMeetings(id)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"care_group_id": id,
		"data":          meetings,
		"total":         len(meetings),
	})
}

func (s *Server) handleCreateCareGroupMeeting(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req struct {
		Date           string `json:"date"`
		DateLabel      string `json:"date_label"`
		HostName       string `json:"host_name"`
		Topic          string `json:"topic"`
		OfferingAmount int64  `json:"offering_amount"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	groupName := "Care Group"
	if g, err := s.caregroupStore.Get(id); err == nil {
		groupName = g.Name
	}

	mtg, err := s.meetingStore.CreateMeeting(id, groupName, req.Date, req.DateLabel, req.HostName, req.Topic, req.OfferingAmount)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(mtg)
}

func (s *Server) handleSyncAttendance(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req caregroups.SyncAttendanceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	syncedCount := s.meetingStore.SyncAttendance(req)
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "synced",
		"synced":  syncedCount,
		"message": "attendance records ingested successfully",
	})
}

func (s *Server) handleListAbsenceAlerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	alerts := s.meetingStore.ListAbsenceAlerts()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"data":  alerts,
		"total": len(alerts),
	})
}

func (s *Server) handleContactPastoralAlert(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req struct {
		Notes string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	alert, err := s.meetingStore.ContactAlert(id, req.Notes)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(alert)
}

func (s *Server) handleDismissPastoralAlert(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := chi.URLParam(r, "id")

	var req struct {
		Reason string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	alert, err := s.meetingStore.DismissAlert(id, req.Reason)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(alert)
}

func (s *Server) handleGetChurchProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	p := s.portalStore.GetProfile()
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(p)
}

func (s *Server) handleUpdateChurchProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req portal.UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	p, err := s.portalStore.UpdateProfile(req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(p)
}

func (s *Server) handleRegenerateChurchCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	p, err := s.portalStore.RegenerateCode()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(p)
}

func (s *Server) handleGetChurchQR(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	p := s.portalStore.GetProfile()
	svg := s.portalStore.GenerateQRSVG()

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"code":      p.Code,
		"deep_link": p.DeepLink,
		"svg":       svg,
	})
}

func (s *Server) handleLookupChurch(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	code := r.URL.Query().Get("code")
	if code == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "code query parameter is required"})
		return
	}

	p, err := s.portalStore.LookupCode(code)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(p)
}
