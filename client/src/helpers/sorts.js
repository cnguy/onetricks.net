const SORTS = {
    ONETRICKS: list =>
        list.sort((a, b) => {
            if (a[1].length > b[1].length) return -1
            if (a[1].length < b[1].length) return 1

            if (a[0] > b[0]) return 1
            if (a[0] < b[0]) return -1
            return 0
        }),
}

export default SORTS
