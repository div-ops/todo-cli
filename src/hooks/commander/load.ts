import { storageOf } from "@divops/utils-github-storage";
import { storageOf as jsonStorageOf } from "@divops/utils-json-storage";
import { APP_NAME } from "../../constants";
import { useProfile } from "../profile";
import { useRouter } from "../router";
import { Dic, Task, useTasker } from "../task";

export function useLoad() {
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
      task: storageOf({ profile, name: "tasks" }, context),
      config: storageOf({ profile, name: "config" }, context),
    };

    const total =
      Number(((await githubStorage.config.get("global")) as Dic)?.["total"]) ??
      0;

    const list = await (async () => {
      const taskList: Task[] = [];

      for (let num = 1; num <= total; num++) {
        const task = (await githubStorage.task.get(`#${num}`)) as Task;
        if (task) {
          taskList.push(task);
        }
      }

      return taskList;
    })();

    await tasker.reset();

    for (const item of list) {
      await jsonStorage.task.set(`#${item.number}`, item);
    }

    await jsonStorage.config.set("global", {
      ...(((await githubStorage.config.get("global")) as Dic) ?? {}),
    });

    return router.push("message", {
      query: { message: `✅ storage is loaded to github` },
    });
  };
}
