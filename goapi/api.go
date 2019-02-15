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
	Perk0     int64
	Perk0Var1 int
	Perk0Var2 int
	Perk0Var3 int

	Perk1     int64
	Perk1Var1 int
	Perk1Var2 int
	Perk1Var3 int

	Perk2     int64
	Perk2Var1 int
	Perk2Var2 int
	Perk2Var3 int

	Perk3     int64
	Perk3Var1 int
	Perk3Var2 int
	Perk3Var3 int

	Perk4     int64
	Perk4Var1 int
	Perk4Var2 int
	Perk4Var3 int

	Perk5     int64
	Perk5Var1 int
	Perk5Var2 int
	Perk5Var3 int

	PerkPrimaryStyle int64
	PerkSubStyle     int64
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

func (api *api) getAndParseMatch(ctx context.Context, r region.Region, m apiclient.MatchReference, role string, summonerName string) (*matchItem, error) {
	match, err := api.riot.GetMatch(ctx, r, m.GameID)
	if err != nil {
		return nil, err
	}

	var (
		participantID       int
		kills               int
		deaths              int
		assists             int
		firstSummonerSpell  int
		secondSummonerSpell int
		trinket             int
		perk0               int64
		perk0Var1           int
		perk0Var2           int
		perk0Var3           int
		perk1               int64
		perk1Var1           int
		perk1Var2           int
		perk1Var3           int
		perk2               int64
		perk2Var1           int
		perk2Var2           int
		perk2Var3           int
		perk3               int64
		perk3Var1           int
		perk3Var2           int
		perk3Var3           int
		perk4               int64
		perk4Var1           int
		perk4Var2           int
		perk4Var3           int
		perk5               int64
		perk5Var1           int
		perk5Var2           int
		perk5Var3           int
		perkPrimaryStyle    int64
		perkSubStyle        int64
	)

	for _, p := range match.ParticipantIdentities {
		if p.Player.SummonerName == summonerName {
			participantID = p.ParticipantID
		}
	}

	for _, p := range match.Participants {
		if p.ParticipantID == participantID {
			kills = p.Stats.Kills
			deaths = p.Stats.Deaths
			assists = p.Stats.Assists
			firstSummonerSpell = p.Spell1ID
			secondSummonerSpell = p.Spell2ID
			perk0 = p.Stats.Perk0
			perk0Var1 = p.Stats.Perk0Var1
			perk0Var2 = p.Stats.Perk0Var2
			perk0Var3 = p.Stats.Perk0Var3
			perk1 = p.Stats.Perk1
			perk1Var1 = p.Stats.Perk1Var1
			perk1Var2 = p.Stats.Perk1Var2
			perk1Var3 = p.Stats.Perk1Var3
			perk2 = p.Stats.Perk2
			perk2Var1 = p.Stats.Perk2Var1
			perk2Var2 = p.Stats.Perk2Var2
			perk2Var3 = p.Stats.Perk2Var3
			perk3 = p.Stats.Perk3
			perk3Var1 = p.Stats.Perk3Var1
			perk3Var2 = p.Stats.Perk3Var2
			perk3Var3 = p.Stats.Perk3Var3
			perk4 = p.Stats.Perk4
			perk4Var1 = p.Stats.Perk4Var1
			perk4Var2 = p.Stats.Perk4Var2
			perk4Var3 = p.Stats.Perk4Var3
			perk5 = p.Stats.Perk5
			perk5Var1 = p.Stats.Perk5Var1
			perk5Var2 = p.Stats.Perk5Var2
			perk5Var3 = p.Stats.Perk5Var3
			perkPrimaryStyle = p.Stats.PerkPrimaryStyle
			perkSubStyle = p.Stats.PerkSubStyle
		}
	}

	return &matchItem{
		GameID: m.GameID,
		Region: m.PlatformID, // Convert
		// SummonerID string
		// AccountID string
		Name: summonerName,
		// ChampionID Int
		Timestamp:      m.Timestamp.Time().UnixNano(),
		Role:           role,
		KDA:            kda{Kills: kills, Assists: assists, Deaths: deaths},
		DidWin:         false,
		Trinket:        trinket,
		SummonerSpells: summonerSpells{First: firstSummonerSpell, Second: secondSummonerSpell},
		Perks: perks{
			Perk0:            perk0,
			Perk0Var1:        perk0Var1,
			Perk0Var2:        perk0Var2,
			Perk0Var3:        perk0Var3,
			Perk1:            perk1,
			Perk1Var1:        perk1Var1,
			Perk1Var2:        perk1Var2,
			Perk1Var3:        perk1Var3,
			Perk2:            perk2,
			Perk2Var1:        perk2Var1,
			Perk2Var2:        perk2Var2,
			Perk2Var3:        perk2Var3,
			Perk3:            perk3,
			Perk3Var1:        perk3Var1,
			Perk3Var2:        perk3Var2,
			Perk3Var3:        perk3Var3,
			Perk4:            perk4,
			Perk4Var1:        perk4Var1,
			Perk4Var2:        perk4Var2,
			Perk4Var3:        perk4Var3,
			Perk5:            perk5,
			Perk5Var1:        perk5Var1,
			Perk5Var2:        perk5Var2,
			Perk5Var3:        perk5Var3,
			PerkPrimaryStyle: perkPrimaryStyle,
			PerkSubStyle:     perkSubStyle,
		},
	}, nil
}

func (api *api) getMatchesInternal(ctx context.Context, champions *staticdata.ChampionList, oneTricks []oneTrickV4, ranks []string, regions []region.Region, championID int, roles []role) ([]matchItem, error) {
	var (
		matches           []matchItem
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
			for _, m := range matchlist.Matches {
				var matchReference apiclient.MatchReference

				switch m.Role {
				case "TOP":
					if top.isIn(roles) {
						matchReference = m
					}
				case "JUNGLE":
					if jungle.isIn(roles) {
						matchReference = m
					}
				case "MID":
					if mid.isIn(roles) {
						matchReference = m
					}
				case "BOT_CARRY":
					if botCarry.isIn(roles) {
						matchReference = m
					}
				case "BOT_SUPPORT":
					if botSupport.isIn(roles) {
						matchReference = m
					}
				}
				mi, err := api.getAndParseMatch(ctx, oneTrick.Region, matchReference, m.Role, oneTrick.Name)
				if err != nil {
					matches = append(matches, *mi)
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
	var (
		matchItems []matchItem
		oneTricks  []oneTrickV4
	)

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
	if err != nil {
		return nil, err
	}
	matchItems, err = api.getMatchesInternal(ctx, champions, oneTricks, ranks, regions, championID, roles)
	if err != nil {
		return nil, err
	}

	return matchItems, nil
}
