import { registerAlias } from "../../utils";
import { useRouter } from "../router";

export function useInstall() {
  const router = useRouter();

  return async () => {
    const message = await registerAlias("todo");
    return router.push("message", { query: { message } });
  };
}
