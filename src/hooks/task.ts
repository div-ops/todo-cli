import { storageOf } from "../clients/json-storage";
import { useProfile } from "./profile";

export interface Task {
  number: number;
  name: string;
  status?: "progress" | "in-review" | "done" | "removed" | "holding";
  contents?: string;
  link?: string[];
  text?: string[];
  // FIXME: convert to Date type
  due?: string;
}

export type Dic = Record<string, string>;

export function useTasker() {
  const [getProfile, setProfile] = useProfile();
  const promisedStorage = (async () => {
    const [profile] = await getProfile();

    return {
      task: storageOf<Task>({ profile, name: "tasks" }),
      config: storageOf<Dic>({ profile, name: "config" }),
    };
  })();

  return {
    setProfile: async (profile: string) => {
      return await setProfile(profile);
    },

    reset: async () => {
      const storage = await promisedStorage;
      await storage.task.reset();
      await storage.config.reset();
    },

    create: async (options: Pick<Task, "name" | "contents">) => {
      const storage = await promisedStorage;

      const number = await (async () => {
        const total = (await storage.config.get("global"))?.["total"] ?? 0;

        const number = Number(total) + 1;

        await storage.config.set("global", {
          ...((await storage.config.get("global")) ?? {}),
          total: String(number),
        });

        return number;
      })();

      return await storage.task.set(`#${number}`, {
        number,
        name: options.name,
        contents: options.contents,
        status: "progress",
      });
    },

    read: async (options: Pick<Task, "number">) => {
      const storage = await promisedStorage;
      return await storage.task.get(`#${options.number}`);
    },

    readList: async (page = 0, perPage = 10) => {
      const storage = await promisedStorage;
      const taskList: Task[] = [];

      for (let num = page * perPage; num < (page + 1) * perPage; num++) {
        const task = await storage.task.get(`#${num + 1}`);
        if (task) {
          taskList.push(task);
        }
      }

      return taskList;
    },

    update: async (options: Partial<Task>) => {
      const storage = await promisedStorage;
      const task = await storage.task.get(`#${options.number}`);

      const newTask = { ...task, ...options } as Task;

      if (newTask.number == null || newTask.name == null) {
        throw new Error("올바르지 않습니다.");
      }

      return await storage.task.set(`#${options.number}`, newTask);
    },

    delete: async (options: Pick<Task, "number">) => {
      const storage = await promisedStorage;
      return await storage.task.remove(`#${options.number}`);
    },
  };
}
