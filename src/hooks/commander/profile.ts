import { useProfile } from "../profile";
import { useRouter } from "../router";

export function useUpdateProfile() {
  const router = useRouter();
  const [profile, setProfile] = useProfile();

  return ({ options }: { options: string[] }) => {
    if (options[0] == null) {
      return router.push("message", {
        query: { message: `profile: ${profile}` },
      });
    }

    setProfile(options[0]);

    return router.push("message", {
      query: { message: `profile is updated to ${options[0]}` },
    });
  };
}
