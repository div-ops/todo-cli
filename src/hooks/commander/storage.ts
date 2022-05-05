import { useRouter } from "../router";

export function useStorage() {
  const router = useRouter();

  return async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("child_process").exec(
      "open $TODO_GITHUB_REPO",
      (err: Error, stdout: string, stderr: string) => {
        if (err) {
          console.log(
            `TODO_GITHUB_REPO is ${process.env?.["TODO_GITHUB_REPO"]}`
          );
          console.error(stderr);
          console.error(err.message);
          return;
        }

        console.log(stdout);
      }
    );

    return router.push("message", {
      query: { message: `✅ open browser` },
    });
  };
}
