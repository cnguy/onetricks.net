open Types;

let component = ReasonReact.statelessComponent("PlayersViewRe");

module Styles = {
  open Css;
  let container =
    style([backgroundColor(hex("37474F")), padding(px(10))]);
  let header = style([fontSize(em(1.5)), padding2(~v=em(0.8), ~h=`zero)]);
};

type winLosses = {
  wins: int,
  losses: int,
};

let getOverallWinRate = (players: players) =>
  players
  |> List.fold_left(
       (a: winLosses, b: player) => {
         wins: a.wins + b.wins,
         losses: a.losses + b.losses,
       },
       {wins: 0, losses: 0},
     );

let make =
    (
      ~players: players,
      ~champ: string,
      ~show: bool,
      ~onSort: Sort.sort => unit,
      ~sortKey: Sort.sort,
      ~sortReverse: bool,
      ~ranks: Rank.ranks,
      ~regions: Region.regions,
      _children,
    ) => {
  /* This is used to preemptively cache data. */
  OneTricksService.getChampionIdFromName(champ, championId =>
    switch (championId) {
    | Some(id) =>
      OneTricksService.getMatchHistoryForChampionAndRegions(
        ~ranks=
          switch (ranks) {
          | [Rank.All] => [Rank.Challenger, Rank.Masters]
          | _ => ranks /* singular */
          },
        ~regions,
        ~championId=id,
        ~roles=[
          Role.Top,
          Role.Middle,
          Role.Jungle,
          Role.DuoCarry,
          Role.Support,
        ],
        _payload =>
        ()
      )
    | None => ()
    }
  )
  |> ignore;
  {
    ...component,
    render: _self => {
      let simpleList = players;
      let sortedList =
        simpleList
        |> (
          switch (sortKey) {
          | Sort.Region => Sorts.region
          | Sort.Rank => Sorts.rank
          | Sort.Name => Sorts.name
          | Sort.Wins => Sorts.wins
          | Sort.Losses => Sorts.losses
          | Sort.WinRate => Sorts.winRate
          | _ => Sorts.id
          }
        );
      let finalList =
        if (sortReverse) {
          List.rev(sortedList);
        } else {
          sortedList;
        };
      let renderableList =
        finalList
        |> List.mapi((index, player) =>
             <PlayerRow
               key=(string_of_int(player.id))
               number=(index + 1)
               player
             />
           );
      let scores = players |> getOverallWinRate;
      let wins = scores.wins;
      let losses = scores.losses;
      if (show) {
        <div className=Styles.container>
          <div className=Styles.header>
            (
              ReasonReact.stringToElement(
                string_of_int(List.length(finalList)),
              )
            )
            (ReasonReact.stringToElement(" "))
            <ChampIcon name=champ mini=true />
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
    },
  };
};