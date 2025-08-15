export function getMaxAsciiString(str: string) {
  let max = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) >= 32 && str.charCodeAt(i) < 126) max++;
    else max += 2;
  }
  return max;
}
