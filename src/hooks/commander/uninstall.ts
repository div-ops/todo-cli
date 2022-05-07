import { unregisterAlias } from "../../utils";
import { exec } from "../../utils/exec";
import { useRouter } from "../router";

export function useUninstall() {
  const router = useRouter();

  return async () => {
    const cwd = process.env?.["HOME"] ?? process.cwd();

    // unregister alias todo
    await unregisterAlias("todo");

    // uninstall global package
    await exec("yarn global remove @divops/todo-cli", { cwd });

    // clear npx cache for remove todo-cli
    await exec("npx -yes clear-npx-cache", { cwd });

    return router.push("message", {
      query: { message: "성공적으로 제거되었습니다 🥲" },
    });
  };
}
