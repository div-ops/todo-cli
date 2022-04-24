import { atom, useRecoilState } from "recoil";

type QueryParams = Record<string, string>;

const routerPathname = atom({ key: "routerPathname", default: "message" });

const routerQuery = atom<QueryParams>({ key: "routerQuery", default: {} });

export function useRouter() {
  const [pathname, setPathname] = useRecoilState(routerPathname);
  const [query, setQuery] = useRecoilState(routerQuery);

  return {
    push: (path: string, options?: { query: Record<string, string> }) => {
      if (path.includes("?")) {
        throw new Error("path에 ?를 넣는 방식은 미지원입니다.");
      } else {
        setPathname(path);

        if (options?.query != null) {
          setQuery({ ...options.query });
        }
      }
    },

    get pathname() {
      return pathname;
    },

    get query() {
      return query;
    },
  };
}
