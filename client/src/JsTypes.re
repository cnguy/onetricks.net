type player = {
  .
  "champ": string,
  "id": int,
  "losses": int,
  "name": string,
  "rank": string,
  "region": string,
  "wins": int,
  "_id": int
};

type oneTrick = {
  .
  "champion": string,
  "players": array(player)
}