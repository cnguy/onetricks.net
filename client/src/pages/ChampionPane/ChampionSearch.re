let component = ReasonReact.statelessComponent("ChampionSearch");

module Styles = {
  open Css;
  let clearInput =
    style([
      fontSize(em(0.8)),
      display(inlineBlock),
      color(red),
      padding2(~v=em(0.), ~h=em(0.5)),
      hover([cursor(`pointer)]),
    ]);
};

let searchIcon = "http://media.onetricks.net/images/misc/search.svg";

let make = (~onChange, ~value: string, _children) => {
  ...component,
  render: _self =>
    switch (
      ReasonReact.Router.dangerouslyGetInitialUrl().path,
      ReasonReact.Router.dangerouslyGetInitialUrl().search,
    ) {
    | ([], "") =>
      <span className="champion-search">
        <img src=searchIcon className="champion-search__icon" />
        <input
          className="filter-champs"
          onChange
          value
          placeholder="Search Champions"
        />
      </span>
    | _ => ReasonReact.null
    },
};