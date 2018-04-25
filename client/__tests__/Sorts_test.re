open Jest;

open Types;

let mock_Aatrox = {
  champion: "Aatrox",
  players: [
    {
      championName: "Aatrox",
      id: 69234,
      name: "Bob",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 100,
      losses: 1,
    },
  ],
};

let mock_Aatrox2 = {
  champion: "Aatrox",
  players: [
    {
      championName: "Aatrox",
      id: 69234,
      name: "Bob",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 1,
      losses: 100,
    },
  ],
};

let mock_Aatrox3 = {
  champion: "Aatrox",
  players: [
    {
      championName: "Aatrox",
      id: 69234,
      name: "Bob",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 1,
      losses: 100,
    },
    {
      championName: "Aatrox",
      id: 69234,
      name: "Bob",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 1,
      losses: 100,
    },
  ],
};

let mock_Bard = {
  champion: "Bard",
  players: [
    {
      championName: "Bard",
      id: 69234,
      name: "Levi",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 1,
      losses: 100,
    },
  ],
};

let mock_Kindred = {
  champion: "Kindred",
  players: [
    {
      championName: "Kindred",
      id: 69234,
      name: "Chaser",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 50,
      losses: 20,
    },
  ],
};

let mock_Kindred2 = {
  champion: "Kindred",
  players: [
    {
      championName: "Kindred",
      id: 69234,
      name: "Chaser",
      rank: Rank.Challenger,
      region: Region.NorthAmerica,
      wins: 50,
      losses: 20,
    },
    {
      championName: "Kindred",
      id: 123213,
      name: "Chaullenger",
      rank: Rank.Masters,
      region: Region.EuropeWest,
      wins: 9999,
      losses: 5000,
    },
  ],
};

describe("Sorts", () => {
  Expect.(
    test("by length", () =>
      expect(Sorts.numberOfOneTricks([mock_Bard, mock_Aatrox, mock_Kindred]))
      |> toEqual([mock_Aatrox, mock_Bard, mock_Kindred])
    )
  );
  Expect.(
    test("by length lexigraphically", () =>
      expect(
        Sorts.numberOfOneTricks([
          mock_Bard,
          mock_Aatrox,
          mock_Kindred2,
          mock_Aatrox3,
        ]),
      )
      |> toEqual([mock_Aatrox3, mock_Kindred2, mock_Aatrox, mock_Bard])
    )
  );
  Expect.(
    test("by winrate", () =>
      expect(
        Sorts.oneTricksByWinRate([mock_Bard, mock_Aatrox, mock_Kindred]),
      )
      |> toEqual([mock_Aatrox, mock_Kindred, mock_Bard])
    )
  );
  Expect.(
    test("by winrate lexigraphically", () =>
      expect(
        Sorts.oneTricksByWinRate([mock_Bard, mock_Aatrox2, mock_Kindred]),
      )
      |> toEqual([mock_Kindred, mock_Aatrox2, mock_Bard])
    )
  );
});