package main

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type redisConfig struct {
	URL      string
	Port     int
	Password string
}

type mongoDBConfig struct {
	URL string
}

type config struct {
	RiotAPIKey string
	Mongo      mongoDBConfig
	Redis      redisConfig
}

func newConfig() *config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	config := config{}
	config.RiotAPIKey = os.Getenv("RIOT_API_KEY")
	port, err := strconv.Atoi(os.Getenv("REDIS_KAYN_PORT"))
	if err != nil {
		log.Fatal("Invalid Redis port")
	}
	config.Redis = redisConfig{URL: os.Getenv("REDIS_KAYN"), Port: port, Password: os.Getenv("REDIS_KAYN_PASSWORD")}
	config.Mongo = mongoDBConfig{URL: os.Getenv("MONGO_URI")}
	return &config
}
