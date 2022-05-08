import { storageOf } from "@divops/utils-json-storage";

export const DEFAULT_PROFILE = "default";

type Dic = Record<string, string>;

export function useProfile() {
  const profileStorage = storageOf<Dic>({ name: "profile" });

  const setProfile = async (profile: string) => {
    const list = (await profileStorage.get("profile"))?.["list"];

    if (list == null || list === "") {
      return await profileStorage.set("profile", {
        name: profile,
        list: [DEFAULT_PROFILE, profile].join(","),
      });
    } else {
      const uniqueList = [
        ...new Set([DEFAULT_PROFILE, ...list.split(","), profile]),
      ];

      return await profileStorage.set("profile", {
        name: profile,
        list: uniqueList.join(),
      });
    }
  };

  const resetProfile = async () => {
    const profile = DEFAULT_PROFILE;

    await profileStorage.set("profile", {
      name: profile,
      list: [profile].join(","),
    });

    return [profile, [profile]] as const;
  };

  const getProfile = async () => {
    const profile = await profileStorage.get("profile");

    if (
      profile == null ||
      profile === undefined ||
      profile?.["name"] == null ||
      profile?.["list"] == null
    ) {
      return [DEFAULT_PROFILE, [DEFAULT_PROFILE]] as const;
    }

    return [profile?.["name"], profile?.["list"]?.split(",")] as const;
  };

  return [getProfile, setProfile, resetProfile] as const;
}
