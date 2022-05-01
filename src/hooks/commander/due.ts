import { getYYYYMMDD } from "../../utils/date";
import { useRouter } from "../router";
import { useTasker } from "../task";

export function useDue() {
  const router = useRouter();
  const tasker = useTasker();

  return async ({ options }: { options: string[] }) => {
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

    const task = await tasker.read({ number: Number(options[0]) });

    if (task == null) {
      return router.push("message", {
        query: { message: "📝 지워진 할 일 입니다." },
      });
    }

    const updated = await await tasker.update({
      ...task,
      due: getYYYYMMDD(Number(options[1])),
    });

    return router.push("message", {
      query: { message: `✅ #${updated.number} updated` },
    });
  };
}
