import { useEffect } from "react";
import { useCommander } from "./commander";
import { useRouter } from "./router";

export function useMainOption() {
  const router = useRouter();
  const commander = useCommander();
  const [command, ...options] = [...process.argv].slice(2);

  useEffect(() => {
    (async () => {
      if (command == null) {
        return await commander["default"]?.({ command, options });
      }

      const action = commander[command];

      if (action == null) {
        return await commander["default"]?.({ command, options });
      }

      return await action({ command, options });
    })().catch((error) => {
      const message = JSON.stringify([error.message, error.stack].join("\n"));

      return router.push("message", { query: { message } });
    });
  }, [command]);
}
