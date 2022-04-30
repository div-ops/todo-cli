import { createJsonStorage } from "../clients/json-storage";

export const DEFAULT_PROFILE = "default";

type Dic = Record<string, string>;

export function useProfile() {
  const profileStorage = createJsonStorage<Dic>({ name: "profile" });

  const setProfile = (profile: string) => {
    const list = profileStorage.get("profile")?.["list"];

    if (list == null || list === "") {
      return profileStorage.set("profile", {
        name: profile,
        list: [DEFAULT_PROFILE, profile].join(","),
      });
    } else {
      const uniqueList = [
        ...new Set([DEFAULT_PROFILE, ...list.split(","), profile]),
      ];

      return profileStorage.set("profile", {
        name: profile,
        list: uniqueList.join(),
      });
    }
  };

  const resetProfile = () => {
    const profile = DEFAULT_PROFILE;

    profileStorage.set("profile", {
      name: profile,
      list: [profile].join(","),
    });

    return [profile, [profile]] as const;
  };

  const profile = profileStorage.get("profile");

  if (profile != null) {
    const { name, list } = profile;

    return [
      //
      name,
      list?.split(",") ?? [],
      setProfile,
      resetProfile,
    ] as const;
  }

  return [
    DEFAULT_PROFILE,
    [DEFAULT_PROFILE],
    setProfile,
    resetProfile,
  ] as const;
}
