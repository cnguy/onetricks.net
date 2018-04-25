open Jest;

describe("Region", () =>
  Expect.(
    test("toCsvString", () =>
      expect(
        Region.toCsvString([Region.NorthAmerica, Region.LatinNorthAmerica]),
      )
      |> toBe("na,lan")
    )
  )
);

describe("Region", () =>
  Expect.(
    test("toCsvString all", () =>
      expect(Region.list |> Region.toCsvString)
      |> toBe("na,kr,euw,eune,lan,las,br,jp,tr,ru,oce")
    )
  )
);