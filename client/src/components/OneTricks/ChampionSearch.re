let component = ReasonReact.statelessComponent("ChampionSearch");

let make = (~onChange, ~value, ~resetSearchKey, _children) => {
  ...component,
  render: _self =>
    <span className="champion-search-wrapper-kms">
      <input className="filter-champs" onChange value placeholder="..." />
      <span className="clear-input" onClick=resetSearchKey>
        (ReasonReact.stringToElement({js|✗|js}))
      </span>
    </span>
};