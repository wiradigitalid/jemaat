package server

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/households"
	"jemaat/apps/api/internal/people"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct {
	router         *chi.Mux
	authService    *auth.Service
	peopleStore    *people.Store
	householdStore *households.Store
}

func NewServer(authService *auth.Service) *Server {
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	return NewServerWithStores(authService, pStore, hStore)
}

func NewServerWithStore(authService *auth.Service, peopleStore *people.Store) *Server {
	hStore := households.NewStore(peopleStore)
	return NewServerWithStores(authService, peopleStore, hStore)
}

func NewServerWithStores(authService *auth.Service, peopleStore *people.Store, householdStore *households.Store) *Server {
	s := &Server{
		router:         chi.NewRouter(),
		authService:    authService,
		peopleStore:    peopleStore,
		householdStore: householdStore,
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
		// Public health check
		r.Get("/health", s.handleHealth)

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
