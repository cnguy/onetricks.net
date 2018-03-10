let component = ReasonReact.statelessComponent("ContentPane");

let make =
    (
      ~isMultiRegionFilterOn: bool,
      ~regions,
      ~allPlayers,
      ~regionInfoText: string,
      ~areChampionPanesMerged,
      ~setDisplayValue,
      ~renderEmptyResults,
      ~handleImageLoad,
      ~leagueType: Rank.rank=Rank.All,
      _children,
    ) => {
  ...component,
  render: _self =>
    <div style=(ReactDOMRe.Style.make(~display=setDisplayValue(), ()))>
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
          if (Array.length(allPlayers) > 0) {
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
                <ChampionPane champions=allPlayers handleImageLoad />
              </div>
            </div>;
          } else {
            renderEmptyResults();
          };
        } else {
          let challengers: array(JsTypes.oneTrick) =
            JsHelpers.filterPlayersByRank(allPlayers, ~rank=Rank.Challenger);
          let masters: array(JsTypes.oneTrick) =
            JsHelpers.filterPlayersByRank(allPlayers, ~rank=Rank.Masters);
          if (Array.length(challengers) === 0 && Array.length(masters) === 0) {
            renderEmptyResults();
          } else {
            <div className="content-pane separated-pane">
              (
                if (Array.length(challengers) > 0) {
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
                      handleImageLoad
                    />
                  </div>;
                } else {
                  ReasonReact.nullElement;
                }
              )
              (
                if (Array.length(masters) > 0) {
                  <div className="rank-pane masters-pane">
                    <h5 className="rank-header">
                      (
                        ReasonReact.stringToElement(
                          "Masters One Trick Ponies in " ++ regionInfoText,
                        )
                      )
                    </h5>
                    <ChampionPane
                      champions=masters
                      leagueType=Rank.Masters
                      handleImageLoad
                    />
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