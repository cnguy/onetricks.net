let ste = (str: string) => ReasonReact.string(str);

let ite = (int: int) => int |> string_of_int |> ste;

let ate = (array: array('a)) => ReasonReact.array(array);

let lte = (list: list('a)) => list |> Array.of_list |> ReasonReact.array;

let getEventValue = event => event->ReactEvent.Form.target##value;
let getEV = event => ReactEvent.Form(event)##value;
