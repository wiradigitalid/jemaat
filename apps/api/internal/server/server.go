package server

import (
	"encoding/json"
	"net/http"
	"time"

	"jemaat/apps/api/internal/auth"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct {
	router      *chi.Mux
	authService *auth.Service
}

func NewServer(authService *auth.Service) *Server {
	s := &Server{
		router:      chi.NewRouter(),
		authService: authService,
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

		// Protected church office desk routes placeholder
		r.Group(func(protected chi.Router) {
			protected.Use(s.authService.Middleware)
			protected.Get("/desk/summary", s.handleDeskSummary)
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
		"members_total":      0,
	})
}
