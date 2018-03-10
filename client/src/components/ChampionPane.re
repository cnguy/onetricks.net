let component = ReasonReact.statelessComponent("ChampionPane");

let make =
    (~champions, ~handleImageLoad, ~leagueType: Rank.rank=Rank.All, _children) => {
  ...component,
  render: _self =>
    <div className="champs">
      (
        ReasonReact.arrayToElement(
          Array.map(
            pair =>
              <span
                className="champ-open-links fade-in"
                key=pair##champion
                href="#"
                onClick=(
                  _event =>
                    ReasonReact.Router.push(
                      "/champions/"
                      ++ Utils.parseChampionNameFromRoute(pair##champion)
                      ++ Rank.toRoute(leagueType),
                    )
                )>
                <Champion
                  name=pair##champion
                  number=(Array.length(pair##players))
                  handleImageLoad
                  key=pair##champion
                />
              </span>,
            champions,
          ),
        )
      )
    </div>,
};