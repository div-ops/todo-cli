import { useEffect } from "react";
import { getMainCommands, registerAlias, unregisterAlias } from "../utils";
import { useRouter } from "./router";

export function useMainOption() {
  const router = useRouter();
  const [command, ...options] = getMainCommands();

  useEffect(() => {
    (async () => {
      switch (command) {
        case "install": {
          const message = await registerAlias("todo");
          return router.push("message", { query: { message } });
        }

        case "uninstall": {
          const message = await unregisterAlias("todo");
          return router.push("message", { query: { message } });
        }

        case "a":
        case "add": {
          const message = `successfully add #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        case "d":
        case "done": {
          const message = `successfully done #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        case "r":
        case "remove": {
          const message = `successfully remove #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        case "l":
        case "log": {
          const message = `successfully log #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        case "ln":
        case "link": {
          const message = `successfully link #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        case "due": {
          const message = `successfully due #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        default: {
          const message = `process.argv: ${JSON.stringify(
            {
              ["process.argv"]: process.argv,
              ["command"]: command,
              ["options"]: options,
            },
            null,
            2
          )}`;

          return router.push("message", { query: { message } });
        }
      }
    })().catch((error) => {
      const message = JSON.stringify([error.message, error.stack].join("\n"));

      return router.push("message", { query: { message } });
    });
  }, [command]);
}
