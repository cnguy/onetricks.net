open Types;

let extractPlayers = (~currentChampion: string, listOfOneTricks) => {
  let target =
    List.filter(
      el => String.lowercase(el.champion) === currentChampion,
      listOfOneTricks,
    );
  if (List.length(target) === 1) {
    (target |> List.hd).players;
  } else {
    [];
  };
};

/*
 /* filterByMultiplePredicates allows us to partition a list into a list of
    n lists. It is done imperatively for performance, and because
    it is actually easier to implement it that way. */
 let filterByMultiplePredicates =
     (~oneTricks: list(oneTricks), predicates: list(oneTricks => bool)) => {
   /*
      Firstly, start by imperatively looping over oneTricks.
      Then, for each predicate, create a new "bucket". If
      a oneTrick is true under this predicate, put it in that predicate's bucket.

      You put it in nth bucket based on the nth predicate. Therefore, we need indices.
    */
   let buckets: ref(array(oneTricks)) = ref([||]);
   let predicatesLength = List.length(predicates);
   for (_ in 0 to predicatesLength) {
     buckets.contents = Array.append(buckets.contents, [||]);
   };
   let oneTricks = oneTricks |> Array.of_list;
   let predicates = predicates |> Array.of_list;
   let oneTricksLength = Array.length(oneTricks);
   for (i in 0 to oneTricksLength) {
     for (j in 0 to predicatesLength) {
       if ((predicates[j])(oneTricks[i])) {
         buckets.contents[j] = Array.append(buckets.contents[j], oneTricks[i]);
       };
     };
   };
   buckets;
 };*/

let filterPlayersByRank = (oneTricks, ~rank: Rank.rank) =>
  if (Rank.toString(rank) == "") {
    oneTricks;
  } else {
    oneTricks
    |> List.map(el => {
         let newPlayers =
           el.players |> List.filter(player => player.rank === rank);
         {champion: el.champion, players: newPlayers};
       })
    |> List.filter(el => List.length(el.players) > 0);
  };

let filterBySearchKey = (searchKey: string, oneTricks) =>
  if (String.length(searchKey) > 0) {
    oneTricks
    |> List.filter(oneTrick => {
         let string = String.lowercase(oneTrick.champion);
         let substring = String.lowercase(searchKey);
         let jsIndexOf: (string, string) => int = [%bs.raw
           {|
          function indexOf(string, substring) {
            return string.indexOf(substring);
          }
        |}
         ];
         jsIndexOf(string, substring) !== (-1);
       });
  } else {
    oneTricks;
  };

let capitalize: string => string = [%bs.raw
  {|
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1, string.length)
  }
  |}
];

let capitalizeChampion = (name: string) => capitalize(name);