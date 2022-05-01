import { useRouter } from "../router";
import { useTasker } from "../task";

export function useUndone() {
  const router = useRouter();
  const tasker = useTasker();

  return async ({ options }: { options: string[] }) => {
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

    const updated = await tasker.update({
      number: Number(options[0]),
      status: "progress",
    });

    return router.push("message", {
      query: { message: `✅ #${updated.number} progress` },
    });
  };
}