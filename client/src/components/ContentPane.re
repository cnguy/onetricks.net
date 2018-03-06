let component = ReasonReact.statelessComponent("ContentPane");

let make =
    (
      ~isMultipleRegionsFilterOn,
      ~regions,
      ~allPlayers,
      ~challengers,
      ~masters,
      ~regionInfoText,
      ~shouldShowChampions,
      ~areChampionPanesMerged,
      ~setDisplayValue,
      ~renderEmptyResults,
      ~getPlayers,
      ~handleImageLoad,
      _children
    ) => {
  ...component,
  render: _self =>
    <div style=(ReactDOMRe.Style.make(~display=setDisplayValue(), ()))>
      (
        if (isMultipleRegionsFilterOn && Array.length(regions) == 0) {
          <div className="empty-results">
            (ReasonReact.stringToElement("No region is selected."))
          </div>;
        } else {
          ReasonReact.nullElement;
        }
      )
      (
        if (shouldShowChampions) {
          if (areChampionPanesMerged) {
            if (Array.length(allPlayers) > 0) {
              <div className="content-pane merged-pane">
                <div className="rank-pane">
                  <h5 className="rank-header">
                    (
                      ReasonReact.stringToElement(
                        "Challenger/Master One Trick Ponies in "
                        ++ regionInfoText
                      )
                    )
                  </h5>
                  <ChampionPane
                    champions=allPlayers
                    getPlayers
                    handleImageLoad
                  />
                </div>
              </div>;
            } else {
              renderEmptyResults();
            };
          } else if (Array.length(challengers) == 0
                     && Array.length(masters) == 0) {
            renderEmptyResults();
          } else {
            <div className="content-pane separated-pane">
              (
                if (Array.length(challengers) > 0) {
                  <div className="rank-pane challengers-pane">
                    <h5 className="rank-header">
                      (
                        ReasonReact.stringToElement(
                          "Challenger One Trick Ponies in " ++ regionInfoText
                        )
                      )
                    </h5>
                    <ChampionPane
                      champions=challengers
                      getPlayers
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
                          "Masters One Trick Ponies in " ++ regionInfoText
                        )
                      )
                    </h5>
                    <ChampionPane
                      champions=masters
                      getPlayers
                      handleImageLoad
                    />
                  </div>;
                } else {
                  ReasonReact.nullElement;
                }
              )
            </div>;
          };
        } else {
          ReasonReact.nullElement;
        }
      )
    </div>
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~isMultipleRegionsFilterOn=jsProps##advFilter,
      ~regions=jsProps##regions,
      ~allPlayers=jsProps##all,
      ~challengers=jsProps##challengers,
      ~masters=jsProps##masters,
      ~regionInfoText=jsProps##regionInfoText,
      ~shouldShowChampions=jsProps##showChamps,
      ~areChampionPanesMerged=jsProps##merged,
      ~handleImageLoad=jsProps##handleImageLoad,
      ~getPlayers=jsProps##getPlayers,
      ~renderEmptyResults=jsProps##renderEmptyResults,
      ~setDisplayValue=jsProps##setDisplayValue,
      jsProps##children
    )
  );