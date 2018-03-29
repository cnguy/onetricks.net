let ste = (str: string) => ReasonReact.stringToElement(str);

let ite = (int: int) => ReasonReact.stringToElement(string_of_int(int));

let lte = (list: list('a)) =>
  list |> Array.of_list |> ReasonReact.arrayToElement;

/* Will be more complicated than just lowercasing it. */
let parseChampionNameFromRoute = (str: string) => String.lowercase(str);

let getEventValue = event => ReactDOMRe.domElementToObj(
                               ReactEventRe.Form.target(event),
                             )##value;