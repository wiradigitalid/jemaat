package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	AdminContextKey contextKey = "current_admin"
	DefaultJWTSecret           = "jemaat-dev-secret-key-change-in-production-12345"
)

type AdminUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Role  string `json:"role"`
}

type AuthRequest struct {
	Phone string `json:"phone"`
}

type VerifyRequest struct {
	Phone          string `json:"phone"`
	Token          string `json:"token"`
	Code           string `json:"code"`
	SharedComputer bool   `json:"shared_computer"`
}

type TokenResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	Admin     AdminUser `json:"admin"`
}

type PendingVerification struct {
	Phone     string
	Code      string
	Token     string
	ExpiresAt time.Time
}

type Service struct {
	mu        sync.RWMutex
	jwtSecret []byte
	admins    map[string]AdminUser
	pending   map[string]PendingVerification
}

func NewService(jwtSecret string) *Service {
	s := &Service{
		jwtSecret: []byte(jwtSecret),
		admins:    make(map[string]AdminUser),
		pending:   make(map[string]PendingVerification),
	}

	// Seed registered administrators (Lidya S. from .work/design/screens-web.mjs)
	lidya := AdminUser{
		ID:    "adm-001",
		Name:  "Lidya S.",
		Phone: "+6281234567890",
		Role:  "church_office",
	}
	s.admins[lidya.Phone] = lidya

	pastor := AdminUser{
		ID:    "adm-002",
		Name:  "Pastor Markus T.",
		Phone: "+6281111111111",
		Role:  "church_office",
	}
	s.admins[pastor.Phone] = pastor

	return s
}

// NormalizePhone converts phone formats (08..., 62..., +62...) into canonical +62...
func NormalizePhone(p string) string {
	cleaned := strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' || r == '+' {
			return r
		}
		return -1
	}, strings.TrimSpace(p))

	if strings.HasPrefix(cleaned, "+62") {
		return cleaned
	}
	if strings.HasPrefix(cleaned, "62") {
		return "+" + cleaned
	}
	if strings.HasPrefix(cleaned, "0") {
		return "+62" + cleaned[1:]
	}
	if !strings.HasPrefix(cleaned, "+") && len(cleaned) > 0 {
		return "+62" + cleaned
	}
	return cleaned
}

func (s *Service) RequestLink(phone string) (token string, code string, err error) {
	norm := NormalizePhone(phone)

	s.mu.RLock()
	admin, exists := s.admins[norm]
	s.mu.RUnlock()

	if !exists {
		return "", "", fmt.Errorf("phone %s is not registered as church office administrator", norm)
	}

	// Generate 6-digit OTP
	codeBytes := make([]byte, 3)
	_, _ = rand.Read(codeBytes)
	code = fmt.Sprintf("%06d", (int(codeBytes[0])<<16|int(codeBytes[1])<<8|int(codeBytes[2]))%1000000)

	// Generate magic link token
	tokenBytes := make([]byte, 16)
	_, _ = rand.Read(tokenBytes)
	token = hex.EncodeToString(tokenBytes)

	s.mu.Lock()
	s.pending[norm] = PendingVerification{
		Phone:     norm,
		Code:      code,
		Token:     token,
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}
	s.mu.Unlock()

	_ = admin
	return token, code, nil
}

func (s *Service) Verify(phone, token, code string, sharedComputer bool) (*TokenResponse, error) {
	norm := NormalizePhone(phone)

	s.mu.Lock()
	pending, exists := s.pending[norm]
	if !exists {
		s.mu.Unlock()
		return nil, errors.New("no pending verification found for this phone number")
	}

	if time.Now().After(pending.ExpiresAt) {
		delete(s.pending, norm)
		s.mu.Unlock()
		return nil, errors.New("verification code or link has expired")
	}

	matched := false
	if code != "" && code == pending.Code {
		matched = true
	}
	if token != "" && token == pending.Token {
		matched = true
	}

	if !matched {
		s.mu.Unlock()
		return nil, errors.New("invalid verification code or link token")
	}

	delete(s.pending, norm)
	admin := s.admins[norm]
	s.mu.Unlock()

	// Expiry calculation
	var duration time.Duration
	if sharedComputer {
		duration = 4 * time.Hour // Session length for shared computers
	} else {
		duration = 30 * 24 * time.Hour // 30 days for personal desktop
	}
	expiresAt := time.Now().Add(duration)

	claims := jwt.MapClaims{
		"sub":   admin.ID,
		"name":  admin.Name,
		"phone": admin.Phone,
		"role":  admin.Role,
		"exp":   expiresAt.Unix(),
		"iat":   time.Now().Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := t.SignedString(s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to sign token: %w", err)
	}

	return &TokenResponse{
		Token:     signedToken,
		ExpiresAt: expiresAt,
		Admin:     admin,
	}, nil
}

func (s *Service) ValidateJWT(tokenStr string) (*AdminUser, error) {
	parsedToken, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return s.jwtSecret, nil
	})

	if err != nil || !parsedToken.Valid {
		return nil, errors.New("invalid or expired authorization token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	role, _ := claims["role"].(string)
	if role != "church_office" {
		return nil, errors.New("insufficient permissions: required role church_office")
	}

	return &AdminUser{
		ID:    fmt.Sprint(claims["sub"]),
		Name:  fmt.Sprint(claims["name"]),
		Phone: fmt.Sprint(claims["phone"]),
		Role:  role,
	}, nil
}

// Middleware creates an HTTP middleware verifying the administrator JWT
func (s *Service) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "missing authorization header"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid authorization header format"})
			return
		}

		admin, err := s.ValidateJWT(parts[1])
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		ctx := context.WithValue(r.Context(), AdminContextKey, admin)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
