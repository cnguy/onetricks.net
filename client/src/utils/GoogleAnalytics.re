let send: (string, string) => unit = [%bs.raw
  {|
  function send(pathname, search) {
    if (typeof window.ga === 'function') {
      if (search.length > 0) search = "?" + search;
      window.ga('set', 'page', pathname + search);
      window.ga('send', 'pageview');
    }
  }
  |}
];
