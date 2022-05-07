import { useProfile } from "../profile";
import { useRouter } from "../router";

export function useUpdateProfile() {
  const router = useRouter();
  const [getProfile, setProfile, resetProfile] = useProfile();

  return async ({
    command,
    options,
  }: {
    command: string;
    options: string[];
  }) => {
    command;

    const [profile, profileList] = await getProfile();

    if (options[0] == null) {
      return router.push("message", {
        query: {
          message: [
            `profile: ${profile}`,
            `profileList: ${profileList.join(",")}`,
          ].join("\n"),
        },
      });
    }

    if (options[0] === "reset") {
      resetProfile();

      return router.push("message", {
        query: { message: [`profile is reset`].join("\n") },
      });
    }

    setProfile(options[0]);

    return router.push("message", {
      query: {
        message: [
          `profile is updated to ${options[0]}`,
          `list: ${[...new Set([...profileList, options[0]])].join(",")}`,
        ].join("\n"),
      },
    });
  };
}
