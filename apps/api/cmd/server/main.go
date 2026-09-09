package main

import (
	"log"
	"net/http"
	"os"

	"jemaat/apps/api/internal/auth"
	"jemaat/apps/api/internal/people"
	"jemaat/apps/api/internal/server"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = auth.DefaultJWTSecret
	}

	authService := auth.NewService(jwtSecret)
	peopleStore := people.NewStore()
	if os.Getenv("SEED_DEMO") != "false" {
		peopleStore.SeedInitialDemoData()
	}

	srv := server.NewServerWithStore(authService, peopleStore)

	log.Printf("Jemaat API server starting on :%s ...", port)
	if err := http.ListenAndServe(":"+port, srv.Router()); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
