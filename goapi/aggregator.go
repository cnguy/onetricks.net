package main

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/cnguy/riot/apiclient"
	"github.com/cnguy/riot/constants/queue"
	"github.com/cnguy/riot/constants/region"
)

type Match struct {
	GameID       int64
	PlatformID   string
	GameCreation int64
	Win          int // "1" for Team 1, and "2" for Team 2.
	ChampionIDs  []int
	AccountIDs   []string
}

type Sink interface {
	DoesMatchExist(ctx context.Context, r region.Region, matchID int64) (bool, error)
	SaveMatches(ctx context.Context, matches []Match) error
}

type InMemorySink struct{}

func (sink *InMemorySink) DoesMatchExist(ctx context.Context, r region.Region, matchID int64) (bool, error) {
	return false, nil
}
func (sink *InMemorySink) SaveMatches(ctx context.Context, matches []Match) error {
	return nil
}

type Aggregator struct {
	client apiclient.Client
	sink   Sink
}

func NewAggregator(client apiclient.Client, sink Sink) *Aggregator {
	return &Aggregator{client: client, sink: sink}
}

func (aggregator *Aggregator) getAccountIDsInLeague(ctx context.Context, region region.Region, league *apiclient.LeagueList) ([]string, error) {
	var (
		accounts   = make(chan string)
		accountIDs []string
		wg         sync.WaitGroup
		done       = make(chan bool)
	)

	for _, entry := range league.Entries {
		entry := entry
		wg.Add(1)
		go func() {
			defer wg.Done()
			summoner, err := aggregator.client.GetBySummonerID(ctx, region, entry.SummonerID)
			if err != nil {
				println("GetBySummonerID failed for region %s summoner %s: %v", region, entry.SummonerID, err)
				return
			}
			select {
			case <-ctx.Done():
			case accounts <- summoner.AccountID:
			}
		}()
	}

	go func() {
		wg.Wait()
		done <- true
	}()

	more := true
	for more {
		select {
		case <-ctx.Done():
			more = false
		case id := <-accounts:
			accountIDs = append(accountIDs, id)
		case <-done:
			more = false
		}
	}

	return accountIDs, nil
}

func (aggregator *Aggregator) getMatchIDsFromMatchlist(ctx context.Context, region region.Region, accountID string, matchlist apiclient.Matchlist) ([]int64, error) {
	queues := []queue.Queue{queue.RankedSolo5x5}
	beginTime := int64(1548316800 * 1000 * 1000 * 1000)
	beginTimeT := time.Unix(beginTime/1000/1000/1000, 0)
	beginIndex := 0
	endIndex := 100
	var matchIDs []int64
	for {
		opts := apiclient.GetMatchlistOptions{Queue: queues, BeginTime: &beginTimeT, BeginIndex: &beginIndex, EndIndex: &endIndex}
		matchlist, err := aggregator.client.GetMatchlist(ctx, region, accountID, &opts)
		if err != nil {
			if err != apiclient.ErrDataNotFound {
				println("error getting matchlist:", err)
			} else {
				break // We've reached the end of the matchlist.
			}
		}
		if len(matchlist.Matches) == 0 {
			break
		}

		for _, match := range matchlist.Matches {
			//println(match.Timestamp.Time().UnixNano(), beginTime)
			if match.Timestamp.Time().UnixNano() >= beginTime {
				matchIDs = append(matchIDs, match.GameID)
			}
		}
		beginIndex += 100
		endIndex += 100
	}
	return matchIDs, nil
}

func (aggregator *Aggregator) GetSinkMatchesFromMatchIDs(ctx context.Context, region region.Region, matchIDs []int64) ([]Match, error) {
	matches := make([]Match, len(matchIDs))

	for i, matchID := range matchIDs {
		println(matchID)
		match, err := aggregator.client.GetMatch(ctx, region, matchID)
		if err != nil {
			println("GetSinkMatchesFromMatchIDs err:", err.Error())
		} else {
			var (
				win         int
				championIDs []int
				accountIDs  []string
			)

			for _, participantIdentity := range match.ParticipantIdentities {
				accountIDs = append(accountIDs, participantIdentity.Player.CurrentAccountID)
			}

			for _, participant := range match.Participants {
				championIDs = append(championIDs, int(participant.ChampionID))
			}

			if match.Teams[0].Win == "Win" {
				win = 1
			} else if match.Teams[1].Win == "Win" {
				win = 2
			} else {
				win = 0
			}

			sinkMatch := Match{
				GameID:       match.GameID,
				PlatformID:   match.PlatformID,
				GameCreation: match.GameCreation.Duration().Nanoseconds(),
				Win:          win,
				ChampionIDs:  championIDs,
				AccountIDs:   accountIDs,
			}

			matches[i] = sinkMatch
		}
	}

	return matches, nil
}

func (aggregator *Aggregator) GetMatchIDsForAccounts(ctx context.Context, region region.Region, accountIDs []string) ([]int64, error) {
	matchIDs := make([]int64, 0)

	for _, accountID := range accountIDs {
		queues := []queue.Queue{queue.RankedSolo5x5}
		beginTime := int64(1548316800 * 1000 * 1000 * 1000)
		beginTimeT := time.Unix(beginTime/1000/1000/1000, 0)
		beginIndex := 0
		endIndex := 100

		opts := apiclient.GetMatchlistOptions{Queue: queues, BeginTime: &beginTimeT, BeginIndex: &beginIndex, EndIndex: &endIndex}
		initialMatchlist, err := aggregator.client.GetMatchlist(ctx, region, accountID, &opts)
		if err != nil {
		} else {
			ms, err := aggregator.getMatchIDsFromMatchlist(ctx, region, accountID, *initialMatchlist)
			if err == nil {
				println("len of ms", len(ms))
				for _, m := range ms {
					exists, err := aggregator.sink.DoesMatchExist(ctx, region, m)
					if err != nil {
						log.Printf("MatchExists failed for region %s game %d: %v", region, m, err)
					}
					if err == nil && !exists {
						matchIDs = append(matchIDs, m)
					}
				}
			} else {
				println("GetMatchlist failed for region %s account %s: %v", region, accountID, err)
			}
		}
	}

	print(len(matchIDs))

	return matchIDs, nil
}

func (aggregator *Aggregator) GenerateStats(ctx context.Context, region region.Region) error {
	println("generating stats")
	// Load Master, Challenger, and Grandmaster leagues.
	masters, err := aggregator.client.GetMasterLeague(ctx, region, queue.RankedSolo5x5)
	if err != nil {
		println("error getting masters", err)
		return err
	}
	masters.Entries = masters.Entries[0:1]
	accountIDs, err := aggregator.getAccountIDsInLeague(ctx, region, masters)
	if err != nil {
		return err
	}
	println("len(accountIDs):", len(accountIDs))
	matchIDs, err := aggregator.GetMatchIDsForAccounts(ctx, region, accountIDs[0:1])
	if err != nil {
		println(err)
	}
	println("Done", len(matchIDs))
	sinkMatches, err := aggregator.GetSinkMatchesFromMatchIDs(ctx, region, matchIDs)
	if err != nil {
		println(err)
	}
	println("Matches", len(sinkMatches))
	fmt.Printf("%v", sinkMatches[0])
	/*
		for _, master := range masters.Entries {
			summoner, err := aggregator.client.GetBySummonerID(ctx, region, master.SummonerID)
			println(summoner.Name)
			if err != nil {
				println("error getting summoner:", err.Error())
			} else {
				queues := []queue.Queue{queue.RankedSolo5x5}
				beginTime := int64(1548316800 * 1000 * 1000 * 1000)
				beginTimeT := time.Unix(beginTime/1000/1000/1000, 0)
				beginIndex := 0
				endIndex := 100
				var matches []apiclient.MatchReference
				for {
					opts := apiclient.GetMatchlistOptions{Queue: queues, BeginTime: &beginTimeT, BeginIndex: &beginIndex, EndIndex: &endIndex}
					matchlist, err := aggregator.client.GetMatchlist(ctx, region, summoner.AccountID, &opts)
					if err != nil {
						if err != apiclient.ErrDataNotFound {
							println("error getting matchlist:", err)
						} else {
							break // We've reached the end of the matchlist.
						}
					}
					if len(matchlist.Matches) == 0 {
						break
					}

					for _, match := range matchlist.Matches {
						println(match.Timestamp.Time().UnixNano(), beginTime)
						if match.Timestamp.Time().UnixNano() >= beginTime {
							matches = append(matches, match)
						}
					}
					beginIndex += 100
					endIndex += 100
				}
				println("Length of matches:", len(matches))
				println(summoner.Name)
				break
			}
		}
		println("return nil")
	*/
	return nil

	// For each player, download their matches (only KDA, champion, and win info) into the database.

	// For each match in the database, update all player stats and store it in the database.
}
