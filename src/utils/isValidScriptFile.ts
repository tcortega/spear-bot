export function isValidScriptFile(name: string) {
  return /^[^.]+(.ts|.js)$/.test(name);
}
