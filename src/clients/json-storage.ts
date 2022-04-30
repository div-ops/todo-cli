import fs from "fs";
import path from "path";
import { DEFAULT_PROFILE } from "../hooks/profile";

function getUserDir() {
  if (fs.existsSync(`/Users/${process.env?.["USER"]}`)) {
    return `/Users/${process.env?.["USER"]}`;
  }

  return path.join(__dirname);
}

function getStoragePathFile({
  profile,
  storageName,
}: {
  profile: string;
  storageName: string;
}) {
  return path.join(
    getUserDir(),
    ".todo-cli",
    "storage-config",
    `STORAGE_PATH_${
      (profile === DEFAULT_PROFILE ? "" : `${profile.toUpperCase()}_`) +
      storageName.toUpperCase()
    }`
  );
}

function getStoragePath({
  profile,
  storageName,
}: {
  profile: string;
  storageName: string;
}) {
  const storagePathFile = getStoragePathFile({ profile, storageName });

  if (fs.existsSync(storagePathFile)) {
    return fs.readFileSync(storagePathFile, "utf8");
  }

  profile = DEFAULT_PROFILE ? "" : profile;

  const storagePath = path.join(
    getUserDir(),
    ".todo-cli",
    "storage",
    profile,
    storageName
  );

  fs.mkdirSync(storagePath, { recursive: true });

  if (!fs.existsSync(path.dirname(storagePathFile))) {
    fs.mkdirSync(path.dirname(storagePathFile), { recursive: true });
  }

  fs.writeFileSync(storagePathFile, storagePath);

  return storagePath;
}

export function createJsonStorage<T>({
  profile: optionalProfile,
  name: storageName,
}: {
  profile?: string;
  name: string;
}) {
  const profile = (
    optionalProfile === undefined ? DEFAULT_PROFILE : optionalProfile
  ) as string;

  return {
    base: (): string => {
      return getStoragePath({ profile, storageName });
    },

    reset: (): void => {
      try {
        fs.rmSync(getStoragePath({ profile, storageName }), {
          recursive: true,
        });
      } catch {
        //
      }
      try {
        fs.rmSync(
          path.join(getUserDir(), getStoragePathFile({ profile, storageName }))
        );
      } catch {
        //
      }
    },

    set: (key: string, value: T): T => {
      const filePath = path.join(getStoragePath({ profile, storageName }), key);

      fs.writeFileSync(filePath, JSON.stringify(value));

      return value;
    },

    get: (key: string): T | null => {
      const filePath = path.join(getStoragePath({ profile, storageName }), key);

      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        return null;
      }
    },

    remove: (key: string): string => {
      const filePath = path.join(getStoragePath({ profile, storageName }), key);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return key;
    },
  };
}
