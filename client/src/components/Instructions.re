let component = ReasonReact.statelessComponent("Instructions");

let make = _children => {
  ...component,
  render: _self =>
    <div className="instructions flash">
      (
        ReasonReact.stringToElement(
          "Find the best champions to one trick to high ELO in Season 8 here. Click a champion icon to find the best one trick ponies!",
        )
      )
      <br />
      (
        Utils.ste(
          "Stats are currently under construction. Playerbase will be rebuilt overnight.",
        )
      )
    </div>,
};