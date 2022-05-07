import { storageOf } from "@divops/utils-github-storage";
import { storageOf as jsonStorageOf } from "@divops/utils-json-storage";
import { useProfile } from "../profile";
import { useRouter } from "../router";
import { Dic, Task, useTasker } from "../task";

export function useSave() {
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
      task: jsonStorageOf<Task>({ profile, name: "tasks" }),
      config: jsonStorageOf<Dic>({ profile, name: "config" }),
    };

    const githubStorage = {
      root: storageOf({ name: profile }),
      task: storageOf({ profile, name: "tasks" }),
      config: storageOf({ profile, name: "config" }),
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
