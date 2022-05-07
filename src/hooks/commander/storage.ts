import { shell } from "@divops/utils-shell";
import { useRouter } from "../router";

export function useStorage() {
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

    console.log(await shell("open $TODO_GITHUB_REPO"));

    return router.push("message", {
      query: { message: `✅ open browser` },
    });
  };
}
