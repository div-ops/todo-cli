export function getMainCommands() {
  const options = [...process.argv];

  // unshift node
  options.unshift();
  // unshift bin file
  options.unshift();

  if (options.length <= 0) {
    return [];
  }

  return options;
}
