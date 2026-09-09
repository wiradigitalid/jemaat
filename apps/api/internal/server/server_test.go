package server_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/server"
)

func TestHealthCheck(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	srv := server.NewServer(authSvc)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	rec := httptest.NewRecorder()

	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode health response: %v", err)
	}

	if resp["status"] != "ok" {
		t.Errorf("expected status 'ok', got %v", resp["status"])
	}
	if resp["database"] != "connected" {
		t.Errorf("expected database 'connected', got %v", resp["database"])
	}
}

func TestAdminAuth_MagicLinkAndOTP(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	srv := server.NewServer(authSvc)

	// Step 1: Request with unregistered phone -> expect 403 Forbidden
	unregPayload := map[string]string{"phone": "+6289999999999"}
	body, _ := json.Marshal(unregPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/request-link", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected status 403 for unregistered phone, got %d", rec.Code)
	}

	// Step 2: Request with registered phone (Lidya S.: +6281234567890) -> expect 200 OK
	regPayload := map[string]string{"phone": "0812-3456-7890"}
	body, _ = json.Marshal(regPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/auth/request-link", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200 for registered phone, got %d: %s", rec.Code, rec.Body.String())
	}

	var reqLinkResp map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &reqLinkResp); err != nil {
		t.Fatalf("failed to parse request-link response: %v", err)
	}

	debugToken, _ := reqLinkResp["debug_token"].(string)
	debugOTP, _ := reqLinkResp["debug_otp"].(string)

	if debugToken == "" || debugOTP == "" {
		t.Fatalf("expected non-empty token and OTP, got token=%q otp=%q", debugToken, debugOTP)
	}

	// Step 3: Verify using OTP code with shared_computer=true
	verifyPayload := map[string]interface{}{
		"phone":           "+6281234567890",
		"code":            debugOTP,
		"shared_computer": true,
	}
	body, _ = json.Marshal(verifyPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/auth/verify", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200 on OTP verify, got %d: %s", rec.Code, rec.Body.String())
	}

	var verifyResp auth.TokenResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &verifyResp); err != nil {
		t.Fatalf("failed to decode verify response: %v", err)
	}

	if verifyResp.Token == "" {
		t.Fatal("expected JWT token, got empty string")
	}
	if verifyResp.Admin.Role != "church_office" {
		t.Errorf("expected role 'church_office', got %s", verifyResp.Admin.Role)
	}
	if verifyResp.Admin.Name != "Lidya S." {
		t.Errorf("expected admin name 'Lidya S.', got %s", verifyResp.Admin.Name)
	}

	// Step 4: Access protected route GET /api/v1/auth/me without token -> 401
	req = httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401 without auth header, got %d", rec.Code)
	}

	// Step 5: Access protected route GET /api/v1/auth/me with Bearer token -> 200
	req = httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+verifyResp.Token)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200 with Bearer token, got %d: %s", rec.Code, rec.Body.String())
	}

	var meResp auth.AdminUser
	if err := json.Unmarshal(rec.Body.Bytes(), &meResp); err != nil {
		t.Fatalf("failed to decode me response: %v", err)
	}

	if meResp.Phone != "+6281234567890" {
		t.Errorf("expected me phone '+6281234567890', got %s", meResp.Phone)
	}
}
