import { storageOf } from "../clients/json-storage";
import { useProfile } from "./profile";

interface Task {
  number: number;
  name: string;
  status?: "progress" | "in-review" | "done" | "removed" | "holding";
  contents?: string;
  link?: string[];
  // FIXME: convert to Date type
  due?: string;
}

type Dic = Record<string, string>;

export function useTasker() {
  const [getProfile, setProfile] = useProfile();
  const StorageOf = (profile: string) => ({
    task: storageOf<Task>({ profile, name: "tasks" }),
    config: storageOf<Dic>({ profile, name: "config" }),
  });

  return {
    setProfile: async (profile: string) => {
      return await setProfile(profile);
    },

    reset: async () => {
      const [profile] = await getProfile();
      await StorageOf(profile).task.reset();
      await StorageOf(profile).config.reset();
    },

    create: async (options: Pick<Task, "name" | "contents">) => {
      const [profile] = await getProfile();
      const number = await (async () => {
        const total =
          (await StorageOf(profile).config.get("global"))?.["total"] ?? 0;

        const number = Number(total) + 1;

        await StorageOf(profile).config.set("global", {
          ...(await StorageOf(profile).config.get("global")),
          total: String(number),
        });

        return number;
      })();

      return StorageOf(profile).task.set(`#${number}`, {
        number,
        name: options.name,
        contents: options.contents,
        status: "progress",
      });
    },

    read: async (options: Pick<Task, "number">) => {
      const [profile] = await getProfile();
      return await StorageOf(profile).task.get(`#${options.number}`);
    },

    readList: async (page = 0, perPage = 10) => {
      const [profile] = await getProfile();
      const taskList: Task[] = [];

      for (let num = page * perPage; num < (page + 1) * perPage; num++) {
        const task = await StorageOf(profile).task.get(`#${num + 1}`);
        if (task) {
          taskList.push(task);
        }
      }

      return taskList;
    },

    update: async (options: Partial<Task>) => {
      const [profile] = await getProfile();
      const task = await StorageOf(profile).task.get(`#${options.number}`);

      const newTask = { ...task, ...options } as Task;

      if (newTask.number == null || newTask.name == null) {
        throw new Error("올바르지 않습니다.");
      }

      return await StorageOf(profile).task.set(`#${options.number}`, newTask);
    },

    delete: async (options: Pick<Task, "number">) => {
      const [profile] = await getProfile();
      return await StorageOf(profile).task.remove(`#${options.number}`);
    },
  };
}
