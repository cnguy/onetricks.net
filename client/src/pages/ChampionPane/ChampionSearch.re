let component = ReasonReact.statelessComponent("ChampionSearch");

let searchIcon: string = [%bs.raw
  {|
  require("../../assets/misc/search.svg")
|}
];

let make = (~onChange, ~value, ~resetSearchKey, _children) => {
  ...component,
  render: _self =>
    switch (
      ReasonReact.Router.dangerouslyGetInitialUrl().path,
      ReasonReact.Router.dangerouslyGetInitialUrl().search,
    ) {
    | ([], "") =>
      <span className="champion-search">
        <img src=searchIcon className="champion-search__icon" />
        <input className="filter-champs" onChange value />
        <span className="clear-input" onClick=resetSearchKey>
          (ReasonReact.stringToElement({js|✗|js}))
        </span>
      </span>
    | _ => ReasonReact.nullElement
    },
};