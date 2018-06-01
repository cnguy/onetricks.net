open Types;

type action =
  | SetMatches(option(miniGameRecords), bool);

type state = {
  matches: option(miniGameRecords),
  /* Note that isLoading does not reset back to false on regions change at the moment. */
  isLoading: bool,
};

module IntMap =
  Map.Make(
    {
      type t = int;
      let compare = compare;
    },
  );

module IntTupleMap =
  Map.Make(
    {
      type t = (int, int);
      let compare = compare;
    },
  );

let component = ReasonReact.reducerComponent("RunesSummonersItems");

module Styles = {
  open Css;
  let flexBox =
    style([
      media(
        "only screen and (min-width: 768px)",
        [display(`flex), flexWrap(`wrap)],
      ),
    ]);
  let stats = style([display(inlineBlock), padding2(~v=`zero, ~h=px(5))]);
  let icon =
    style([
      width(px(25)),
      height(px(25)),
      marginTop(px(10)),
      media(
        "only screen and (min-width: 768px)",
        [width(px(35)), height(px(35))],
      ),
    ]);
};

let make =
    (
      ~championName: string,
      ~ranks: Rank.ranks,
      ~regions: Region.regions,
      _children,
    ) => {
  let update = cb =>
    OneTricksService.getChampionIdFromName(championName, championId =>
      switch (championId) {
      | Some(id) =>
        OneTricksService.getMatchHistoryForChampionAndRegions(
          ~ranks=
            switch (ranks) {
            | [Rank.All] => [Rank.Challenger, Rank.Masters]
            | _ => ranks /* singular */
            },
          ~regions,
          ~championId=id,
          ~roles=[
            Role.Top,
            Role.Middle,
            Role.Jungle,
            Role.DuoCarry,
            Role.Support,
          ],
          payload =>
          cb(payload)
        )
      | None => cb(None)
      }
    )
    |> ignore;
  {
    ...component,
    initialState: () => {matches: Some([]), isLoading: true},
    reducer: (action, _state) =>
      switch (action) {
      | SetMatches(matches, isLoading) =>
        ReasonReact.Update({matches, isLoading})
      },
    didMount: self => update(p => self.send(SetMatches(p, false))),
    willReceiveProps: self => {
      self.send(SetMatches(self.state.matches, true));
      update(p => self.send(SetMatches(p, false)));
      self.state;
    },
    render: self =>
      switch (self.state.isLoading, self.state.matches) {
      | (false, Some([])) =>
        ReactUtils.ste(
          "No games found. Either there are no one tricks playing this champion in this region or set of regions, or the current players probably do not play their one trick champions anymore.",
        )
      | (false, Some(matches)) =>
        let summonerSpellsItems =
          matches
          |> List.fold_left(
               (t, c: Types.miniGameRecord) => {
                 let first = c.summonerSpells.d;
                 let second = c.summonerSpells.f;
                 let tmp =
                   t |> IntMap.mem(first) ?
                     t |> IntMap.add(first, (t |> IntMap.find(first)) + 1) :
                     t |> IntMap.add(first, 1);
                 tmp |> IntMap.mem(second) ?
                   tmp |> IntMap.add(second, (t |> IntMap.find(second)) + 1) :
                   tmp |> IntMap.add(second, 1);
               },
               IntMap.empty,
             )
          |> IntMap.bindings
          |> List.sort((a, b) => {
               let first = Pervasives.snd(a);
               let second = Pervasives.snd(b);
               if (first < second) {
                 1;
               } else if (first == second) {
                 0;
               } else {
                 (-1);
               };
             })
          |> List.map(((key, av)) =>
               (
                 <div className=Styles.stats>
                   <S3Image
                     kind=S3Image.SummonerSpell
                     itemId=key
                     className=Styles.icon
                   />
                 </div>,
                 av,
               )
             );
        let summonerSpellsSetsItems2 =
          matches
          |> List.fold_left(
               (t, c: Types.miniGameRecord) => {
                 let first = c.summonerSpells.d;
                 let second = c.summonerSpells.f;
                 let tuple =
                   if (first > second) {
                     (first, second);
                   } else {
                     (second, first);
                   };
                 t |> IntTupleMap.mem(tuple) ?
                   t
                   |> IntTupleMap.add(
                        tuple,
                        (t |> IntTupleMap.find(tuple)) + 1,
                      ) :
                   t |> IntTupleMap.add(tuple, 1);
               },
               IntTupleMap.empty,
             )
          |> IntTupleMap.bindings
          |> List.sort((a, b) => {
               let first = Pervasives.snd(a);
               let second = Pervasives.snd(b);
               if (first < second) {
                 1;
               } else if (first == second) {
                 0;
               } else {
                 (-1);
               };
             })
          |> List.map(((key, av)) =>
               (
                 <div>
                   <S3Image
                     kind=S3Image.SummonerSpell
                     itemId=(Pervasives.fst(key))
                     className=Styles.icon
                   />
                   <S3Image
                     kind=S3Image.SummonerSpell
                     itemId=(Pervasives.snd(key))
                     className=Styles.icon
                   />
                 </div>,
                 av,
               )
             );
        let keystonesTuple =
          matches
          |> List.fold_left(
               (t, c: Types.miniGameRecord) =>
                 t |> IntMap.mem(c.perks.perk0) ?
                   t
                   |> IntMap.add(
                        c.perks.perk0,
                        (t |> IntMap.find(c.perks.perk0)) + 1,
                      ) :
                   t |> IntMap.add(c.perks.perk0, 1),
               IntMap.empty,
             )
          |> IntMap.bindings
          |> List.sort((a, b) => {
               let first = Pervasives.snd(a);
               let second = Pervasives.snd(b);
               if (first < second) {
                 1;
               } else if (first == second) {
                 0;
               } else {
                 (-1);
               };
             })
          |> List.map(((key, av)) =>
               (
                 <div className=Styles.stats>
                   <S3Image
                     kind=S3Image.ActualPerk
                     itemId=key
                     className=Styles.icon
                   />
                 </div>,
                 av,
               )
             );
        let itemsItems =
          matches
          |> List.map(el => el.items)
          |> List.flatten
          |> List.fold_left(
               (t, itemId: int) =>
                 t |> IntMap.mem(itemId) ?
                   t |> IntMap.add(itemId, (t |> IntMap.find(itemId)) + 1) :
                   t |> IntMap.add(itemId, 1),
               IntMap.empty,
             )
          |> IntMap.bindings
          |> List.sort((a, b) => {
               let first = Pervasives.snd(a);
               let second = Pervasives.snd(b);
               if (first < second) {
                 1;
               } else if (first == second) {
                 0;
               } else {
                 (-1);
               };
             })
          |> List.map(((key, av)) =>
               (
                 <div className=Styles.stats>
                   <S3Image
                     kind=S3Image.Item
                     itemId=key
                     className=Styles.icon
                   />
                 </div>,
                 av,
               )
             );
        <div className=Styles.flexBox>
          <PercentageTable items=keystonesTuple outOf=(List.length(matches))>
            ...(ReactUtils.ste("Popular Keystones"))
          </PercentageTable>
          <PercentageTable
            items=summonerSpellsSetsItems2 outOf=(List.length(matches))>
            ...(ReactUtils.ste("Popular Summoner Spell Pairings"))
          </PercentageTable>
          <PercentageTable
            items=summonerSpellsItems outOf=(List.length(matches))>
            ...(ReactUtils.ste("Popular Summoner Spells"))
          </PercentageTable>
          <PercentageTable items=itemsItems outOf=(List.length(matches))>
            ...(ReactUtils.ste("Popular Items"))
          </PercentageTable>
        </div>;
      | (false, None) =>
        ReactUtils.ste(
          "There was an error with the server. Sorry about this! It'll probably be fixed by the next day.",
        )
      | (true, _) =>
        ReactUtils.ste(
          "Currently loading match history! Please wait. This might take a while if the data is uncached.",
        )
      },
  };
};