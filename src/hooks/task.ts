import { createJsonStorage } from "../clients/json-storage";

interface Task {
  number: number;
  name: string;
  status?: "progress" | "done" | "removed" | "holding";
  contents?: string;
  link?: string[];
  // FIXME: convert to Date type
  due?: string;
}

export function useTasker() {
  const tasksStorage = createJsonStorage<Task>("tasks");
  const configStorage = createJsonStorage<Record<string, string>>("config");

  return {
    base: () => {
      return [tasksStorage.base(), configStorage.base()].join("\n");
    },
    reset: () => {
      tasksStorage.reset();
      configStorage.reset();
    },

    create: (options: Pick<Task, "name" | "contents">) => {
      const number = (() => {
        const total = configStorage.get("global")?.["total"] ?? 0;

        const number = Number(total) + 1;

        configStorage.set("global", {
          ...configStorage.get("global"),
          total: String(number),
        });

        return number;
      })();

      return tasksStorage.set(`#${number}`, {
        number,
        name: options.name,
        contents: options.contents,
        status: "progress",
      });
    },

    read: (options: Pick<Task, "number">) => {
      return tasksStorage.get(`#${options.number}`);
    },

    readList: (page = 0, perPage = 10) => {
      const taskList: Task[] = [];

      for (let num = page * perPage; num < (page + 1) * perPage; num++) {
        const task = tasksStorage.get(`#${num + 1}`);

        if (task) {
          taskList.push(task);
        }
      }

      return taskList;
    },

    update: (options: Partial<Task>) => {
      const task = tasksStorage.get(`#${options.number}`);

      const newTask = { ...task, ...options } as Task;

      if (newTask.number == null || newTask.name == null) {
        throw new Error("올바르지 않습니다.");
      }

      return tasksStorage.set(`#${options.number}`, newTask);
    },

    delete: (options: Pick<Task, "number">) => {
      return tasksStorage.remove(`#${options.number}`);
    },
  };
}
