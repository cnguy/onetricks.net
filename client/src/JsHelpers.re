let extractPlayers =
    (~currentChampion: string, ~listOfOneTricks: array(JsTypes.oneTrick)) => {
  let target =
    List.filter(
      (el: JsTypes.oneTrick) =>
        Utils.parseChampionNameFromRoute(el##champion) === currentChampion,
      Array.to_list(listOfOneTricks)
    );
  if (List.length(target) === 1) {
    Array.of_list(target)[0]##players;
  } else {
    [||];
  };
};