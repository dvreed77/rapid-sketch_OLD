export function randomF(f: (x: number) => number, nPts = 1000) {
  const dx = 1 / (nPts - 1);

  const pdfData: [number, number][] = Array.from({
    length: nPts,
  }).map((_, idx) => [idx * dx, f(idx * dx)]);

  const cdfData: [number, number][] = pdfData
    .slice(1)
    .reduce((a, b) => [...a, [b[0], a[a.length - 1][1] + dx * b[1]]], [[0, 0]]);

  this.pdfData = pdfData;
  this.cdfData = cdfData;

  const maxD = Math.max(...cdfData.map((d) => d[1]));

  return function () {
    const x = Math.random() * maxD;
    const idx = cdfData.findIndex((d) => d[1] > x);

    return cdfData[idx][0];
  };
}

function binarySearch(arr, val) {
  var mid = Math.floor(arr.length / 2);

  if (arr[mid][1] === val) {
    return arr[mid];
  } else if (arr[mid][1] < val && arr.length > 1) {
    return binarySearch(arr.slice(mid), val);
  } else if (arr[mid][1] > val && arr.length > 1) {
    return binarySearch(arr.slice(0, mid), val);
  } else {
    return arr[mid];
  }
}

export class random2 {
  pdfData: [number, number][];
  cdfData: [number, number][];
  maxD: number;
  constructor(f: (x: number) => number, nPts = 1000) {
    const dx = 1 / (nPts - 1);

    const pdfData: [number, number][] = Array.from({
      length: nPts,
    }).map((_, idx) => [idx * dx, f(idx * dx)]);

    const cdfData: [number, number][] = pdfData
      .slice(1)
      .reduce((a, b) => [...a, [b[0], a[a.length - 1][1] + dx * b[1]]], [
        [0, 0],
      ]);

    this.pdfData = pdfData;
    this.cdfData = cdfData;
    this.maxD = Math.max(...cdfData.map((d) => d[1]));
  }

  sample() {
    const x = Math.random() * this.maxD;
    const s = binarySearch(this.cdfData, x);

    return s[0];
  }
}

// export function randomFBST(f: (x: number) => number, nPts = 1000) {
//   const dx = 1 / (nPts - 1);

//   const pdfData: [number, number][] = Array.from({
//     length: nPts,
//   }).map((_, idx) => [idx * dx, f(idx * dx)]);

//   const cdfData: [number, number][] = pdfData
//     .slice(1)
//     .reduce((a, b) => [...a, [b[0], a[a.length - 1][1] + dx * b[1]]], [[0, 0]]);

//   this.pdfData = pdfData;
//   this.cdfData = cdfData;
//   const maxD = Math.max(...cdfData.map((d) => d[1]));

//   this.sample = function () {
//     const x = Math.random() * maxD;
//     const s = binarySearch(cdfData, x);

//     return s[0];
//   };

//   return this;
// }
