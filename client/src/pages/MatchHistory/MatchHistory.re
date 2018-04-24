open Types;

type action =
  | SetMatches(option(miniGameRecords));

type state = {
  matches: option(miniGameRecords),
  /* Note that isLoading does not reset back to false on regions change at the moment. */
  isLoading: bool,
};

let component = ReasonReact.reducerComponent("MatchHistory");

module Styles = {
  open Css;
  let table =
    style([
      textAlign(`left),
      tableLayout(`auto),
      media(
        "only screen and (min-width: 768px)",
        [textAlign(`left), width(`percent(100.))],
      ),
    ]);
  let icon =
    style([
      width(px(25)),
      height(px(25)),
      media(
        "only screen and (min-width: 768px)",
        [width(px(35)), height(px(35))],
      ),
    ]);
  let rowWin = style([backgroundColor(green)]);
  let rowLose = style([backgroundColor(red)]);
};

let make =
    (
      ~championName: string,
      ~ranks: Rank.ranks,
      ~regions: Region.regions,
      _children,
    ) => {
  let update = cb =>
    OneTricksService.getChampionIdFromName(championName, championId =>
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
      | SetMatches(matches) =>
        ReasonReact.Update({matches, isLoading: false})
      },
    didMount: self => {
      update(p => self.send(SetMatches(p)));
      NoUpdate;
    },
    willReceiveProps: self => {
      update(p => self.send(SetMatches(p)));
      self.state;
    },
    render: self =>
      switch (self.state.isLoading, self.state.matches) {
      | (false, Some([])) =>
        ReactUtils.ste(
          "No games found. Either there are no one tricks playing this champion in this region or set of regions, or the current players probably do not play their one trick champions anymore.",
        )
      | (false, Some(matches)) =>
        <table className=Styles.table>
          <thead>
            <tr>
              <th> (ReactUtils.ste("Region")) </th>
              <th> (ReactUtils.ste("Name")) </th>
              <th> (ReactUtils.ste("KDA")) </th>
              <th />
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            (
              ReactUtils.lte(
                matches
                |> List.map(el =>
                     <tr
                       key=(string_of_int(el.gameId))
                       className=(el.didWin ? Styles.rowWin : Styles.rowLose)>
                       <td>
                         (
                           ReactUtils.ste(
                             el.region |> Region.toString |> String.uppercase,
                           )
                         )
                       </td>
                       <td> (ReactUtils.ste(el.name)) </td>
                       <td>
                         (
                           ReactUtils.ste(
                             (el.kda.kills |> string_of_int)
                             ++ "/"
                             ++ (el.kda.deaths |> string_of_int)
                             ++ "/"
                             ++ (el.kda.assists |> string_of_int),
                           )
                         )
                       </td>
                       <td>
                         <S3Image
                           kind=S3Image.ActualPerk
                           itemId=el.perks.perk0
                           className=Styles.icon
                         />
                         <S3Image
                           kind=S3Image.PerkStyle
                           itemId=el.perks.perkSubStyle
                           className=Styles.icon
                         />
                       </td>
                       <td>
                         (
                           ReactUtils.lte(
                             el.items
                             |> List.mapi((index, item) =>
                                  if (item != 0) {
                                    <S3Image
                                      kind=S3Image.Item
                                      itemId=item
                                      className=Styles.icon
                                      key=(
                                        string_of_int(el.gameId)
                                        ++ "-"
                                        ++ string_of_int(item)
                                        ++ "-"
                                        ++ string_of_int(index)
                                      )
                                    />;
                                  } else {
                                    ReasonReact.nullElement;
                                  }
                                ),
                           )
                         )
                       </td>
                       <td>
                         <S3Image
                           kind=S3Image.Item
                           itemId=el.trinket
                           className=Styles.icon
                         />
                       </td>
                       <td>
                         <S3Image
                           kind=S3Image.SummonerSpell
                           itemId=el.summonerSpells.d
                           className=Styles.icon
                         />
                         <S3Image
                           kind=S3Image.SummonerSpell
                           itemId=el.summonerSpells.f
                           className=Styles.icon
                         />
                       </td>
                     </tr>
                   ),
              )
            )
          </tbody>
        </table>
      | (false, None) =>
        ReactUtils.ste(
          "There was an error with the server. Sorry about this! It'll probably be fixed by the next day.",
        )
      | (true, _) =>
        ReactUtils.ste(
          "Currently loading match history! Please wait. This might take a while if the data is uncached.",
        )
      },
  };
};