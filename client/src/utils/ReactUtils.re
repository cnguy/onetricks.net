let ste = (str: string) => ReasonReact.stringToElement(str);

let ite = (int: int) => int |> string_of_int |> ste;

let lte = (list: list('a)) =>
  list |> Array.of_list |> ReasonReact.arrayToElement;

let getEventValue = event => (
                               event
                               |> ReactEventRe.Form.target
                               |> ReactDOMRe.domElementToObj
                             )##value;