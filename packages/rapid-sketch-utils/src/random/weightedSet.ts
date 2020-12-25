interface IWeight {
  value: any;
  weight: number;
}

export function weightedSet(set: IWeight[]) {
  if (set.length === 0) return null;
  return set[weightedSetIndex(set)].value;
}

export function weightedSetIndex(set: IWeight[]) {
  set = set || [];
  if (set.length === 0) return -1;
  return weighted(
    set.map(function (s) {
      return s.weight;
    })
  );
}

export function weighted(weights: number[]) {
  const totalWeight = weights.reduce((agg, c) => c + agg, 0);
  if (totalWeight <= 0) throw new Error("Weights must sum to > 0");

  var random = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i;
    }
    random -= weights[i];
  }
  return 0;
}
