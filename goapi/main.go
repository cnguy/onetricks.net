package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/mongodb/mongo-go-driver/bson"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/mongodb/mongo-go-driver/mongo"

	"github.com/cnguy/riot/apiclient"
	"github.com/cnguy/riot/constants/region"
	"github.com/cnguy/riot/ratelimit"
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

func (app *app) getThings(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	collection := app.Database.Database("one-tricks").Collection("players")

	cursor, err := collection.Find(app.Context, bson.D{})
	if err != nil {
		println("getThings err:", err)
		respondWithError(w, http.StatusInternalServerError, err.Error())
	}
	var oneTricks []oneTrick
	for cursor.Next(ctx) {
		var result bson.M
		var oneTrick oneTrick
		err := cursor.Decode(&result)
		if err != nil {
			log.Fatal(err)
		}
		bsonBytes, _ := bson.Marshal(result)
		bson.Unmarshal(bsonBytes, &oneTrick)
		oneTricks = append(oneTricks, oneTrick)
	}
	respondWithJSON(w, http.StatusOK, oneTricks)
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

func (app *app) initializeRoutes() {
	app.Router.HandleFunc("/api/v1/test", app.getThings).Methods("GET")
}

func (app *app) run() {
	port := "4000"
	log.Fatal(http.ListenAndServe(":"+port, app.Router))
}

func main() {
	app := app{}
	app.initialize()
	aggregator := NewAggregator(app.RiotAPI, &InMemorySink{})
	err := aggregator.GenerateStats(app.Context, region.NA1)
	if err != nil {
		println("error generating stats", err.Error())
	}
	// app.run()
}
