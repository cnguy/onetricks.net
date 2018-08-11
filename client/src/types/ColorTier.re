type kind =
  | Poor
  | Okay
  | Average
  | Great
  | Excellent;

let toHex = (kind: kind) =>
  switch (kind) {
  | Poor => "#ff0000"
  | Okay => "#ffffff"
  | Average => "#00ff00"
  | Great => "#00ccff"
  | Excellent => "#ffa500"
  };
