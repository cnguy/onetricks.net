let ste = (str: string) => ReasonReact.stringToElement(str);

let ite = (int: int) => ReasonReact.stringToElement(string_of_int(int));

/* Will be more complicated than just lowercasing it. */
let parseChampionNameFromRoute = (str: string) => String.lowercase(str);