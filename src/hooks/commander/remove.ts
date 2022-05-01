import { useRouter } from "../router";
import { useTasker } from "../task";

export function useRemove() {
  const router = useRouter();
  const tasker = useTasker();

  return async ({ options }: { options: string[] }) => {
    if (options[0] == null || isNaN(Number(options[0]))) {
      return router.push("message", {
        query: { message: "입력이 잘못되었습니다." },
      });
    }

    const key = await tasker.delete({ number: Number(options[0]) });

    return router.push("message", {
      query: { message: `✅ ${key} is deleted` },
    });
  };
}
