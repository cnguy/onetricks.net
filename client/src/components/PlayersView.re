let component = ReasonReact.statelessComponent("PlayersViewRe");

type winLosses = {
  wins: int,
  losses: int
};

let getOverallWinRate = (players: list(JsTypes.player)) =>
  List.fold_left(
    (a, b: JsTypes.player) => {
      wins: a.wins + b##wins,
      losses: a.losses + b##losses
    },
    {wins: 0, losses: 0},
    players
  );

let make =
    (
      ~players: array(JsTypes.player),
      ~goBack,
      ~champ: string,
      ~show: bool,
      ~onSort: Sort.sort => unit,
      ~sortKey: Sort.sort,
      ~sortReverse: bool,
      _children
    ) => {
  ...component,
  render: _self => {
    let simpleList = Array.to_list(players);
    let sortedList =
      switch sortKey {
      | Sort.Region => Sorts.region(simpleList)
      | Sort.Rank => Sorts.rank(simpleList)
      | Sort.Name => Sorts.name(simpleList)
      | Sort.Wins => Sorts.wins(simpleList)
      | Sort.Losses => Sorts.losses(simpleList)
      | Sort.WinRate => Sorts.winRate(simpleList)
      | _ => simpleList
      };
    let finalList =
      if (sortReverse) {
        List.rev(sortedList);
      } else {
        sortedList;
      };
    let renderableList =
      List.map(
        player => <PlayerRow key=(string_of_int(player##id)) player />,
        finalList
      );
    let scores = getOverallWinRate(Array.to_list(players));
    let wins = scores.wins;
    let losses = scores.losses;
    if (show) {
      <div className="table-view">
        <div className="players-list-view fade-in">
          <span className="go-back flash" href="#" onClick=goBack>
            (ReasonReact.stringToElement("<< Back to Champions"))
          </span>
          <div className="players-table-header flash">
            (
              ReasonReact.stringToElement(string_of_int(List.length(finalList)))
            )
            (ReasonReact.stringToElement(" "))
            <ChampIcon
              name=champ
              mini=true
              handleImageLoad=((_e: ReactEventRe.Image.t) => ())
            />
            (ReasonReact.stringToElement(" "))
            (ReasonReact.stringToElement("One Trick Ponies"))
            (ReasonReact.stringToElement(" "))
            <WinRate wins losses />
          </div>
          <PlayersTable renderableList onSort sortKey sortReverse />
        </div>
      </div>;
    } else {
      ReasonReact.nullElement;
    };
  }
};