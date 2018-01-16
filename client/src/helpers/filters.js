const FILTERS = {
    search: searchKey => el => el[0].toLowerCase().indexOf(searchKey) !== -1,
    rank: r => el => el.rank === r,
}

export default FILTERS
