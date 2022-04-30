import { unregisterAlias } from "../../utils";
import { useRouter } from "../router";

export function useUninstall() {
  const router = useRouter();

  return async () => {
    const message = await unregisterAlias("todo");
    return router.push("message", { query: { message } });
  };
}
