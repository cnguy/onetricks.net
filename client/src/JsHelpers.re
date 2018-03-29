let extractPlayers =
    (~currentChampion: string, listOfOneTricks: Decoder.oneTricks) => {
  let target: Decoder.oneTricks =
    List.filter(
      (el: Decoder.oneTrick) =>
        Utils.parseChampionNameFromRoute(el.champion) === currentChampion,
      listOfOneTricks,
    );
  if (List.length(target) === 1) {
    (target |> List.hd).players;
  } else {
    [];
  };
};

let filterPlayersByRank = (oneTricks: Decoder.oneTricks, ~rank: Rank.rank) =>
  if (Rank.toString(rank) == "") {
    oneTricks;
  } else {
    oneTricks
    |> List.map((el: Decoder.oneTrick) => {
         let newPlayers =
           el.players
           |> List.filter((player: Decoder.player) => player.rank === rank);
         let ot: Decoder.oneTrick = {
           champion: el.champion,
           players: newPlayers,
         };
         ot;
       })
    |> List.filter((el: Decoder.oneTrick) => List.length(el.players) > 0);
  };

let filterBySearchKey = (searchKey: string, oneTricks: Decoder.oneTricks) =>
  if (String.length(searchKey) > 0) {
    oneTricks
    |> List.filter((oneTrick: Decoder.oneTrick) => {
         let string = String.lowercase(oneTrick.champion);
         let substring = String.lowercase(searchKey);
         let jsIndexOf: (string, string) => int = [%bs.raw
           {|
          function indexOf(string, substring) {
            return string.indexOf(substring);
          }
        |}
         ];
         jsIndexOf(string, substring) !== (-1);
       });
  } else {
    oneTricks;
  };