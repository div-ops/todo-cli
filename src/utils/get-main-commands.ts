export function getMainCommands() {
  const options = [...process.argv];

  // pop node
  options.pop();
  // pop bin file
  options.pop();

  if (options.length <= 0) {
    return [];
  }

  return options;
}
