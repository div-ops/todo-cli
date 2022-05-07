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

      if (command in commander) {
        return await commander[command]?.({ command, options });
      }

      return await commander["default"]?.({ command, options });
    })().catch((error) => {
      const message = JSON.stringify([error.message, error.stack].join("\n"));

      return router.push("message", { query: { message } });
    });
  }, [command]);
}
