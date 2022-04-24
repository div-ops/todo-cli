export function getMainCommands() {
  const options = process.argv;

  // pop node
  options.pop();
  // pop bin file
  options.pop();

  if (options.length <= 0) {
    console.log(`process.argv: ${JSON.stringify(process.argv, null, 2)}`);
    return [];
  }

  return options;
}
