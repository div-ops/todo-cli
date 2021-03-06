import { Dday } from "@divops/utils-date";
import { useRouter } from "../router";
import { useTasker } from "../task";

export function useLog() {
  const router = useRouter();
  const tasker = useTasker();

  return async ({
    command,
    options,
  }: {
    command: string;
    options: string[];
  }) => {
    command;

    if (options[0] == null) {
      const taskList = await tasker.readList(0, 30);

      if (taskList.length === 0) {
        return router.push("message", {
          query: { message: "π ν  μΌμ΄ μμ΅λλ€." },
        });
      }

      return router.push("message", {
        query: {
          message: [
            `π https://calendar.google.com/`,
            ``,
            taskList
              .sort((taskA, taskB) => {
                if (taskA.status === "done") {
                  return 1;
                }

                if (taskB.status === "done") {
                  return -1;
                }

                if (taskA.due == null && taskB.due == null) {
                  return 0;
                }

                if (taskA.due == null) {
                  return 1;
                }

                if (taskB.due == null) {
                  return -1;
                }

                return (
                  new Date(taskA.due).getTime() - new Date(taskB.due).getTime()
                );
              })
              .map((task) =>
                [
                  task.status !== "done" && task.due
                    ? `[${Dday(task.due)}]`
                    : "",
                  (() => {
                    switch (task.status) {
                      case "done":
                        return `β`;
                      case "in-review":
                        return `π `;
                      case "progress":
                        return task.due != null ? `π₯` : "π»";
                      case "removed":
                        return `π«`;
                      case "holding":
                        return `βΉ`;
                      default:
                        return `π`;
                    }
                  })(),
                  `#${task.number}`,
                  task.name,
                ].join(" ")
              )
              .join("\n"),
          ].join("\n"),
        },
      });
    }

    if (isNaN(Number(options[0]))) {
      return router.push("message", {
        query: { message: "μλ ₯μ΄ μλͺ»λμμ΅λλ€." },
      });
    }

    const task = await tasker.read({ number: Number(options[0]) });

    if (task == null) {
      return router.push("message", {
        query: { message: "π μ§μμ§ ν  μΌ μλλ€." },
      });
    }

    return router.push("message", {
      query: {
        message: [
          `No.${task.number}`,
          `μ λͺ©: ${task.name}`,
          `μν: ${task.status === "done" ? "β done" : "π© in progress"}`,
          ...(task.due == null ? [] : [`κΈ°ν: ${task.due} κΉμ§`]),
          ...(task.text == null || task.text.length === 0
            ? []
            : [`λ΄μ©: \n${task.text.map((l) => `  - ${l}`).join("\n")}\n`]),
          ...(task.link == null || task.link.length === 0
            ? []
            : [`λ§ν¬: \n${task.link.map((l) => `  - ${l}`).join("\n")}\n`]),
        ].join("\n"),
      },
    });
  };
}
