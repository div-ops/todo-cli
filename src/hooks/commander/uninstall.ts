import { shell } from "@divops/utils-shell";
import { unregisterAlias } from "../../utils";
import { useRouter } from "../router";

export function useUninstall() {
  const router = useRouter();

  return async ({
    command,
    options,
  }: {
    command: string;
    options: string[];
  }) => {
    command;
    options;

    const cwd = process.env?.["HOME"] ?? process.cwd();

    try {
      // unregister alias todo
      await unregisterAlias("todo");

      // uninstall global package
      await shell("yarn global remove @divops/todo-cli", { cwd });
    } catch {
      // clear npx cache for remove todo-cli
      await shell("npx -yes clear-npx-cache", { cwd });

      return router.push("message", {
        query: { message: "설치되어 있지 않습니다. 😕" },
      });
    }

    // clear npx cache for remove todo-cli
    await shell("npx -yes clear-npx-cache", { cwd });

    return router.push("message", {
      query: { message: "성공적으로 제거되었습니다. 🥲 " },
    });
  };
}
