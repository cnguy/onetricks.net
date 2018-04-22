let component = ReasonReact.statelessComponent("ChampionPane");

let make = (~champions, ~leagueType: Rank.rank=Rank.All, _children) => {
  ...component,
  render: _self =>
    <div className="champs">
      (
        ReactUtils.lte(
          List.map(
            (pair: Types.oneTrick) =>
              <span
                className="champ-open-links fade-in"
                key=pair.champion
                href="#"
                onClick=(
                  _event =>
                    ReasonReact.Router.push(
                      "/champions/"
                      ++ String.lowercase(pair.champion)
                      ++ Rank.toRoute(leagueType),
                    )
                )>
                <Champion
                  name=pair.champion
                  number=(List.length(pair.players))
                  key=pair.champion
                />
              </span>,
            champions,
          ),
        )
      )
    </div>,
};