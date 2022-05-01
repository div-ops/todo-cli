import { useRouter } from "../router";
import { useTasker } from "../task";

export function useReset() {
  const router = useRouter();
  const tasker = useTasker();

  return async () => {
    await tasker.reset();

    return router.push("message", {
      query: { message: `✅ storage is deleted` },
    });
  };
}
