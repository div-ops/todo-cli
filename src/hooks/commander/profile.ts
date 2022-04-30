import { useProfile } from "../profile";
import { useRouter } from "../router";

export function useUpdateProfile() {
  const router = useRouter();
  const [profile, list, setProfile, resetProfile] = useProfile();

  return ({ options }: { options: string[] }) => {
    if (options[0] == null) {
      return router.push("message", {
        query: {
          message: [`profile: ${profile}`, `list: ${list.join(",")}`].join(
            "\n"
          ),
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
          `list: ${[...new Set([...list, options[0]])].join(",")}`,
        ].join("\n"),
      },
    });
  };
}
