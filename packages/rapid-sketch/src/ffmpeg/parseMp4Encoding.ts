function parseMP4ImageEncoding(encoding: string) {
  if (encoding === "image/png") return "png";
  if (encoding === "image/jpeg") return "mjpeg";
  return null;
}
