import { storageOf } from "@divops/utils-github-storage";
import { storageOf as jsonStorageOf } from "@divops/utils-json-storage";
import { APP_NAME } from "../../constants";
import { useProfile } from "../profile";
import { useRouter } from "../router";
import { Dic, Task, useTasker } from "../task";

export function useSave() {
  const appName = APP_NAME;
  const tasker = useTasker();
  const router = useRouter();

  const [getProfile] = useProfile();

  return async ({
    command,
    options,
  }: {
    command: string;
    options: string[];
  }) => {
    command;
    options;

    const [profile] = await getProfile();

    const jsonStorage = {
      task: jsonStorageOf<Task>({ appName, profile, name: "tasks" }),
      config: jsonStorageOf<Dic>({ appName, profile, name: "config" }),
    };

    const context = {
      repoEnvKey: "TODO_GITHUB_REPO",
      tokenEnvKey: "TODO_GITHUB_TOKEN",
    };

    const githubStorage = {
      root: storageOf({ name: profile }, context),
      task: storageOf({ profile, name: "tasks" }, context),
      config: storageOf({ profile, name: "config" }, context),
    };

    try {
      await githubStorage.root.remove("tasks");
    } catch {
      //
    }

    try {
      await githubStorage.root.remove("config");
    } catch {
      //
    }

    const total = Number(
      (await jsonStorage.config.get("global"))?.["total"] ?? 0
    );

    const list = await tasker.readList(0, total);

    for (const item of list) {
      await githubStorage.task.set(`#${item.number}`, item);
    }

    await githubStorage.config.set("global", {
      ...((await jsonStorage.config.get("global")) ?? {}),
    });

    return router.push("message", {
      query: { message: `✅ storage is saved to github` },
    });
  };
}
