import { createJsonStorage } from "../clients/json-storage";

interface Task {
  number: number;
  name: string;
  contents: string;
}

export function useTasker() {
  const tasksStorage = createJsonStorage<Task>("tasks");
  const configStorage = createJsonStorage<Record<string, string>>("config");

  return {
    create: (options: Pick<Task, "name" | "contents">) => {
      const total = configStorage.get("totalTaskCount") ?? 0;
      const number = total + 1;

      return tasksStorage.set(`#${number}`, {
        number,
        name: options.name,
        contents: options.contents,
      });
    },

    read: (options: Pick<Task, "number">) => {
      return tasksStorage.get(`#${options.number}`);
    },

    readList: (page = 1, perPage = 10) => {
      const taskList: Task[] = [];

      for (let num = (page - 1) * perPage; num < page * perPage; num++) {
        const task = tasksStorage.get(`#${num + 1}`);

        if (task) {
          taskList.push(task);
        }
      }

      return taskList;
    },

    update: (options: Task) => {
      return tasksStorage.set(`#${options.number}`, options);
    },

    delete: (options: Pick<Task, "number">) => {
      return tasksStorage.remove(`#${options.number}`);
    },
  };
}
