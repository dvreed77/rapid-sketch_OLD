// Pulled from https://github.com/mattdesl/convert-length/blob/master/convert-length.js

import { T_UNITS } from "../index";

enum System {
  metric = "metric",
  imperial = "imperial",
}

export type T_SYSTEM = keyof typeof System;

type ConverstionType = {
  [key in T_UNITS]: {
    system: T_SYSTEM;
    factor: number;
  };
};
const conversions: ConverstionType = {
  // metric
  m: {
    system: "metric",
    factor: 1,
  },
  cm: {
    system: "metric",
    factor: 1 / 100,
  },
  mm: {
    system: "metric",
    factor: 1 / 1000,
  },
  // imperial
  pt: {
    system: "imperial",
    factor: 1 / 72,
  },
  px: {
    system: "imperial",
    factor: 1 / 72,
  },
  pc: {
    system: "imperial",
    factor: 1 / 6,
  },
  in: {
    system: "imperial",
    factor: 1,
  },
  ft: {
    system: "imperial",
    factor: 12,
  },
};

type T_Anchor = {
  [key in T_SYSTEM]: {
    unit: T_UNITS;
    ratio: number;
  };
};

const anchors: T_Anchor = {
  metric: {
    unit: "m",
    ratio: 1 / 0.0254,
  },
  imperial: {
    unit: "in",
    ratio: 0.0254,
  },
};

function round(value: number, precision: number) {
  const m = Math.pow(10, precision);
  return Math.round(value * m) / m;
}

export function convertDistance(
  value: number,
  fromUnit: T_UNITS,
  toUnit: T_UNITS,
  { pixelsPerInch = 96, precision = 4, roundPixel = false }
) {
  if (typeof value !== "number" || !isFinite(value))
    throw new Error("Value must be a finite number");
  if (!fromUnit || !toUnit) throw new Error("Must specify from and to units");

  var precision = precision;
  var roundPixel = roundPixel !== false;

  if (fromUnit === toUnit) {
    // We don't need to convert from A to B since they are the same already
    return value;
  }

  var toFactor = 1;
  var fromFactor = 1;
  var isToPixel = false;

  if (fromUnit === "px") {
    fromFactor = 1 / pixelsPerInch;
    fromUnit = "in";
  }
  if (toUnit === "px") {
    isToPixel = true;
    toFactor = pixelsPerInch;
    toUnit = "in";
  }

  const fromUnitData = conversions[fromUnit];
  const toUnitData = conversions[toUnit];

  // source to anchor inside source's system
  let anchor = value * fromUnitData.factor * fromFactor;

  // if systems differ, convert one to another
  if (fromUnitData.system !== toUnitData.system) {
    // regular 'm' to 'in' and so forth
    anchor *= anchors[fromUnitData.system].ratio;
  }

  let result = (anchor / toUnitData.factor) * toFactor;
  if (isToPixel && roundPixel) {
    result = Math.round(result);
  } else if (typeof precision === "number" && isFinite(precision)) {
    result = round(result, precision);
  }
  return result;
}
