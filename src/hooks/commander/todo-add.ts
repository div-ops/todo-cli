import { useRouter } from "../router";
import { useTasker } from "../task";

// todo add "할 일"
export function useTodoAdd() {
  const tasker = useTasker();
  const router = useRouter();

  return ({ options }: { options: string[] }) => {
    const name = options.join(" ");

    if (name == null) {
      return router.push("message", {
        query: { message: "입력이 잘못되었습니다." },
      });
    }

    const task = tasker.create({ name });

    return router.push("message", {
      query: { message: `✅ #${task.number} ${task.name}` },
    });
  };
}
