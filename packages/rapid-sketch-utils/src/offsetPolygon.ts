import * as jsts from "jsts";

function vectorCoordinates2JTS(polygon) {
  const coordinates = [];

  for (let i = 0; i < polygon.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(polygon[i][0], polygon[i][1]));
  }

  coordinates.push(coordinates[0]);

  const geoFactory = new jsts.geom.GeometryFactory();
  return geoFactory.createLinearRing(coordinates);
}

export function offsetPolygon(poly: [number, number][], spacing: number) {
  var geoInput = vectorCoordinates2JTS(poly);

  var geometryFactory = new jsts.geom.GeometryFactory();

  var shell = geometryFactory.createPolygon(geoInput, []);

  var polygon = shell.buffer(
    spacing,
    5,
    jsts.operation.buffer.BufferParameters.CAP_FLAT
  ) as jsts.geom.Polygon;

  var inflatedCoordinates = [];
  var oCoordinates;
  oCoordinates = polygon.getCoordinates();
  for (let i = 0; i < oCoordinates.length; i++) {
    var oItem;
    oItem = oCoordinates[i];
    inflatedCoordinates.push([Math.ceil(oItem.x), Math.ceil(oItem.y)]);
  }
  return inflatedCoordinates;
}
