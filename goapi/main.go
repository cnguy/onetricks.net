package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/mongodb/mongo-go-driver/mongo"

	"github.com/yuhanfang/riot/apiclient"
	"github.com/yuhanfang/riot/constants/region"
	"github.com/yuhanfang/riot/ratelimit"
)

func respondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, statusCode int, message string) {
	respondWithJSON(w, statusCode, map[string]string{"error": message})
}

type oneTrick struct {
	Champ  string `json:"championName"`
	Wins   int    `json:"wins"`
	Losses int    `json:"losses"`
	Name   string `json:"name"`
	Rank   string `json:"rank"`
	Region string `json:"region"`
}

type oneTrickV4 struct {
	AccountID string        `json:"accountId"`
	Champ     string        `json:"championName"`
	Wins      int           `json:"wins"`
	Losses    int           `json:"losses"`
	Name      string        `json:"name"`
	Rank      string        `json:"rank"`
	Region    region.Region `json:"region"`
}

type app struct {
	Router   *mux.Router
	Database *mongo.Client
	RiotAPI  apiclient.Client
	Context  context.Context
}

func (app *app) initialize() {
	app.Router = mux.NewRouter()
	app.initializeRoutes()
	app.Context = context.Background()
	ctx, _ := context.WithTimeout(app.Context, 10*time.Second)
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	mongoClient, err := mongo.Connect(ctx, os.Getenv("MONGO_URI"))
	if err != nil {
		println("Cannot connect to MongoDB", err)
	}
	app.Database = mongoClient

	key := os.Getenv("RIOT_API_KEY")
	println("Key", key)
	httpClient := http.DefaultClient
	limiter := ratelimit.NewLimiter()
	leagueClient := apiclient.New(key, httpClient, limiter)

	app.RiotAPI = leagueClient

	/*
		for i := 0; i < 100; i++ {
			summoner, err := client.GetBySummonerName(ctx, region.NA1, "9 5 mcdonalds")
			println(i)
		}*/

}

func (app *app) run() {
	port := "4000"
	log.Fatal(http.ListenAndServe(":"+port, app.Router))
}

func main() {
	app := app{}
	app.initialize()
	/*
		aggregator := newAggregator(app.RiotAPI, &inMemorySink{})
		err := aggregator.GenerateStats(app.Context, region.NA1)
		if err != nil {
			println("error generating stats", err.Error())
		}*/
	// app.run()
}
