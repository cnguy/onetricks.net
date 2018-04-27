open Types;

type action =
  | SetMatches(option(miniGameRecords), bool);

type state = {
  matches: option(miniGameRecords),
  /* Note that isLoading does not reset back to false on regions change at the moment. */
  isLoading: bool,
};

let component = ReasonReact.reducerComponent("PlayersViewRe");

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
  let update = cb =>
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
          payload =>
          cb(payload)
        )
      | None => cb(None)
      }
    )
    |> ignore;
  {
    ...component,
    initialState: () => {matches: Some([]), isLoading: true},
    reducer: (action, _state) =>
      switch (action) {
      | SetMatches(matches, isLoading) =>
        ReasonReact.Update({matches, isLoading})
      },
    didMount: self => {
      update(p => self.send(SetMatches(p, false)));
      NoUpdate;
    },
    willReceiveProps: self => {
      self.send(SetMatches(self.state.matches, true)); /* unnecssary state setting but i'm sleepy */
      update(p => self.send(SetMatches(p, false)));
      self.state;
    },
    render: self => {
      let renderableList =
        players
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
        )
        |> (if (sortReverse) {List.rev} else {Sorts.id})
        |> List.mapi((index, player) =>
             <PlayerRow
               key=(string_of_int(player.id))
               number=(index + 1)
               player
             />
           );
      let {wins, losses} = players |> getOverallWinRate;
      if (show) {
        <div className=Styles.container>
          <div className=Styles.header>
            (ReactUtils.ite(List.length(renderableList)))
            (ReactUtils.ste(" "))
            <ChampIcon name=champ mini=true />
            (ReactUtils.ste(" "))
            (ReactUtils.ste("One Trick Ponies"))
            (ReactUtils.ste(" "))
            <WinRate wins losses />
            <div>
              (
                switch (self.state.isLoading, self.state.matches) {
                | (false, Some([])) =>
                  ReactUtils.ste(
                    "No games found to calculate past 100 matches stats.",
                  )
                | (false, Some(matches)) =>
                  let {wins, losses} =
                    matches
                    |> List.fold_left(
                         (t, c: Types.miniGameRecord) =>
                           c.didWin ?
                             {wins: t.wins + 1, losses: t.losses} :
                             {wins: t.wins, losses: t.losses + 1},
                         {wins: 0, losses: 0},
                       );
                  <div>
                    (
                      ReactUtils.ste(
                        "Past "
                        ++ (List.length(matches) |> string_of_int)
                        ++ " matches: ",
                      )
                    )
                    <WinRate wins losses />
                  </div>;
                | (false, None) =>
                  ReactUtils.ste(
                    "There was an error with the server. Sorry about this! It'll probably be fixed by the next day.",
                  )
                | (true, _) =>
                  ReactUtils.ste("Currently loading past games stats...")
                }
              )
            </div>
          </div>
          <PlayersTable renderableList onSort sortKey sortReverse />
        </div>;
      } else {
        ReasonReact.nullElement;
      };
    },
  };
};