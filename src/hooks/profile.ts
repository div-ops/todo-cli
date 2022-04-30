import { createJsonStorage } from "../clients/json-storage";

export const DEFAULT_PROFILE = "default";

type Dic = Record<string, string>;

export function useProfile() {
  const profileStorage = createJsonStorage<Dic>({ name: "profile" });

  const setProfile = (profile: string) => {
    profileStorage.set("profile", { name: profile });
  };

  if (profileStorage.get("profile") != null) {
    const name = profileStorage.get("profile")?.["name"];

    if (name != null) {
      return [name, setProfile] as const;
    }
  }

  return [DEFAULT_PROFILE, setProfile] as const;
}
