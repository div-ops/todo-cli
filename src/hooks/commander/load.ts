import { storageOf } from "../../clients/github-storage";
import { storageOf as jsonStorageOf } from "../../clients/json-storage";
import { useProfile } from "../profile";
import { useRouter } from "../router";
import { Dic, Task, useTasker } from "../task";

export function useLoad() {
  const tasker = useTasker();
  const router = useRouter();

  const [getProfile] = useProfile();

  return async () => {
    const [profile] = await getProfile();

    const jsonStorage = {
      task: jsonStorageOf<Task>({ profile, name: "tasks" }),
      config: jsonStorageOf<Dic>({ profile, name: "config" }),
    };

    const githubStorage = {
      task: storageOf({ profile, name: "tasks" }),
      config: storageOf({ profile, name: "config" }),
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
