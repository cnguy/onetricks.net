let component = ReasonReact.statelessComponent("QA");

let qStr = q => ReasonReact.stringToElement("Q: " ++ q);

let aStr = a => ReasonReact.stringToElement("A: " ++ a);

let make = (~question, ~answer, _children) => {
  ...component,
  render: _self =>
    <div className="qa-item">
      <h4 className="question"> (qStr(question)) </h4>
      <div className="answer"> (aStr(answer)) </div>
    </div>
};