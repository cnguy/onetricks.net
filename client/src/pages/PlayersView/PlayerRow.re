let component = ReasonReact.statelessComponent("PlayerRow");

let challengerIcon: string = [%bs.raw
  {| require('../../assets/rank-icons/challengers.png') |}
];

let mastersIcon: string = [%bs.raw
  {| require('../../assets/rank-icons/masters.png') |}
];

let getRankIcon = (~rank) =>
  if (rank == "c") {
    challengerIcon;
  } else {
    mastersIcon /* Obviously not good if we have multiple ranks. */;
  };

let getRankImage = rank =>
  <img className="player-rank-icon" src=(getRankIcon(~rank)) alt="rank" />;

let generateOpGGLink = (region, name) =>
  if (region == "kr") {
    "http://www.op.gg/summoner/userName=" ++ name;
  } else {
    "https://" ++ region ++ ".op.gg/summoner/userName=" ++ name;
  };

let generateLink = (name, region, opgg, id) =>
  if (opgg) {
    generateOpGGLink(region, name);
  } else {
    "http://www.lolking.net/summoner/" ++ region ++ "/" ++ id ++ "/" ++ name;
  };

let make = (~number: int, ~player: Types.player, _children) => {
  ...component,
  render: _self =>
    <tr className="players-table-tr">
      <td className="players-table-td__row-number">
        (ReactUtils.ite(number))
      </td>
      <td className="players-table-td">
        (
          player.region |> Region.toString |> String.uppercase |> ReactUtils.ste
        )
      </td>
      <td className="players-table-td">
        (player.rank |> Rank.toString |> getRankImage)
      </td>
      <td className="players-table-td">
        <a
          className="table-player-link"
          href=(
            generateLink(
              player.name,
              player.region |> Region.toString,
              true,
              string_of_int(player.id),
            )
          )
          target="_blank"
          rel="noopener noreferrer">
          (ReactUtils.ste(player.name))
        </a>
      </td>
      <td
        className="players-table-td"
        style=(ReactDOMRe.Style.make(~color="#98fb98", ()))>
        (ReactUtils.ste(string_of_int(player.wins)))
      </td>
      <td
        className="players-table-td"
        style=(ReactDOMRe.Style.make(~color="#ff6961", ()))>
        (ReactUtils.ste(string_of_int(player.losses)))
      </td>
      <td className="players-table-td">
        <WinRate wins=player.wins losses=player.losses />
      </td>
      <td className="players-table-td">
        <a
          className="table-player-link"
          href=(
            generateLink(
              player.name,
              player.region |> Region.toString,
              true,
              string_of_int(player.id),
            )
          )
          target="_blank"
          rel="noopener noreferrer">
          (player.region |> Region.toString |> ReactUtils.ste)
        </a>
      </td>
      <td className="players-table-td">
        <a
          className="table-player-link"
          href=(
            generateLink(
              player.name,
              player.region |> Region.toString,
              false,
              string_of_int(player.id),
            )
          )
          target="_blank"
          rel="noopener noreferrer">
          (ReactUtils.ste("go"))
        </a>
      </td>
    </tr>,
};
