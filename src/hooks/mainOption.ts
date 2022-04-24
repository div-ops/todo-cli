import { useEffect, useState } from "react";
import { registerAlias, unregisterAlias } from "../utils";

export function useMainOption() {
  const [message, setMessage] = useState<string | undefined>();
  const command = getMainOption();

  useEffect(() => {
    (async () => {
      switch (command) {
        case "i":
        case "install": {
          return setMessage(await registerAlias("todo"));
        }

        case "r":
        case "remove":
        case "uninstall": {
          return setMessage(await unregisterAlias("todo"));
        }
        default:
          return;
      }
    })().catch((error) => {
      return setMessage(
        JSON.stringify([error.message, error.stack].join("\n"))
      );
    });
  }, [command]);

  return message;
}

function getMainOption() {
  console.log(`process.argv: ${JSON.stringify(process.argv, null, 2)}`);

  if (process.argv.length <= 2) {
    return null;
  }

  return process.argv[process.argv.length - 1];
}
