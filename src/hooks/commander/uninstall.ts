// import { unregisterAlias } from "../../utils";
import { exec } from "../../utils/exec";
import { useRouter } from "../router";

export function useUninstall() {
  const router = useRouter();

  return async () => {
    // const message = await unregisterAlias("todo");

    console.log(
      await exec("yarn global remove @divops/todo-cli", {
        cwd: process.env?.["HOME"] ?? process.cwd(),
      })
    );

    return router.push("message", { query: { message: "uninstalled" } });
  };
}
