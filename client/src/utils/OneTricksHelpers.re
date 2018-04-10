open Types;

let extractPlayers = (~currentChampion: string, listOfOneTricks) => {
  let target =
    List.filter(
      el => String.lowercase(el.champion) === currentChampion,
      listOfOneTricks,
    );
  if (List.length(target) === 1) {
    (target |> List.hd).players;
  } else {
    [];
  };
};

let filterPlayersByRank = (oneTricks, ~rank: Rank.rank) =>
  if (Rank.toString(rank) == "") {
    oneTricks;
  } else {
    oneTricks
    |> List.map(el => {
         let newPlayers =
           el.players |> List.filter(player => player.rank === rank);
         {champion: el.champion, players: newPlayers};
       })
    |> List.filter(el => List.length(el.players) > 0);
  };

let filterBySearchKey = (searchKey: string, oneTricks) =>
  if (String.length(searchKey) > 0) {
    oneTricks
    |> List.filter(oneTrick => {
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

let capitalize: string => string = [%bs.raw
  {|
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1, string.length)
  }
  |}
];

let capitalizeChampion = (name: string) => capitalize(name);