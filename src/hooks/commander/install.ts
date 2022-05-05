import { registerAlias } from "../../utils";
import { exec } from "../../utils/exec";
import { useRouter } from "../router";

export function useInstall() {
  const router = useRouter();

  return async () => {
    console.log(
      await exec("yarn global add @divops/todo-cli", {
        cwd: process.env?.["HOME"] ?? process.cwd(),
      })
    );

    const message = await registerAlias("todo");

    return router.push("message", { query: { message } });
  };
}
