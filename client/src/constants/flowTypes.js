// @flow

/* MISC */
export type region =
  | "all" | "na" | "kr" | "euw" | "eune" | "lan" | "las" | "br" | "jp" | "tr" | "ru" | "oce"
  | "NA" | "KR" | "EUW" | "EUNE" | "LAN" | "LAS" | "BR" | "JP" | "TR" | "RU" | "OCE"
export type rank = 'c' | 'm'

export type player = {
  champ: string,
  id: number,
  losses: number,
  name: string,
  rank: rank,
  region: region,
  wins: number,
  _id: number
}

export type players = Array<player>

export type winRateStats = { wins: number, losses: number }

/* REDUX */
export type advFilter = boolean
export type merged = boolean
export type sortReverse = boolean
export type sortKey = "NONE" | "RANK" | "REGION" | "NAME" | "WINS" | "LOSSES" | "WINRATE" | "ONETRICKS"

export type state = {
  championPane: {
    advFilter: advFilter,
  },
  misc: {
    merged: merged,
  },
  playersView: {
    sortKey: sortKey,
    sortReverse: sortReverse,
  },
}

/* ACTION CREATORS */
export type toggleMerge = () => void
export type toggleAdvancedFilter = () => void
export type setSortKey = (sortKey: sortKey) => void
export type setSortReverse = (sortReverse: sortReverse) => void
