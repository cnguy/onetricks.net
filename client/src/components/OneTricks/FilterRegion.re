let component = ReasonReact.statelessComponent("FilterRegion");

let make = (~toggleRegion, ~toggleAdvFilter, ~regions) => {
  ...component,
  render: _self =>
    <div className="filter-bar">
      <div className="filter-row">
        <FilterBtn onClick=(_event => toggleRegion("na")) active=regions>
          ..."NA"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("kr")) active=regions>
          ..."KR"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("euw")) active=regions>
          ..."EUW"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("eune")) active=regions>
          ..."EUNE"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("lan")) active=regions>
          ..."LAN"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("las")) active=regions>
          ..."LAS"
        </FilterBtn>
      </div>
      <div className="filter-row">
        <FilterBtn onClick=(_event => toggleRegion("br")) active=regions>
          ..."BR"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("jp")) active=regions>
          ..."JP"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("ru")) active=regions>
          ..."RU"
        </FilterBtn>
        <FilterBtn onClick=(_event => toggleRegion("oce")) active=regions>
          ..."OCE"
        </FilterBtn>
        <button
          className="close-adv-filter" onClick=(_event => toggleAdvFilter())>
          (ReasonReact.stringToElement("Close"))
        </button>
      </div>
    </div>
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~toggleRegion=jsProps##toggleRegion,
      ~toggleAdvFilter=jsProps##toggleAdvFilter,
      ~regions=jsProps##regions
    )
  );