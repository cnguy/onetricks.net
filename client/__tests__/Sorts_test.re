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

describe("Sorts", () => {
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