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
  const storage = (async () => {
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
      await (await storage).task.reset();
      await (await storage).config.reset();
    },

    create: async (options: Pick<Task, "name" | "contents">) => {
      const number = await (async () => {
        const total =
          (await (await storage).config.get("global"))?.["total"] ?? 0;

        const number = Number(total) + 1;

        await (
          await storage
        ).config.set("global", {
          ...(await (await storage).config.get("global")),
          total: String(number),
        });

        return number;
      })();

      return await (
        await storage
      ).task.set(`#${number}`, {
        number,
        name: options.name,
        contents: options.contents,
        status: "progress",
      });
    },

    read: async (options: Pick<Task, "number">) => {
      return await (await storage).task.get(`#${options.number}`);
    },

    readList: async (page = 0, perPage = 10) => {
      const taskList: Task[] = [];

      for (let num = page * perPage; num < (page + 1) * perPage; num++) {
        const task = await (await storage).task.get(`#${num + 1}`);
        if (task) {
          taskList.push(task);
        }
      }

      return taskList;
    },

    update: async (options: Partial<Task>) => {
      const task = await (await storage).task.get(`#${options.number}`);

      const newTask = { ...task, ...options } as Task;

      if (newTask.number == null || newTask.name == null) {
        throw new Error("올바르지 않습니다.");
      }

      return await (await storage).task.set(`#${options.number}`, newTask);
    },

    delete: async (options: Pick<Task, "number">) => {
      return await (await storage).task.remove(`#${options.number}`);
    },
  };
}
