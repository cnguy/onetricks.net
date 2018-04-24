module String = {
  let contains: (string, string) => bool = [%bs.raw
    {|
        function contains(needles, haystack) {
            return haystack.includes(needles);
        }
    |}
  ];
};