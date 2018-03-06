let sanitize = a => String.trim(String.lowercase(a));

let none = list => list;

let namePredicate = (a: JsTypes.player, b) => {

  let nameA = sanitize(a##name);
  let nameB = sanitize(b##name);
  if (nameA < nameB) {
    (-1);
  } else if (nameA == nameB) {
    0;
  } else {
    1;
  };
};

let rankPredicate = (a: JsTypes.player, b) =>
  if (a##rank < b##rank) {
    (-1);
  } else if (a##rank == b##rank) {
    namePredicate(a, b);
  } else {
    1;
  };

let regionPredicate = (a: JsTypes.player, b) =>
  if (a##region < b##region) {
    (-1);
  } else if (a##region == b##region) {
    rankPredicate(a, b);
  } else {
    1;
  };

let winsPredicate = (a: JsTypes.player, b) =>
  if (a##wins < b##wins) {
    (-1);
  } else if (a##wins == b##wins) {
    rankPredicate(a, b);
  } else {
    1;
  };

let lossesPredicate = (a: JsTypes.player, b) =>
  if (a##losses < b##losses) {
    (-1);
  } else if (a##losses == b##losses) {
    rankPredicate(a, b);
  } else {
    1;
  };

let winRatePredicate = (a: JsTypes.player, b) => {
  let winsAF = Pervasives.float_of_int(a##wins);
  let lossesAF = Pervasives.float_of_int(a##losses);
  let winsBF = Pervasives.float_of_int(b##wins);
  let lossesBF = Pervasives.float_of_int(b##losses);
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

let name = (list: list(JsTypes.player)) => List.sort(namePredicate, list);

let rank = (list: list(JsTypes.player)) : list(JsTypes.player) =>
  List.sort(rankPredicate, list);

let region = (list: list(JsTypes.player)) : list(JsTypes.player) =>
  List.sort(regionPredicate, list);

let wins = (list: list(JsTypes.player)) => List.sort(winsPredicate, list);

let losses = (list: list(JsTypes.player)) => List.sort(lossesPredicate, list);

let winRate = (list: list(JsTypes.player)) : list(JsTypes.player) =>
  List.sort(winRatePredicate, list);