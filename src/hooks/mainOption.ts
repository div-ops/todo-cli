import { useEffect } from "react";
import { getMainCommands, registerAlias, unregisterAlias } from "../utils";
import { Dday, getYYYYMMDD } from "../utils/date";
import { useRouter } from "./router";
import { useTasker } from "./task";

export function useMainOption() {
  const tasker = useTasker();
  const router = useRouter();
  const [command, ...options] = getMainCommands();

  useEffect(() => {
    (async () => {
      switch (command) {
        case "install": {
          const message = await registerAlias("todo");
          return router.push("message", { query: { message } });
        }

        case "uninstall": {
          const message = await unregisterAlias("todo");
          return router.push("message", { query: { message } });
        }

        case "a":
        case "add": {
          if (options[0] == null) {
            return router.push("message", {
              query: { message: "입력이 잘못되었습니다." },
            });
          }

          const task = tasker.create({ name: options.join(" ") });

          return router.push("message", {
            query: { message: `✅ #${task.number} ${task.name}` },
          });
        }

        case "d":
        case "done": {
          if (options[0] == null || isNaN(Number(options[0]))) {
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

          const updated = tasker.update({
            number: Number(options[0]),
            status: "done",
          });

          return router.push("message", {
            query: { message: `✅ #${updated.number} done` },
          });
        }

        case "undone": {
          if (options[0] == null || isNaN(Number(options[0]))) {
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

          const updated = tasker.update({
            number: Number(options[0]),
            status: "progress",
          });

          return router.push("message", {
            query: { message: `✅ #${updated.number} progress` },
          });
        }

        case "r":
        case "remove": {
          if (options[0] == null || isNaN(Number(options[0]))) {
            return router.push("message", {
              query: { message: "입력이 잘못되었습니다." },
            });
          }

          const key = tasker.delete({ number: Number(options[0]) });

          return router.push("message", {
            query: { message: `✅ ${key} is deleted` },
          });
        }

        case "l":
        case "log": {
          if (options[0] == null) {
            const taskList = tasker.readList();

            if (taskList.length === 0) {
              return router.push("message", {
                query: { message: "📝 할 일이 없습니다." },
              });
            }

            return router.push("message", {
              query: {
                message: taskList
                  .sort((taskA, taskB) => {
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
                      new Date(taskA.due).getTime() -
                      new Date(taskB.due).getTime()
                    );
                  })
                  .map((task) =>
                    [
                      task.due ? `[${Dday(task.due)}]` : "",
                      task.status === "done" ? "✅" : "🟩",
                      `#${task.number}`,
                      task.name,
                    ].join(" ")
                  )
                  .join("\n"),
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
                `상태: ${
                  task.status === "done" ? "✅ done" : "🟩 in progress"
                }`,
                ...(task.due == null ? [] : [`기한: ${task.due} 까지`]),
                ...(task.link == null || task.link.length === 0
                  ? []
                  : [
                      `링크: [\n${task.link
                        .map((l) => `    ${l}`)
                        .join("\n")}\n]`,
                    ]),
              ].join("\n"),
            },
          });
        }

        case "ln":
        case "link": {
          if (options[0] == null || isNaN(Number(options[0]))) {
            return router.push("message", {
              query: { message: "입력이 잘못되었습니다." },
            });
          }

          if (options[1] == null || options[1] === "") {
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

          const updated = tasker.update({
            ...task,
            link: [...(task?.link ?? []), options[1]],
          });

          return router.push("message", {
            query: { message: `✅ #${updated.number} done` },
          });
        }

        case "link-remove": {
          if (options[0] == null || isNaN(Number(options[0]))) {
            return router.push("message", {
              query: { message: "입력이 잘못되었습니다." },
            });
          }

          if (options[1] == null || options[1] === "") {
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

          if (task?.link == null || task.link.length === 0) {
            return router.push("message", {
              query: { message: "📝 이미 링크가 없습니다." },
            });
          }

          const updated = tasker.update({
            ...task,
            link: task.link.filter((e) => e !== options[1]),
          });

          return router.push("message", {
            query: { message: `✅ #${updated.number} done` },
          });
        }

        case "due": {
          if (options[0] == null || isNaN(Number(options[0]))) {
            return router.push("message", {
              query: { message: "입력이 잘못되었습니다." },
            });
          }

          if (options[1] == null || isNaN(Number(options[1]))) {
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

          const updated = tasker.update({
            ...task,
            due: getYYYYMMDD(Number(options[1])),
          });

          return router.push("message", {
            query: { message: `✅ #${updated.number} updated` },
          });
        }

        case "reset": {
          tasker.reset();

          return router.push("message", {
            query: { message: `✅ storage is deleted` },
          });
        }

        case "base": {
          return router.push("message", {
            query: { message: `✅ base is ${tasker.base()}` },
          });
        }

        case "debug": {
          const message = `process.argv: ${JSON.stringify(
            {
              ["process.argv"]: process.argv,
              ["command"]: command,
              ["options"]: options,
            },
            null,
            2
          )}`;

          return router.push("message", { query: { message } });
        }

        default: {
          const message = [
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            `@divops/todo-cli ${require("../../package.json").version}`,
            ``,
            `@divops/todo-cli를 사용해주셔서 감사합니다. 🙇`,
            ``,
            `Getting-Started 👉 https://github.com/div-ops/todo-cli/wiki/Getting-Started`,
            `Repository 👉 https://github.com/div-ops/todo-cli`,
            `Bug Report 👉 https://github.com/div-ops/todo-cli/issues`,
            `Author 👉 https://github.com/creaticoding`,
          ].join("\n");

          return router.push("message", { query: { message } });
        }
      }
    })().catch((error) => {
      const message = JSON.stringify([error.message, error.stack].join("\n"));

      return router.push("message", { query: { message } });
    });
  }, [command]);
}
