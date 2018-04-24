let component = ReasonReact.statelessComponent("Copyright");

let disclaimerEl =
  ReasonReact.stringToElement(
    "This web app isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.\nLeague of Legends \169 Riot Games, Inc. This product is not endorsed, certified\nor otherwise approved in any way by op.gg, and lolking or any of their\naffiliates. All game data is powered by Riot's API. ",
  ); /* notice space */

let make = _children => {
  ...component,
  render: _self =>
    <div className="copyright">
      disclaimerEl
      <a
        href="https://github.com/ChauTNguyen/OneTricks"
        rel="noopener noreferrer"
        target="_blank"
        id="src-code">
        (ReasonReact.stringToElement("src code"))
      </a>
    </div>,
};