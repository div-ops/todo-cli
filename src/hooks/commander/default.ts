import { useRouter } from "../router";

export function useDefault() {
  const router = useRouter();

  return () => {
    const message = [
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      `@divops/todo-cli ${require("../../../package.json").version}`,
      ``,
      `@divops/todo-cli를 사용해주셔서 감사합니다. 🙇`,
      ``,
      `Getting-Started 👉 https://github.com/div-ops/todo-cli/wiki/Getting-Started`,
      `Repository 👉 https://github.com/div-ops/todo-cli`,
      `Bug Report 👉 https://github.com/div-ops/todo-cli/issues`,
      `Author 👉 https://github.com/creaticoding`,
    ].join("\n");

    return router.push("message", { query: { message } });
  };
}
