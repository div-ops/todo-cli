import fs from "fs";
import path from "path";

function getStoragePathFile(storageName: string) {
  return `STORAGE_PATH_${storageName.toUpperCase()}`;
}

function getStoragePath(storageName: string) {
  const storagePathFile = getStoragePathFile(storageName);

  if (fs.existsSync(path.join(__dirname, storagePathFile))) {
    return fs.readFileSync(path.join(__dirname, storagePathFile), "utf8");
  }

  const storagePath = path.join(__dirname, ".storage", storageName);

  fs.mkdirSync(storagePath, { recursive: true });

  fs.writeFileSync(path.join(__dirname, storagePathFile), storagePath);

  return storagePath;
}

export function createJsonStorage<T>(storageName: string) {
  return {
    base: (): string => {
      return getStoragePath(storageName);
    },

    reset: (): void => {
      try {
        fs.rmSync(getStoragePath(storageName), { recursive: true });
      } catch {
        //
      }
      try {
        fs.rmSync(path.join(__dirname, getStoragePathFile(storageName)));
      } catch {
        //
      }
    },

    set: (key: string, value: T): T => {
      const filePath = path.join(getStoragePath(storageName), key);

      fs.writeFileSync(filePath, JSON.stringify(value));

      return value;
    },

    get: (key: string): T | null => {
      const filePath = path.join(getStoragePath(storageName), key);

      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        return null;
      }
    },

    remove: (key: string): string => {
      const filePath = path.join(getStoragePath(storageName), key);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return key;
    },
  };
}
