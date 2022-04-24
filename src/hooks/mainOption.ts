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

          const task = tasker.create({
            name: options[0],
            contents: options[1] ?? "",
          });

          return router.push("message", {
            query: { message: `[success] #${task.number} ${task.name}` },
          });
        }

        case "d":
        case "done": {
          const message = `successfully done #1 [${options.join(" ")}]`;
          return router.push("message", { query: { message } });
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
            query: { message: `[success] ${key} is deleted` },
          });
        }

        case "l":
        case "log": {
          const taskList = tasker.readList();

          return router.push("message", {
            query: {
              message: taskList
                .map((task) => `#${task.number} ${task.name}`)
                .join("\n"),
            },
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
            query: { message: `[success] storage is deleted` },
          });
        }

        default: {
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
      }
    })().catch((error) => {
      const message = JSON.stringify([error.message, error.stack].join("\n"));

      return router.push("message", { query: { message } });
    });
  }, [command]);
}
