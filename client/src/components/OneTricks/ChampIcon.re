let component = ReasonReact.statelessComponent("ChampIcon");

let getIcon: string => string = [%bs.raw
  {| function (name) {
    try {
      return require(`../../assets/champ-icons/min/${name.toLowerCase()}square-min.png`)
    } catch (ex) {
      return require('../../assets/champ-icons/min/questionmark.png')
    }
}
|}
];

let make =
    (~name, ~mini, ~handleImageLoad: ReactEventRe.Image.t => unit, _children) => {
  ...component,
  render: _self => {
    let miniCN = if (mini) {"mini-"} else {""};
    let imgCN = miniCN ++ "champ-icon";
    let championIconPath = getIcon(name);
    <img
      className=imgCN
      src=championIconPath
      onLoad=handleImageLoad
      alt=(name ++ " " ++ "One Trick Pony/Ponies")
    />;
  }
};

/* TODO: PlayersView is still in JS */
let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~name=jsProps##name,
      ~mini=jsProps##mini,
      ~handleImageLoad=jsProps##handleImageLoad,
      jsProps##children
    )
  );