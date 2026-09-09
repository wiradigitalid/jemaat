package server_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/households"
	"jemaat/apps/api/internal/people"
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

func TestPeopleAPI_CRUD(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	store := people.NewStore()
	srv := server.NewServerWithStore(authSvc, store)

	// Obtain valid admin token
	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, err := authSvc.Verify("+6281234567890", token, code, false)
	if err != nil {
		t.Fatalf("failed to verify admin: %v", err)
	}
	bearer := "Bearer " + verifyResp.Token

	// 1. Initial listing: empty
	req := httptest.NewRequest(http.MethodGet, "/api/v1/people", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on empty people list, got %d", rec.Code)
	}
	var listResp struct {
		Data  []people.Person `json:"data"`
		Total int             `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &listResp)
	if listResp.Total != 0 {
		t.Errorf("expected 0 total people initially, got %d", listResp.Total)
	}

	// 2. Create person with validation (empty full name fails)
	invalidPayload := map[string]string{"full_name": ""}
	body, _ := json.Marshal(invalidPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/people", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for empty full name, got %d", rec.Code)
	}

	// 3. Create valid person (Budi Halim)
	validPayload := people.CreatePersonRequest{
		FullName:        "Budi Halim",
		Phone:           "0812-1122-3344",
		DateOfBirth:     "12 May 1978",
		Standing:        people.StandingRegistered,
		HouseholdName:   "Halim household",
		RoleInHousehold: people.RoleHead,
		CareGroupName:   "Anugerah",
		PrivacyOptIn:    false,
	}
	body, _ = json.Marshal(validPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/people", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 created, got %d: %s", rec.Code, rec.Body.String())
	}
	var createdPerson people.Person
	_ = json.Unmarshal(rec.Body.Bytes(), &createdPerson)
	if createdPerson.ID == "" || createdPerson.FullName != "Budi Halim" {
		t.Fatalf("unexpected created person: %+v", createdPerson)
	}

	// 4. Get person without mask (full details)
	req = httptest.NewRequest(http.MethodGet, "/api/v1/people/"+createdPerson.ID, nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on get person, got %d", rec.Code)
	}
	var gotPerson people.Person
	_ = json.Unmarshal(rec.Body.Bytes(), &gotPerson)
	if gotPerson.Phone != "+6281211223344" {
		t.Errorf("expected normalized unmasked phone '+6281211223344', got %s", gotPerson.Phone)
	}

	// 5. Get person WITH privacy mask enabled (?mask=true, AD-3, BR-4)
	req = httptest.NewRequest(http.MethodGet, "/api/v1/people/"+createdPerson.ID+"?mask=true", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on get masked person, got %d", rec.Code)
	}
	var maskedPerson people.Person
	_ = json.Unmarshal(rec.Body.Bytes(), &maskedPerson)
	if !strings.Contains(maskedPerson.Phone, "••••") {
		t.Errorf("expected masked phone with '••••', got %s", maskedPerson.Phone)
	}

	// 6. Update person
	newName := "Budi Halim, S.T."
	updatePayload := people.UpdatePersonRequest{
		FullName: &newName,
	}
	body, _ = json.Marshal(updatePayload)
	req = httptest.NewRequest(http.MethodPut, "/api/v1/people/"+createdPerson.ID, bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on update, got %d: %s", rec.Code, rec.Body.String())
	}
	var updatedPerson people.Person
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedPerson)
	if updatedPerson.FullName != "Budi Halim, S.T." {
		t.Errorf("expected updated name 'Budi Halim, S.T.', got %s", updatedPerson.FullName)
	}
}

func TestHouseholdsAPI_LinkFamily(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. List households (demo seeded Keluarga Prasetyo)
	req := httptest.NewRequest(http.MethodGet, "/api/v1/households", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list households, got %d", rec.Code)
	}

	// 2. Get specific household details
	req = httptest.NewRequest(http.MethodGet, "/api/v1/households/hh-001", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on get household, got %d", rec.Code)
	}
	var hh households.Household
	_ = json.Unmarshal(rec.Body.Bytes(), &hh)
	if hh.Name != "Keluarga Prasetyo" {
		t.Errorf("expected name 'Keluarga Prasetyo', got %s", hh.Name)
	}

	// 3. Link a new family member (Rafael)
	linkReq := households.LinkMemberRequest{
		PersonID:     "per-new-child",
		FullName:     "Ruth Prasetyo",
		Standing:     "Guest",
		Age:          8,
		Relationship: "Grandchild",
		Category:     households.CategoryFamily,
	}
	body, _ := json.Marshal(linkReq)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/households/hh-001/members", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on link member, got %d", rec.Code)
	}
	var updatedHH households.Household
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedHH)
	foundRuth := false
	for _, m := range updatedHH.Members {
		if m.FullName == "Ruth Prasetyo" {
			foundRuth = true
			break
		}
	}
	if !foundRuth {
		t.Error("expected Ruth Prasetyo to be in household members")
	}

	// 4. Update address and verify synchronization (BR-MEM-2)
	newAddr := "Kelapa Gading Barat No. 10, Jakarta Utara"
	addrReq := households.UpdateAddressRequest{Address: newAddr}
	body, _ = json.Marshal(addrReq)
	req = httptest.NewRequest(http.MethodPut, "/api/v1/households/hh-001/address", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on update address, got %d", rec.Code)
	}

	// 5. Unlink member from household (BR-MEM-2: no cascade delete, person record remains)
	req = httptest.NewRequest(http.MethodDelete, "/api/v1/households/hh-001/members/per-new-child", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on unlink member, got %d", rec.Code)
	}
	var unlinkedHH households.Household
	_ = json.Unmarshal(rec.Body.Bytes(), &unlinkedHH)
	for _, m := range unlinkedHH.Members {
		if m.PersonID == "per-new-child" {
			t.Error("expected per-new-child to be removed from household")
		}
	}
}

func TestHeadOfHousehold_EnforceSingleHead(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Initial head of hh-001 is Bambang Prasetyo (per-bp)
	// Transfer head to Sri Prasetyo (per-sp)
	setHeadReq := households.SetHeadRequest{PersonID: "per-sp"}
	body, _ := json.Marshal(setHeadReq)
	req := httptest.NewRequest(http.MethodPut, "/api/v1/households/hh-001/head", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on set head, got %d: %s", rec.Code, rec.Body.String())
	}

	var hh households.Household
	_ = json.Unmarshal(rec.Body.Bytes(), &hh)
	if hh.HeadPersonID != "per-sp" {
		t.Errorf("expected head person ID 'per-sp', got %s", hh.HeadPersonID)
	}

	// Count number of heads: MUST BE EXACTLY ONE (BR-1)
	headCount := 0
	for _, m := range hh.Members {
		if m.IsHead {
			headCount++
		}
	}
	if headCount != 1 {
		t.Fatalf("expected strictly 1 head of household (BR-1), found %d", headCount)
	}
}

func TestCSVImport_PreviewAndValidation(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// CSV with 1 valid row and 1 invalid row (missing name)
	csvData := `Nama,HP,Email,Alamat
Yohanes Sitorus,0812-9988-7766,yohanes@church.com,Jakarta
,0811-0000-1111,noname@church.com,Bandung
`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/people/import", bytes.NewBufferString(csvData))
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on import preview, got %d", rec.Code)
	}

	var preview people.ImportPreviewResponse
	_ = json.Unmarshal(rec.Body.Bytes(), &preview)
	if preview.TotalRows != 2 {
		t.Errorf("expected 2 total rows, got %d", preview.TotalRows)
	}
	if preview.ValidRows != 1 {
		t.Errorf("expected 1 valid row, got %d", preview.ValidRows)
	}
	if preview.ErrorRows != 1 {
		t.Errorf("expected 1 error row, got %d", preview.ErrorRows)
	}
	if len(preview.Preview[1].Errors) == 0 {
		t.Error("expected validation error on second row with missing name")
	}
}

func TestDuplicateDetection_PhoneEmail(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Seed existing member
	_, _ = pStore.Create(people.CreatePersonRequest{
		FullName: "Existing Person",
		Phone:    "0812-1122-3344",
		Email:    "existing@church.com",
	})

	// CSV import with identical phone number (triggers BR-MEM-3 duplicate detection)
	csvData := `Nama,HP,Email
Budi Duplicate,0812-1122-3344,budi.dup@church.com
`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/people/import", bytes.NewBufferString(csvData))
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	var preview people.ImportPreviewResponse
	_ = json.Unmarshal(rec.Body.Bytes(), &preview)
	if preview.Duplicates != 1 {
		t.Errorf("expected 1 duplicate flagged, got %d", preview.Duplicates)
	}
	if !preview.Preview[0].IsDuplicate {
		t.Error("expected first row to be flagged as duplicate")
	}
}

func TestWebMerge_ExecuteMerge(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Create two duplicate records
	p1, _ := pStore.Create(people.CreatePersonRequest{
		FullName: "Budi Halim",
		Phone:    "0812-1122-3344",
		Standing: people.StandingRegistered,
	})
	p2, _ := pStore.Create(people.CreatePersonRequest{
		FullName: "B. Halim",
		Phone:    "0812-1122-3344",
		Standing: people.StandingMember,
	})

	// Execute Merge request
	mergeReq := people.MergeRequest{
		PrimaryID:   p1.ID,
		SecondaryID: p2.ID,
		FullName:    "Budi Halim",
		Phone:       "0812-1122-3344",
	}
	body, _ := json.Marshal(mergeReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/people/merge", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on merge, got %d", rec.Code)
	}

	// Verify secondary is now inactive/archived
	sec, _ := pStore.Get(p2.ID, false)
	if sec.Lifecycle != people.LifecycleInactive {
		t.Errorf("expected secondary record lifecycle Inactive, got %s", sec.Lifecycle)
	}
	if !strings.Contains(sec.Notes, "Merged into Budi Halim") {
		t.Errorf("expected audit note on secondary record, got %s", sec.Notes)
	}
}

func TestMembershipStatus_Transitions(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	p, _ := pStore.Create(people.CreatePersonRequest{
		FullName: "Andreas Wibowo",
		Phone:    "0811-2200-3311",
		Standing: people.StandingGuest,
	})

	// Transition standing from Guest to Registered Member
	newStanding := people.StandingRegistered
	statusReq := people.StatusTransitionRequest{
		Standing: &newStanding,
		Reason:   "Completed baptism and church membership class",
	}
	body, _ := json.Marshal(statusReq)
	req := httptest.NewRequest(http.MethodPut, "/api/v1/people/"+p.ID+"/status", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on status transition, got %d: %s", rec.Code, rec.Body.String())
	}

	updated, _ := pStore.Get(p.ID, false)
	if updated.Standing != people.StandingRegistered {
		t.Errorf("expected Registered Member standing, got %s", updated.Standing)
	}
}

func TestAutoCloseRoles_OnMemberTransfer(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Create member enrolled in a care group
	p, _ := pStore.Create(people.CreatePersonRequest{
		FullName:      "Melisa Halim",
		Phone:         "0813-9080-1122",
		Standing:      people.StandingRegistered,
		CareGroupID:   "cg-01",
		CareGroupName: "Anugerah",
	})

	// Transfer member to another church (BR-MEM-4)
	trfReq := people.TransferRequest{
		DestChurchName:    "Immanuel Church, Surabaya",
		TransferDate:      "2026-03-12",
		CertificateNumber: "ATT-202603-0914",
	}
	body, _ := json.Marshal(trfReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/people/"+p.ID+"/transfer", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on transfer, got %d: %s", rec.Code, rec.Body.String())
	}

	updated, _ := pStore.Get(p.ID, false)
	// Verify lifecycle moved to Transferred out
	if updated.Lifecycle != people.LifecycleTransferred {
		t.Errorf("expected lifecycle Transferred out, got %s", updated.Lifecycle)
	}
	// Verify active care group enrollment was auto-closed (BR-MEM-4)
	if updated.CareGroupName != "" {
		t.Errorf("expected care group to be auto-closed, got %s", updated.CareGroupName)
	}
}

func TestWebTransfer_GenerateAttestation(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	p, _ := pStore.Create(people.CreatePersonRequest{
		FullName: "Andreas Wibowo",
		Phone:    "0811-2200-3311",
		Standing: people.StandingRegistered,
	})

	trfReq := people.TransferRequest{
		DestChurchName: "Bethania Church, Bandung",
	}
	body, _ := json.Marshal(trfReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/people/"+p.ID+"/transfer", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on attestation generation, got %d", rec.Code)
	}

	var recData people.TransferRecord
	_ = json.Unmarshal(rec.Body.Bytes(), &recData)
	if recData.CertificateNumber == "" {
		t.Error("expected generated certificate number, got empty")
	}
	if recData.DestChurchName != "Bethania Church, Bandung" {
		t.Errorf("expected destination church 'Bethania Church, Bandung', got %s", recData.DestChurchName)
	}
}

func TestAuditHistory_ChronologicalLog(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	p, _ := pStore.Create(people.CreatePersonRequest{
		FullName: "Yohanes Halim",
		Phone:    "0812-3333-4444",
		Standing: people.StandingRegistered,
	})

	// Update status
	inact := people.LifecycleInactive
	_, _ = pStore.UpdateMembershipStatus(p.ID, people.StatusTransitionRequest{
		Lifecycle: &inact,
	}, "Lidya S.")

	// Retrieve audit
	req := httptest.NewRequest(http.MethodGet, "/api/v1/people/"+p.ID+"/audit", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on audit, got %d", rec.Code)
	}

	var auditResp struct {
		Data  []people.AuditEntry `json:"data"`
		Total int                 `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &auditResp)
	if auditResp.Total == 0 {
		t.Fatal("expected audit entries, got 0")
	}
	found := false
	for _, entry := range auditResp.Data {
		if entry.Action == "lifecycle_change" && entry.OperatorName == "Lidya S." {
			found = true
			break
		}
	}
	if !found {
		t.Error("expected audit entry for lifecycle_change by Lidya S.")
	}
}

func TestDataExportAPI_XLSX(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	srv := server.NewServerWithStores(authSvc, pStore, hStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Seed members
	_, _ = pStore.Create(people.CreatePersonRequest{
		FullName: "Andreas Wibowo",
		Phone:    "0811-2200-3311",
		Standing: people.StandingRegistered,
	})

	// 1. Test comprehensive JSON export
	req := httptest.NewRequest(http.MethodGet, "/api/v1/data/export", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on data export, got %d", rec.Code)
	}

	var exportResp map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &exportResp); err != nil {
		t.Fatalf("failed to decode export payload: %v", err)
	}

	if exportResp["church_name"] != "Immanuel Church, Sunter" {
		t.Errorf("expected church name 'Immanuel Church, Sunter', got %v", exportResp["church_name"])
	}
	if exportResp["total_members"].(float64) < 1 {
		t.Errorf("expected total_members >= 1, got %v", exportResp["total_members"])
	}

	// 2. Test CSV/XLSX stream export format
	reqStream := httptest.NewRequest(http.MethodGet, "/api/v1/data/export?format=xlsx&category=people", nil)
	reqStream.Header.Set("Authorization", bearer)
	recStream := httptest.NewRecorder()
	srv.Router().ServeHTTP(recStream, reqStream)

	if recStream.Code != http.StatusOK {
		t.Fatalf("expected 200 on stream export, got %d", recStream.Code)
	}
	if !strings.Contains(recStream.Header().Get("Content-Disposition"), "attachment") {
		t.Errorf("expected attachment header, got %s", recStream.Header().Get("Content-Disposition"))
	}
	if !strings.Contains(recStream.Body.String(), "Andreas Wibowo") {
		t.Errorf("expected Andreas Wibowo in CSV stream, got %s", recStream.Body.String())
	}
}
