let component = ReasonReact.statelessComponent("Champion");

module Styles = {
  open Css;
  let numberFont =
    style([
      display(inlineBlock),
      fontFamily("'Open sans', serif"),
      fontSize(px(20)),
    ]);
  let oneDigit = style([margin2(~v=`percent(28.), ~h=`percent(41.))]);
  let twoDigits = style([margin2(~v=`percent(28.), ~h=`percent(33.))]);
  let getDigitStyle = len => len == 1 ? oneDigit : twoDigits;
  let getNumberFont = number =>
    numberFont ++ " " ++ getDigitStyle(String.length(string_of_int(number)));
};

let make = (~name, ~number, _children) => {
  ...component,
  render: _self =>
    <div className="champ-square">
      <div className="overlay">
        <span className=(Styles.getNumberFont(number))>
          (ReactUtils.ite(number))
        </span>
      </div>
      <ChampIcon name mini=false />
    </div>,
};
