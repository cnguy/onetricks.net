package main

import (
	"context"
	"net/http"
	"sort"
	"strconv"

	"github.com/yuhanfang/riot/constants/queue"

	"github.com/yuhanfang/riot/apiclient"
	"github.com/yuhanfang/riot/constants/region"
	"github.com/yuhanfang/riot/staticdata"
)

type api struct {
	riot    apiclient.Client
	ddragon *staticdata.Client
}

type kda struct {
	Kills   int
	Deaths  int
	Assists int
}

type summonerSpells struct {
	First  int `json:"d"`
	Second int `json:"f"`
}

type perks struct {
	Perk0     int
	Perk0Var1 int
	Perk0Var2 int
	Perk0Var3 int

	Perk1     int
	Perk1Var1 int
	Perk1Var2 int
	Perk1Var3 int

	Perk2     int
	Perk2Var1 int
	Perk2Var2 int
	Perk2Var3 int

	Perk3     int
	Perk3Var1 int
	Perk3Var2 int
	Perk3Var3 int

	Perk4     int
	Perk4Var1 int
	Perk4Var2 int
	Perk4Var3 int

	Perk5     int
	Perk5Var1 int
	Perk5Var2 int
	Perk5Var3 int

	PerkPrimaryStyle int
	PerkSubStyle     int
}

type matchItem struct {
	GameID int64
	Region string
	// SummonerID string
	// AccountID string
	Name string
	// ChampionID Int
	Timestamp      int64
	Role           string
	PlatformID     string
	KDA            kda
	DidWin         bool
	Trinket        int
	SummonerSpells summonerSpells
	Perks          perks
}

func newAPI(riot apiclient.Client) *api {
	return &api{
		riot:    riot,
		ddragon: staticdata.New(http.DefaultClient),
	}
}

func (api *api) getMatchReferences(ctx context.Context, champions *staticdata.ChampionList, oneTricks []oneTrickV4, ranks []string, regions []region.Region, championID int, roles []role) ([]apiclient.MatchReference, error) {
	var (
		matches           []apiclient.MatchReference
		filteredOneTricks []oneTrickV4
	)

	// Get all the one tricks associated with the champion ID passed into the function.
	for _, oneTrick := range oneTricks {
		id, err := strconv.Atoi(champions.Data[oneTrick.Champ].Key)
		if err != nil {
			if id == championID {
				filteredOneTricks = append(filteredOneTricks, oneTrick)
			}
		}
	}

	for _, oneTrick := range filteredOneTricks {
		queue := []queue.Queue{queue.RankedSolo5x5}
		opts := &apiclient.GetMatchlistOptions{Queue: queue}
		matchlist, err := api.riot.GetMatchlist(ctx, oneTrick.Region, oneTrick.AccountID, opts)
		if err != nil {
			for _, match := range matchlist.Matches {
				// Check role and lane
				switch match.Role {
				case "TOP":
					if top.isIn(roles) {
						matches = append(matches, match)
					}
				case "JUNGLE":
					if jungle.isIn(roles) {
						matches = append(matches, match)
					}
				case "MID":
					if mid.isIn(roles) {
						matches = append(matches, match)
					}
				case "BOT_CARRY":
					if botCarry.isIn(roles) {
						matches = append(matches, match)
					}
				case "BOT_SUPPORT":
					if botSupport.isIn(roles) {
						matches = append(matches, match)
					}
				}
			}
		}
	}

	matches = matches[:100]
	sort.Slice(matches, func(i, j int) bool {
		return matches[i].Timestamp >= matches[j].Timestamp
	})

	return matches, nil
}

func (api *api) getMatches(ctx context.Context, ranks []string, regions []region.Region, championID int, roles []role) ([]matchItem, error) {
	var matchItems []matchItem
	var oneTricks []oneTrickV4
	versions, err := api.ddragon.Versions(ctx)
	if err != nil {
		// TODO: Probably default to a static version if possible.
		return nil, err
	}
	languages, err := api.ddragon.Languages(ctx)
	if err != nil {
		// TODO: Probably default to a static version if possible.
		return nil, err
	}
	champions, err := api.ddragon.Champions(ctx, versions[0], languages[0])
	ms, err := api.getMatchReferences(ctx, champions, oneTricks, ranks, regions, championID, roles)
	if err != nil {
		return nil, err
	}

	matchItems = make([]matchItem, len(ms))

	for i := range ms {
		matchItems[i] = api.parseMatch(ms[i])
	}

	return matchItems, nil
}

func (api *api) parseMatch(m apiclient.MatchReference) matchItem {
	return matchItem{}
}
