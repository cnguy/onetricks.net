package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/mongodb/mongo-go-driver/bson"
)

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

func (app *app) handleMatchHistory() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
