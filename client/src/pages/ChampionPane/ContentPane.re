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
            (ReasonReact.stringToElement("No region is selected."))
          </div>;
        } else {
          ReasonReact.nullElement;
        }
      )
      (
        if (areChampionPanesMerged) {
          if (List.length(allPlayers) > 0) {
            <div className="content-pane merged-pane">
              <div className="rank-pane">
                <h5 className="rank-header">
                  (
                    ReasonReact.stringToElement(
                      "Challenger/Master One Trick Ponies in "
                      ++ regionInfoText,
                    )
                  )
                </h5>
                <ChampionPane champions=allPlayers />
              </div>
            </div>;
          } else {
            ReasonReact.nullElement;
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
            ReasonReact.nullElement;
          } else {
            <div className="content-pane separated-pane">
              (
                if (List.length(challengers) > 0) {
                  <div className="rank-pane challengers-pane">
                    <h5 className="rank-header">
                      (
                        ReasonReact.stringToElement(
                          "Challenger One Trick Ponies in " ++ regionInfoText,
                        )
                      )
                    </h5>
                    <ChampionPane
                      champions=challengers
                      leagueType=Rank.Challenger
                    />
                  </div>;
                } else {
                  ReasonReact.nullElement;
                }
              )
              (
                if (List.length(masters) > 0) {
                  <div className="rank-pane masters-pane">
                    <h5 className="rank-header">
                      (
                        ReasonReact.stringToElement(
                          "Masters One Trick Ponies in " ++ regionInfoText,
                        )
                      )
                    </h5>
                    <ChampionPane champions=masters leagueType=Rank.Masters />
                  </div>;
                } else {
                  ReasonReact.nullElement;
                }
              )
            </div>;
          };
        }
      )
    </div>,
};