open Types;

type action =
  | SetMatches(option(miniGameRecords));

type state = {
  matches: option(miniGameRecords),
  /* Note that isLoading does not reset back to false on regions change at the moment. */
  isLoading: bool,
};

let component = ReasonReact.reducerComponent("MatchHistory");

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
        <table className="match-history__table">
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
                       className=(
                         "match-history__table--"
                         ++ (
                           if (el.didWin) {
                             "green-win";
                           } else {
                             "red-lose";
                           }
                         )
                       )>
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
                         <img
                           src=(
                             "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/perks/actual/"
                             ++ string_of_int(el.perks.perk0)
                             ++ ".png"
                           )
                           className="match-history__icon"
                         />
                         <img
                           src=(
                             "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/perks/styles/"
                             ++ string_of_int(el.perks.perkSubStyle)
                             ++ ".png"
                           )
                           className="match-history__icon"
                         />
                       </td>
                       <td>
                         (
                           ReactUtils.lte(
                             el.items
                             |> List.mapi((index, item) =>
                                  if (item != 0) {
                                    <img
                                      className="match-history__icon"
                                      src=(
                                        "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/items/"
                                        ++ string_of_int(item)
                                        ++ ".png"
                                      )
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
                         <img
                           src=(
                             "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/items/"
                             ++ (el.trinket |> string_of_int)
                             ++ ".png"
                           )
                           className="match-history__icon"
                         />
                       </td>
                       <td>
                         <img
                           src=(
                             "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/summoner-spells/"
                             ++ string_of_int(el.summonerSpells.d)
                             ++ ".png"
                           )
                           className="match-history__icon"
                         />
                         <img
                           src=(
                             "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/summoner-spells/"
                             ++ string_of_int(el.summonerSpells.f)
                             ++ ".png"
                           )
                           className="match-history__icon"
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