let component = ReasonReact.statelessComponent("ContentPane");

let make =
    (
      ~isMultiRegionFilterOn: bool,
      ~regions,
      ~allPlayers,
      ~regionInfoText: string,
      ~areChampionPanesMerged,
      _children,
    ) => {
  ...component,
  render: _self =>
    <div>
      (
        if (isMultiRegionFilterOn && List.length(regions) == 0) {
          <div className="empty-results">
            (ReactUtils.ste("No region is selected."))
          </div>;
        } else {
          ReasonReact.null;
        }
      )
      (
        if (areChampionPanesMerged) {
          if (List.length(allPlayers) > 0) {
            <div className="content-pane merged-pane">
              <div className="rank-pane">
                <h5 className="rank-header">
                  (
                    ReactUtils.ste(
                      "Challenger & Masters One Tricks in " ++ regionInfoText,
                    )
                  )
                </h5>
                <ChampionPane champions=allPlayers />
              </div>
            </div>;
          } else {
            ReasonReact.null;
          };
        } else {
          let challengers =
            OneTricksHelpers.filterPlayersByRank(
              allPlayers,
              ~rank=Rank.Challenger,
            );
          let masters =
            OneTricksHelpers.filterPlayersByRank(
              allPlayers,
              ~rank=Rank.Masters,
            );
          if (List.length(challengers) === 0 && List.length(masters) === 0) {
            ReasonReact.null;
          } else {
            <div className="content-pane separated-pane">
              (
                if (List.length(challengers) > 0) {
                  <div className="rank-pane challengers-pane">
                    <h5 className="rank-header">
                      (
                        ReactUtils.ste(
                          "Challenger One Tricks in " ++ regionInfoText,
                        )
                      )
                    </h5>
                    <ChampionPane
                      champions=challengers
                      leagueType=Rank.Challenger
                    />
                  </div>;
                } else {
                  ReasonReact.null;
                }
              )
              (
                if (List.length(masters) > 0) {
                  <div className="rank-pane masters-pane">
                    <h5 className="rank-header">
                      (
                        ReactUtils.ste(
                          "Masters One Trick Ponies in " ++ regionInfoText,
                        )
                      )
                    </h5>
                    <ChampionPane champions=masters leagueType=Rank.Masters />
                  </div>;
                } else {
                  ReasonReact.null;
                }
              )
            </div>;
          };
        }
      )
    </div>,
};
