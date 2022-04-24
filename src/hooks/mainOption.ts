import { useEffect } from "react";
import { getMainCommands, registerAlias, unregisterAlias } from "../utils";
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

          const key = tasker.update({
            number: Number(options[0]),
            status: "done",
          });

          return router.push("message", {
            query: { message: `✅ ${key} done` },
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
                  .map((task) => `📝 #${task.number} ${task.name}`)
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
            query: { message: `📝 #${task.number} ${task.name}` },
          });
        }

        case "ln":
        case "link": {
          const message = `successfully link #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
        }

        case "due": {
          const message = `successfully due #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
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
