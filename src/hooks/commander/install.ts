import { registerAlias } from "../../utils";
import { exec } from "../../utils/exec";
import { useRouter } from "../router";

export function useInstall() {
  const router = useRouter();

  return async () => {
    const cwd = process.env?.["HOME"] ?? process.cwd();

    // install global package
    await exec("yarn global add @divops/todo-cli", { cwd });

    // register alias "todo"
    await registerAlias("todo");

    return router.push("message", {
      query: { message: "성공적으로 설치되었습니다 🎉" },
    });
  };
}
