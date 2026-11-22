let seed = 12345;
export function setSeed(s) {
  seed = s;
}
export function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
export function randomRange(min, max) {
  return min + random() * (max - min);
}
