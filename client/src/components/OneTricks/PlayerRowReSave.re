let component = ReasonReact.statelessComponent("PlayerRowReSave");

/*
 let challengerIcon = [%bs.raw
   {| require('../../assets/rank-icons/challengers.png') |}
 ];

 let mastersIcon = [%bs.raw
   {| require('../../assets/rank-icons/masters.png') |}
 ];
 */
/*
 let getRankIcon = rank =>
   if (rank == 'c') {
     challengerIcon;
   } else {
     mastersIcon;
   }; /* Obviously not good if we have multiple ranks. */

 let getRankImage = rank =>
   <img className="player-rank-icon" src=(getRankIcon(rank)) alt="rank" />;

 let generateOpGGLink = (region, name) =>
   if (region == "kr") {
     "http://www.op.gg/summoner/userName=" ++ name;
   } else {
     "https://" ++ region ++ "op.gg/summoner/userName=" ++ name;
   };

 let generateLink = (name, region, opgg, id) =>
   if (opgg) {
     generateOpGGLink(region, name);
   } else {
     "http://www.lolking.net/summoner/" ++ region ++ "/" ++ id ++ "/" ++ name;
   };

 */
let make = _children => {
  ...component,
  render: _self =>
    <span> <span> (ReasonReact.stringToElement("ok")) </span> </span>
};

/*
 <td> (ReasonReact.stringToElement(String.uppercase(region))) </td>
 <td>
   (getRankImage(rank))
   (ReasonReact.stringToElement(" "))
   <a
     className="table-player-link"
     href=(generateLink(name, region, true, string_of_int(id)))
     target="_blank"
     rel="noopener noreferrer">
     (ReasonReact.stringToElement(region))
   </a>
 </td>
 <td style=(ReactDOMRe.Style.make(~color="#98fb98", ()))>
   (ReasonReact.stringToElement(string_of_int(wins)))
 </td>
 <td style=(ReactDOMRe.Style.make(~color="#ff6961", ()))>
   (ReasonReact.stringToElement(string_of_int(losses)))
 </td>*/
let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make());