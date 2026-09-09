package server_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/caregroups"
	"jemaat/apps/api/internal/households"
	"jemaat/apps/api/internal/people"
	"jemaat/apps/api/internal/server"
	"jemaat/apps/api/internal/serving"
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

func TestMinistryTeamsAPI_CRUD(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. List seeded ministry teams
	req := httptest.NewRequest(http.MethodGet, "/api/v1/ministry-teams", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list teams, got %d", rec.Code)
	}

	var listResp struct {
		Data  []serving.MinistryTeam `json:"data"`
		Total int                    `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &listResp)
	if listResp.Total == 0 {
		t.Fatal("expected seeded ministry teams, got 0")
	}

	// 2. Create new ministry department
	createPayload := serving.CreateTeamRequest{
		Name:       "Youth & Campus",
		LeaderName: "Timothy Prasetyo",
	}
	body, _ := json.Marshal(createPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/ministry-teams", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on create team, got %d", rec.Code)
	}
	var createdTeam serving.MinistryTeam
	_ = json.Unmarshal(rec.Body.Bytes(), &createdTeam)

	// 3. Add serving role to new department
	rolePayload := serving.CreateRoleRequest{
		Name:          "Youth Mentor",
		RequiredCount: 3,
	}
	body, _ = json.Marshal(rolePayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/ministry-teams/"+createdTeam.ID+"/roles", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on add role, got %d", rec.Code)
	}

	// 4. List roles for team
	req = httptest.NewRequest(http.MethodGet, "/api/v1/ministry-teams/"+createdTeam.ID+"/roles", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list roles, got %d", rec.Code)
	}
	var rolesResp struct {
		Data  []serving.ServingRole `json:"data"`
		Total int                   `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &rolesResp)
	if rolesResp.Total != 1 || rolesResp.Data[0].Name != "Youth Mentor" {
		t.Errorf("expected 1 role 'Youth Mentor', got %+v", rolesResp)
	}
}

func TestRosterMatrix_SlotAssignment(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. Get initial roster matrix
	req := httptest.NewRequest(http.MethodGet, "/api/v1/roster-matrix", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on get matrix, got %d", rec.Code)
	}
	var matrix serving.RosterMatrixResponse
	_ = json.Unmarshal(rec.Body.Bytes(), &matrix)
	if len(matrix.Services) != 4 {
		t.Errorf("expected 4 service dates in March, got %d", len(matrix.Services))
	}
	if matrix.Summary.Confirmed < 1 {
		t.Errorf("expected confirmed assignments, got %d", matrix.Summary.Confirmed)
	}

	// 2. Assign volunteer to a service role
	asgReq := serving.CreateAssignmentRequest{
		ServiceID:  "srv-03",
		TeamID:     "team-02",
		RoleID:     "role-201",
		PersonID:   "per-004",
		PersonName: "Andreas Wibowo",
		Status:     serving.StatusPending,
	}
	body, _ := json.Marshal(asgReq)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/roster-assignments", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on create assignment, got %d: %s", rec.Code, rec.Body.String())
	}
	var createdAsg serving.RosterAssignment
	_ = json.Unmarshal(rec.Body.Bytes(), &createdAsg)

	// 3. Update assignment status to confirmed (UC-8, FR-7)
	statusReq := serving.UpdateAssignmentStatusRequest{
		Status: serving.StatusConfirmed,
	}
	body, _ = json.Marshal(statusReq)
	req = httptest.NewRequest(http.MethodPut, "/api/v1/roster-assignments/"+createdAsg.ID+"/status", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on status update, got %d", rec.Code)
	}
	var updatedAsg serving.RosterAssignment
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedAsg)
	if updatedAsg.Status != serving.StatusConfirmed {
		t.Errorf("expected status confirmed, got %s", updatedAsg.Status)
	}
}

func TestSubstituteAssignment_OnDecline(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Mark asg-04 as declined by volunteer
	declineReq := serving.UpdateAssignmentStatusRequest{
		Status:        serving.StatusDeclined,
		DeclineReason: "Family wedding in Surabaya",
	}
	body, _ := json.Marshal(declineReq)
	req := httptest.NewRequest(http.MethodPut, "/api/v1/roster-assignments/asg-04/status", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on decline, got %d", rec.Code)
	}

	// Coordinator assigns substitute volunteer (UC-10)
	subReq := serving.AssignSubstituteRequest{
		SubstitutePersonID:   "per-004",
		SubstitutePersonName: "Andreas Wibowo",
		Reason:               "Substitute available for slides",
	}
	body, _ = json.Marshal(subReq)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/roster-assignments/asg-04/substitute", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on substitute assignment, got %d: %s", rec.Code, rec.Body.String())
	}

	var subAsg serving.RosterAssignment
	_ = json.Unmarshal(rec.Body.Bytes(), &subAsg)
	if subAsg.SubstitutePersonName != "Andreas Wibowo" {
		t.Errorf("expected substitute Andreas Wibowo, got %s", subAsg.SubstitutePersonName)
	}
	if subAsg.Status != serving.StatusConfirmed {
		t.Errorf("expected status confirmed after substitute, got %s", subAsg.Status)
	}

	// Try assigning a substitute who is blocked out on 2026-03-28 (Melisa Halim)
	conflictingSub := serving.AssignSubstituteRequest{
		SubstitutePersonID:   "per-002",
		SubstitutePersonName: "Melisa Halim",
		Reason:               "Try assigning blocked-out volunteer as substitute",
	}
	body, _ = json.Marshal(conflictingSub)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/roster-assignments/asg-08/substitute", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 when substitute has scheduling conflict, got %d", rec.Code)
	}
}

func TestServiceManagement_AndRosterDeletion(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. Create a new service instance
	newServicePayload := map[string]string{
		"name":       "Good Friday Service 18:00",
		"date":       "2026-04-03",
		"date_label": "FRI 3 APR",
		"time_slot":  "18:00",
	}
	body, _ := json.Marshal(newServicePayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/services", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on create service, got %d", rec.Code)
	}

	// 2. Get service roster for srv-01
	req = httptest.NewRequest(http.MethodGet, "/api/v1/services/srv-01/roster", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on get service roster, got %d", rec.Code)
	}
	var rosterResp struct {
		ServiceID   string                     `json:"service_id"`
		Assignments []serving.RosterAssignment `json:"assignments"`
		Total       int                        `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &rosterResp)
	if rosterResp.Total < 1 {
		t.Errorf("expected at least 1 assignment in srv-01 roster, got %d", rosterResp.Total)
	}

	// 3. Delete an assignment
	req = httptest.NewRequest(http.MethodDelete, "/api/v1/roster-assignments/asg-01", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on delete assignment, got %d", rec.Code)
	}
}

func TestBlockoutDates_AvailabilityAPI(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. List availability (initial seeded items)
	req := httptest.NewRequest(http.MethodGet, "/api/v1/volunteers/availability", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list availability, got %d", rec.Code)
	}
	var listResp struct {
		Data  []serving.VolunteerAvailability `json:"data"`
		Total int                             `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &listResp)
	if listResp.Total < 2 {
		t.Errorf("expected at least 2 seeded blockouts, got %d", listResp.Total)
	}

	// 2. Reject invalid dates (start_date > end_date)
	invalidPayload := map[string]string{
		"person_id":  "per-004",
		"start_date": "2026-04-10",
		"end_date":   "2026-04-05",
		"reason":     "Typo in dates",
	}
	body, _ := json.Marshal(invalidPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/volunteers/availability", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 on invalid blockout dates, got %d", rec.Code)
	}

	// 3. Successfully add blockout
	validPayload := map[string]string{
		"person_id":  "per-004",
		"start_date": "2026-04-05",
		"end_date":   "2026-04-12",
		"reason":     "Out of town for Easter holiday",
	}
	body, _ = json.Marshal(validPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/volunteers/availability", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on create blockout, got %d", rec.Code)
	}
}

func TestConflictDetection_BlockoutDateEnforcement(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Melisa Halim (per-002) has a seeded blockout on 2026-03-27 to 2026-03-31
	// Attempt to schedule her for service srv-04 on 2026-03-28 without override
	asgReq := serving.CreateAssignmentRequest{
		ServiceID:  "srv-04",
		TeamID:     "team-01",
		RoleID:     "role-101",
		PersonID:   "per-002",
		PersonName: "Melisa Halim",
		Status:     serving.StatusPending,
		Override:   false,
	}
	body, _ := json.Marshal(asgReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/roster-assignments", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	// Conflict engine must intercept and return HTTP 409 Conflict (BR-2, AD-4)
	if rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict when assigning blocked-out volunteer, got %d: %s", rec.Code, rec.Body.String())
	}

	var conflictResp struct {
		Error    string                 `json:"error"`
		Message  string                 `json:"message"`
		Conflict serving.ConflictResult `json:"conflict"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &conflictResp)
	if conflictResp.Conflict.Type != serving.ConflictTypeBlockout {
		t.Errorf("expected conflict type 'blockout', got %s", conflictResp.Conflict.Type)
	}

	// Coordinator explicitly provides override reason to bypass blockout (BR-SRV-3)
	asgReq.Override = true
	asgReq.OverrideReason = "Volunteer confirmed availability by phone for emergency cover"
	body, _ = json.Marshal(asgReq)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/roster-assignments", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created with valid override reason, got %d: %s", rec.Code, rec.Body.String())
	}
	var createdAsg serving.RosterAssignment
	_ = json.Unmarshal(rec.Body.Bytes(), &createdAsg)
	if !createdAsg.IsOverridden || createdAsg.OverrideReason == "" {
		t.Errorf("expected is_overridden true with reason recorded, got %+v", createdAsg)
	}
}

func TestConflictDetection_DoubleBookingPrevention(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// Andreas Wibowo (per-004) is already rostered for Slides on srv-02 (2026-03-14)
	// Try to assign him to Sound Engineer on the same service without override
	asgReq := serving.CreateAssignmentRequest{
		ServiceID:  "srv-02",
		TeamID:     "team-02",
		RoleID:     "role-201",
		PersonID:   "per-004",
		PersonName: "Andreas Wibowo",
		Status:     serving.StatusPending,
		Override:   false,
	}
	body, _ := json.Marshal(asgReq)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/roster-assignments", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	// Conflict engine must detect overlapping assignment and reject (AD-4)
	if rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 Conflict for double-booking, got %d: %s", rec.Code, rec.Body.String())
	}

	var conflictResp struct {
		Error    string                 `json:"error"`
		Conflict serving.ConflictResult `json:"conflict"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &conflictResp)
	if conflictResp.Conflict.Type != serving.ConflictTypeDoubleBooking {
		t.Errorf("expected conflict type 'double_booking', got %s", conflictResp.Conflict.Type)
	}
}

func TestCareGroupsAPI_DirectoryAndEnrollment(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	cgStore := caregroups.NewStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore, cgStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. List Care Groups (UC-11)
	req := httptest.NewRequest(http.MethodGet, "/api/v1/care-groups", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list care groups, got %d", rec.Code)
	}
	var listResp struct {
		Data  []caregroups.CareGroup `json:"data"`
		Total int                    `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &listResp)
	if listResp.Total < 5 {
		t.Errorf("expected at least 5 seeded care groups, got %d", listResp.Total)
	}

	// 2. Create a new care group
	newGroupPayload := caregroups.CreateCareGroupRequest{
		Name:           "Solafide",
		Zone:           "Kelapa Gading",
		LeaderName:     "Hendrik Tan",
		MeetingDay:     "Tuesdays",
		MeetingTime:    "19:00",
		MeetingAddress: "Jl. Boulevard Raya Blok PA 1",
	}
	body, _ := json.Marshal(newGroupPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/care-groups", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on create care group, got %d", rec.Code)
	}
	var createdGroup caregroups.CareGroup
	_ = json.Unmarshal(rec.Body.Bytes(), &createdGroup)

	// 3. List unplaced care group applicants
	req = httptest.NewRequest(http.MethodGet, "/api/v1/care-groups/unplaced", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list unplaced, got %d", rec.Code)
	}
	var unplacedResp struct {
		Data  []caregroups.UnplacedPerson `json:"data"`
		Total int                         `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &unplacedResp)
	if unplacedResp.Total < 1 {
		t.Errorf("expected unplaced applicants, got %d", unplacedResp.Total)
	}

	// 4. Enroll member into care group (UC-14, FR-9)
	enrollPayload := caregroups.EnrollMemberRequest{
		PersonID: "per-rw",
		FullName: "Rian Wijaya",
		Standing: "Member",
		IsLeader: false,
	}
	body, _ = json.Marshal(enrollPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/care-groups/"+createdGroup.ID+"/members", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on enroll member, got %d: %s", rec.Code, rec.Body.String())
	}
	var updatedGroup caregroups.CareGroup
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedGroup)
	if updatedGroup.MembersCount != 1 {
		t.Errorf("expected 1 member in group, got %d", updatedGroup.MembersCount)
	}

	// 5. Remove member from care group
	req = httptest.NewRequest(http.MethodDelete, "/api/v1/care-groups/"+createdGroup.ID+"/members/per-rw", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on remove member, got %d", rec.Code)
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedGroup)
	if updatedGroup.MembersCount != 0 {
		t.Errorf("expected 0 members after remove, got %d", updatedGroup.MembersCount)
	}
}

func TestMeetingReports_SummaryView(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	cgStore := caregroups.NewStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore, cgStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. List meetings for care group cg-01 (UC-12, FR-10)
	req := httptest.NewRequest(http.MethodGet, "/api/v1/care-groups/cg-01/meetings", nil)
	req.Header.Set("Authorization", bearer)
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list meetings, got %d", rec.Code)
	}
	var meetingsResp struct {
		CareGroupID string                      `json:"care_group_id"`
		Data        []caregroups.MeetingSession `json:"data"`
		Total       int                         `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &meetingsResp)
	if meetingsResp.Total < 3 {
		t.Errorf("expected at least 3 seeded meetings, got %d", meetingsResp.Total)
	}

	// 2. Create meeting session
	newMeetingPayload := map[string]interface{}{
		"date":            "2026-03-11",
		"date_label":      "WED 11 MAR",
		"host_name":       "Dedi Kurnia",
		"topic":           "Walking in Faith Part 4",
		"offering_amount": 450000,
	}
	body, _ := json.Marshal(newMeetingPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/care-groups/cg-01/meetings", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 on create meeting, got %d: %s", rec.Code, rec.Body.String())
	}
	var createdMeeting caregroups.MeetingSession
	_ = json.Unmarshal(rec.Body.Bytes(), &createdMeeting)
	if createdMeeting.Topic != "Walking in Faith Part 4" {
		t.Errorf("expected topic 'Walking in Faith Part 4', got %s", createdMeeting.Topic)
	}
}

func TestPastoralAlerts_ThreeConsecutiveAbsences(t *testing.T) {
	authSvc := auth.NewService(auth.DefaultJWTSecret)
	pStore := people.NewStore()
	hStore := households.NewStore(pStore)
	sStore := serving.NewStore()
	rStore := serving.NewRosterStore()
	cgStore := caregroups.NewStore()
	srv := server.NewServerWithAllStores(authSvc, pStore, hStore, sStore, rStore, cgStore)

	token, code, _ := authSvc.RequestLink("+6281234567890")
	verifyResp, _ := authSvc.Verify("+6281234567890", token, code, false)
	bearer := "Bearer " + verifyResp.Token

	// 1. Batch sync offline attendance records (AD-5, BR-CG-2)
	// Jessica Tan has 3 consecutive unexcused absences (triggers alert - BR-3)
	// Kevin Halim has 3 absences but meeting 2 is excused (suppresses alert - BR-CG-3)
	syncPayload := caregroups.SyncAttendanceRequest{
		Records: []caregroups.AttendanceSyncItem{
			{MeetingSessionID: "mtg-01", PersonID: "per-jt", PersonName: "Jessica Tan", Attended: false, Excused: false},
			{MeetingSessionID: "mtg-02", PersonID: "per-jt", PersonName: "Jessica Tan", Attended: false, Excused: false},
			{MeetingSessionID: "mtg-03", PersonID: "per-jt", PersonName: "Jessica Tan", Attended: false, Excused: false},
			{MeetingSessionID: "mtg-01", PersonID: "per-kh", PersonName: "Kevin Halim", Attended: false, Excused: false},
			{MeetingSessionID: "mtg-02", PersonID: "per-kh", PersonName: "Kevin Halim", Attended: false, Excused: true, ExcusedReason: "Hospital recovery"},
			{MeetingSessionID: "mtg-03", PersonID: "per-kh", PersonName: "Kevin Halim", Attended: false, Excused: false},
		},
	}
	body, _ := json.Marshal(syncPayload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/care-groups/attendance/sync", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on attendance sync, got %d", rec.Code)
	}

	// Re-syncing the same payload must be idempotent (BR-CG-2, AD-5)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/care-groups/attendance/sync", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on idempotent attendance re-sync, got %d", rec.Code)
	}

	// 2. Query absence alerts (BR-3, FR-11, UC-13)
	req = httptest.NewRequest(http.MethodGet, "/api/v1/care-groups/absence-alerts", nil)
	req.Header.Set("Authorization", bearer)
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on list absence alerts, got %d", rec.Code)
	}
	var alertsResp struct {
		Data  []caregroups.AbsenceAlert `json:"data"`
		Total int                       `json:"total"`
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &alertsResp)

	// Verify Jessica Tan was dynamically flagged with consecutive absences = 3
	var foundJessica, foundKevin bool
	for _, a := range alertsResp.Data {
		if a.PersonName == "Jessica Tan" {
			foundJessica = true
			if a.ConsecutiveAbsences != 3 {
				t.Errorf("expected 3 consecutive absences for Jessica, got %d", a.ConsecutiveAbsences)
			}
		}
		if a.PersonName == "Kevin Halim" {
			foundKevin = true
		}
	}

	if !foundJessica {
		t.Error("expected Jessica Tan to be dynamically flagged in absence alerts (BR-3)")
	}
	if foundKevin {
		t.Error("Kevin Halim had an excused absence and must NOT be flagged (BR-CG-3)")
	}

	// 3. Log pastoral contact notes
	contactPayload := map[string]string{
		"notes": "Called member by phone, confirmed recovering from surgery and needs visitation next week",
	}
	body, _ = json.Marshal(contactPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/pastoral/alerts/alt-001/contact", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on log contact notes, got %d", rec.Code)
	}
	var updatedAlert caregroups.AbsenceAlert
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedAlert)
	if updatedAlert.Status != "contacted" {
		t.Errorf("expected status 'contacted', got %s", updatedAlert.Status)
	}

	// 4. Dismiss alert with pastoral reason
	dismissPayload := map[string]string{
		"reason": "Family relocated temporarily to Surabaya for 2 months",
	}
	body, _ = json.Marshal(dismissPayload)
	req = httptest.NewRequest(http.MethodPost, "/api/v1/pastoral/alerts/alt-002/dismiss", bytes.NewReader(body))
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	srv.Router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on dismiss alert, got %d", rec.Code)
	}
	_ = json.Unmarshal(rec.Body.Bytes(), &updatedAlert)
	if updatedAlert.Status != "dismissed" {
		t.Errorf("expected status 'dismissed', got %s", updatedAlert.Status)
	}
}
