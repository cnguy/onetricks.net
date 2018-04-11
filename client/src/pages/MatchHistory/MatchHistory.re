open Types;

type action =
  | SetMatches(miniGameRecords);

type state = {matches: miniGameRecords};

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
      OneTricksService.getMatchHistoryForChampionAndRegions(
        ~ranks=
          switch (ranks) {
          | [Rank.All] => [Rank.Challenger, Rank.Masters]
          | _ => ranks /* singular */
          },
        ~regions,
        ~championId,
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
    )
    |> ignore;
  {
    ...component,
    initialState: () => {matches: []},
    reducer: (action, state) =>
      switch (action) {
      | SetMatches(matches) => ReasonReact.Update({...state, matches})
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
              self.state.matches
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
      </table>,
  };
};