import { useEffect, useState } from "react";
import { getMainCommands, registerAlias, unregisterAlias } from "../utils";

export function useMainOption() {
  const [message, setMessage] = useState<string | undefined>();
  const [command, ...options] = getMainCommands();

  console.log({ command, options });

  useEffect(() => {
    (async () => {
      switch (command) {
        case "install": {
          return setMessage(await registerAlias("todo"));
        }

        case "uninstall": {
          return setMessage(await unregisterAlias("todo"));
        }

        case "a":
        case "add": {
          return setMessage(`successfully add #1 [${options.join(" ")}]`);
        }

        case "d":
        case "done": {
          return setMessage(`successfully done #1 [${options.join(" ")}]`);
        }

        case "r":
        case "remove": {
          return setMessage(`successfully remove #1 [${options.join(" ")}]`);
        }

        case "l":
        case "log": {
          return setMessage(`successfully log #1 [${options.join(" ")}]`);
        }

        case "ln":
        case "link": {
          return setMessage(`successfully link #1 [${options.join(" ")}]`);
        }

        case "due": {
          return setMessage(`successfully due #1 [${options.join(" ")}]`);
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
