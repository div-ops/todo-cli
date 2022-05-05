import { exec } from "../../utils/exec";
import { useRouter } from "../router";

export function useStorage() {
  const router = useRouter();

  return async () => {
    console.log(await exec("open $TODO_GITHUB_REPO"));

    return router.push("message", {
      query: { message: `✅ open browser` },
    });
  };
}
