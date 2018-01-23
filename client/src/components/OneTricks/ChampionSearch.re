let component = ReasonReact.statelessComponent("ChampionSearch");

let make = (~onChange, ~value, ~resetSearchKey, _children) => {
  ...component,
  render: _self =>
    <span className="champion-search-wrapper-kms">
      <input
        className="filter-champs"
        onChange
        value
        placeholder=">> FILTER <<"
      />
      <span className="clear-input" onClick=resetSearchKey>
        (ReasonReact.stringToElement({js|✗|js}))
      </span>
    </span>
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~onChange=jsProps##onChange,
      ~value=jsProps##value,
      ~resetSearchKey=jsProps##resetSearchKey,
      jsProps##children
    )
  );