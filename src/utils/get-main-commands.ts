export function getMainCommands() {
  const options = [...process.argv];

  // shift node
  options.shift();
  // shift bin file
  options.shift();

  if (options.length <= 0) {
    return [];
  }

  return options;
}
