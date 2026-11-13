export function getUtf8ByteLength(value: string): number {
  return encodeURIComponent(value).replace(/%[0-9A-F]{2}/gi, "U").length;
}
