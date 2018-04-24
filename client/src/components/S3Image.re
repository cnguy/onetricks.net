let component = ReasonReact.statelessComponent("S3Image");

type kind =
  | Item
  | ActualPerk
  | PerkStyle
  | SummonerSpell;

let make = (~kind: kind, ~itemId: int, ~className="", ~key="", _children) => {
  ...component,
  render: _self =>
    <img
      src=(
        "https://s3-us-west-1.amazonaws.com/media.onetricks.net/images/"
        ++ (
          switch (kind) {
          | Item => "items"
          | SummonerSpell => "summoner-spells"
          | ActualPerk => "perks/actual"
          | PerkStyle => "perks/styles"
          }
        )
        ++ "/"
        ++ string_of_int(itemId)
        ++ ".png"
      )
      className
      key
    />,
};