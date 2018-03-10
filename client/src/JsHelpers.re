let extractPlayers =
    (~currentChampion: string, listOfOneTricks: array(JsTypes.oneTrick)) => {
  let target =
    List.filter(
      (el: JsTypes.oneTrick) =>
        Utils.parseChampionNameFromRoute(el##champion) === currentChampion,
      Array.to_list(listOfOneTricks),
    );
  if (List.length(target) === 1) {
    Array.of_list(target)[0]##players;
  } else {
    [||];
  };
};

let filterPlayersByRank =
    (oneTricks: array(JsTypes.oneTrick), ~rank: Rank.rank) => {
  let char =
    switch (rank) {
    | Rank.Challenger => "c"
    | Rank.Masters => "m"
    | _ => "" /* eh */
    };
  if (char == "") {
    oneTricks;
  } else {
    oneTricks
    |> Array.to_list
    |> List.map(el => {
         let newPlayers =
           el##players
           |> Array.to_list
           |> List.filter((player: JsTypes.player) => player##rank === char);
         {"players": Array.of_list(newPlayers), "champion": el##champion};
       })
    |> List.filter(el => Array.length(el##players) > 0)
    |> Array.of_list;
  };
};