import { Dday } from "../../utils/date";
import { useRouter } from "../router";
import { useTasker } from "../task";

export function useLog() {
  const router = useRouter();
  const tasker = useTasker();

  return ({ options }: { options: string[] }) => {
    if (options[0] == null) {
      const taskList = tasker.readList(0, 30);

      if (taskList.length === 0) {
        return router.push("message", {
          query: { message: "📝 할 일이 없습니다." },
        });
      }

      return router.push("message", {
        query: {
          message: [
            `📆 https://calendar.google.com/`,
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
                        return `✅`;
                      case "in-review":
                        return `🌠`;
                      case "progress":
                        return task.due != null ? `🔥` : "💻";
                      case "removed":
                        return `🚫`;
                      case "holding":
                        return `⏹`;
                      default:
                        return `📝`;
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
        query: { message: "입력이 잘못되었습니다." },
      });
    }

    const task = tasker.read({ number: Number(options[0]) });

    if (task == null) {
      return router.push("message", {
        query: { message: "📝 지워진 할 일 입니다." },
      });
    }

    return router.push("message", {
      query: {
        message: [
          `No.${task.number}`,
          `내용: ${task.name}`,
          `상태: ${task.status === "done" ? "✅ done" : "🟩 in progress"}`,
          ...(task.due == null ? [] : [`기한: ${task.due} 까지`]),
          ...(task.link == null || task.link.length === 0
            ? []
            : [`링크: [\n${task.link.map((l) => `    ${l}`).join("\n")}\n]`]),
        ].join("\n"),
      },
    });
  };
}
