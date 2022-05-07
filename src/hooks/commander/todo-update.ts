import { useRouter } from "../router";
import { useTasker } from "../task";

export function useTodoUpdate() {
  const router = useRouter();
  const tasker = useTasker();

  return async ({
    command,
    options,
  }: {
    command: string;
    options: string[];
  }) => {
    if (options[0] == null || isNaN(Number(options[0]))) {
      return router.push("message", {
        query: { message: "입력이 잘못되었습니다." },
      });
    }

    const task = await tasker.read({ number: Number(options[0]) });

    if (task == null) {
      return router.push("message", {
        query: { message: "📝 지워진 할 일 입니다." },
      });
    }

    if (
      command !== "progress" &&
      command !== "in-review" &&
      command !== "done" &&
      command !== "removed" &&
      command !== "holding"
    ) {
      return router.push("message", {
        query: { message: "❌ 잘못된 커맨드입니다" },
      });
    }

    const updated = await tasker.update({
      number: Number(options[0]),
      status: command,
    });

    return router.push("message", {
      query: {
        message: [
          `✅ Task below have been updated to ${command}.`,
          `#${updated.number} "${updated.name}"`,
        ].join("\n"),
      },
    });
  };
}
