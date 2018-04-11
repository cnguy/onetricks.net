let component = ReasonReact.statelessComponent("Instructions");

let make = _children => {
  ...component,
  render: _self =>
    <div className="instructions flash">
      (
        ReactUtils.ste(
          "Find the best champions to one trick to high ELO in Season 8 here. Click a champion icon to find the best one trick ponies!",
        )
      )
      <br />
      <br />
      (
        ReactUtils.ste(
          "04/10/18: A basic match history implementation has been added.",
        )
      )
    </div>,
};