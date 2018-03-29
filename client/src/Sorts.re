let sanitize = a => String.trim(String.lowercase(a));

let none = list => list;

let lexiSort = (a: string, b: string) : int =>
  if (a < b) {
    (-1);
  } else if (a > b) {
    1;
  } else {
    0;
  };

let namePredicate = (a: Decoder.player, b: Decoder.player) =>
  lexiSort(a.name, b.name);

let rankPredicate = (a: Decoder.player, b: Decoder.player) =>
  if (a.rank < b.rank) {
    (-1);
  } else if (a.rank == b.rank) {
    namePredicate(a, b);
  } else {
    1;
  };

let regionPredicate = (a: Decoder.player, b: Decoder.player) =>
  if (a.region < b.region) {
    (-1);
  } else if (a.region == b.region) {
    rankPredicate(a, b);
  } else {
    1;
  };

let winsPredicate = (a: Decoder.player, b: Decoder.player) =>
  if (a.wins < b.wins) {
    (-1);
  } else if (a.wins == b.wins) {
    rankPredicate(a, b);
  } else {
    1;
  };

let lossesPredicate = (a: Decoder.player, b: Decoder.player) =>
  if (a.losses < b.losses) {
    (-1);
  } else if (a.losses == b.losses) {
    rankPredicate(a, b);
  } else {
    1;
  };

let winRatePredicate = (a: Decoder.player, b: Decoder.player) => {
  let winsAF = Pervasives.float_of_int(a.wins);
  let lossesAF = Pervasives.float_of_int(a.losses);
  let winsBF = Pervasives.float_of_int(b.wins);
  let lossesBF = Pervasives.float_of_int(b.losses);
  let winRateA = winsAF /. (winsAF +. lossesAF);
  let winRateB = winsBF /. (winsBF +. lossesBF);
  let res = winRateB -. winRateA;
  if (res < 0.0) {
    (-1);
  } else if (res == 0.0) {
    0;
  } else {
    1;
  };
};

let name = (list: Decoder.players) => List.sort(namePredicate, list);

let rank = (list: Decoder.players) => List.sort(rankPredicate, list);

let region = (list: Decoder.players) => List.sort(regionPredicate, list);

let wins = (list: Decoder.players) => List.sort(winsPredicate, list);

let losses = (list: Decoder.players) => List.sort(lossesPredicate, list);

let winRate = (list: Decoder.players) => List.sort(winRatePredicate, list);

type oneTricksListSort =
  | Number
  | WinRate;

let numberOfOneTricks = (list: Decoder.oneTricks) : Decoder.oneTricks =>
  list
  |> List.sort((a: Decoder.oneTrick, b: Decoder.oneTrick) =>
       if (List.length(a.players) > List.length(b.players)) {
         (-1);
       } else if (List.length(a.players) < List.length(b.players)) {
         1;
       } else {
         lexiSort(a.champion, b.champion);
       }
     );

type winsLosses = {
  wins: int,
  losses: int,
};

let oneTricksWinRate = (list: Decoder.players) : float => {
  let wl =
    list
    |> List.fold_left(
         (total, curr: Decoder.player) => {
           wins: total.wins + curr.wins,
           losses: total.losses + curr.losses,
         },
         {wins: 0, losses: 0},
       );
  let wins = float_of_int(wl.wins);
  wins /. (wins +. float_of_int(wl.losses));
};

let oneTricksByWinRate = (list: Decoder.oneTricks) =>
  list
  |> List.sort((a: Decoder.oneTrick, b: Decoder.oneTrick) => {
       let winRateA = oneTricksWinRate(a.players);
       let winRateB = oneTricksWinRate(b.players);
       if (winRateA > winRateB) {
         (-1);
       } else if (winRateA < winRateB) {
         1;
       } else {
         lexiSort(a.champion, b.champion);
       };
     });