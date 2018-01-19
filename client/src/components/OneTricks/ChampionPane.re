let component = ReasonReact.statelessComponent("ChampionPane");

let make = (~champions, ~getPlayers, ~handleImageLoad) => {
  ...component,
  render: _self =>
    <div className="champs">
      (
        ReasonReact.arrayToElement(
          Array.map(
            ((championName, players)) =>
              <a
                className="champ-open-links fade-in"
                key=championName
                href="#"
                onClick=(_event => getPlayers((champions, championName)))>
                <Champion
                  name=championName
                  number=(Array.length(players))
                  handleImageLoad
                  key=championName
                />
              </a>,
            champions
          )
        )
      )
    </div>
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~champions=jsProps##champions,
      ~getPlayers=jsProps##getPlayers,
      ~handleImageLoad=jsProps##handleImageLoad
    )
  );