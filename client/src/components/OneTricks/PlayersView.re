let component = ReasonReact.statelessComponent("PlayersViewRe");

type winLosses = {
  wins: int,
  losses: int
};

let getOverallWinRate = (players: list(Types.player)) =>
  List.fold_left(
    (a, b: Types.player) => {
      wins: a.wins + b##wins,
      losses: a.losses + b##losses
    },
    {wins: 0, losses: 0},
    players
  );

let make =
    (
      ~players: array(Types.player),
      ~goBack,
      ~champ: string,
      ~show: bool,
      ~onSort: string => unit,
      ~sortKey: string,
      ~sortReverse: bool
    ) => {
  ...component,
  render: _self => {
    let sortedList = Array.to_list(players);
    let renderableList = List.map(player => <PlayerRow player />, sortedList);
    let scores = getOverallWinRate(Array.to_list(players));
    let wins = scores.wins;
    let losses = scores.losses;
    if (show) {
      <div className="players-list-view fade-in">
        <a className="go-back flash" href="#" onClick=goBack>
          (ReasonReact.stringToElement("<< Back to Champions"))
        </a>
        <div className="players-table-header flash">
          (
            ReasonReact.stringToElement(
              string_of_int(List.length(Array.to_list(players)))
            )
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
      </div>;
    } else {
      ReasonReact.nullElement;
    };
  }
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~players=jsProps##players,
      ~goBack=jsProps##goBack,
      ~champ=jsProps##champ,
      ~show=jsProps##show,
      ~onSort=jsProps##onSort,
      ~sortKey=jsProps##sortKey,
      ~sortReverse=jsProps##sortReverse
    )
  );