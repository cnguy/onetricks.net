module String = {
  let contains: (string, string) => bool = [%bs.raw
    {|
        function contains(needles, haystack) {
            return haystack.includes(needles);
        }
    |}
  ];
  let keepOnlyAlphabetical: string => string = [%bs.raw
    {|
      function keepOnlyAlphabetical(name) {
          return name.replace(/[^0-9a-z]/gi, '');
      }
    |}
  ];
};