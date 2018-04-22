let component = ReasonReact.statelessComponent("ChampIcon");

let getIcon: string => string = [%bs.raw
  {| function (name) {
      // Still have to handle default case somehow... Ideally
      // pure CSS solution?
      return 'https://media.onetricks.net/' + name.toLowerCase() + 'square-min.png'
}
|}
];

let make = (~name, ~mini, _children) => {
  ...component,
  render: _self => {
    let miniCN = if (mini) {"mini-"} else {""};
    let imgCN = miniCN ++ "champ-icon";
    let championIconPath = getIcon(name);
    <img
      className=imgCN
      src=championIconPath
      alt=(name ++ " " ++ "One Trick Pony/Ponies")
    />;
  },
};