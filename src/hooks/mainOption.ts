import { useEffect } from "react";
import { getMainCommands } from "../utils";
import { useCommander } from "./commander";
import { useRouter } from "./router";

export function useMainOption() {
  const router = useRouter();
  const commander = useCommander();
  const [command, ...options] = getMainCommands();

  useEffect(() => {
    (async () => {
      switch (command) {
        case "a":
        case "add": {
          return await commander.todoAdd({ options });
        }

        case "r":
        case "remove": {
          return await commander.remove({ options });
        }

        case "l":
        case "log": {
          return await commander.log({ options });
        }

        case "ln":
        case "link": {
          return await commander.link({ options });
        }

        case "link-remove": {
          return await commander.linkRemove({ options });
        }

        case "undone": {
          return await commander.undone({ options });
        }

        case "due": {
          return await commander.due({ options });
        }

        case "p":
        case "profile": {
          return await commander.updateProfile({ options });
        }

        case "in-review":
        case "holding":
        case "done": {
          return await commander.todoUpdate({ command, options });
        }

        case "storage":
        case "install":
        case "uninstall":
        case "reset":
        case "save":
        case "load": {
          return await commander[command]();
        }

        default: {
          return commander.default();
        }
      }
    })().catch((error) => {
      const message = JSON.stringify([error.message, error.stack].join("\n"));

      return router.push("message", { query: { message } });
    });
  }, [command]);
}
