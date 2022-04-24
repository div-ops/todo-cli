import fs from "fs";
import path from "path";

function getStoragePath(storageName: string) {
  const storagePathFile = `STORAGE_PATH_${storageName.toUpperCase()}`;

  if (fs.existsSync(path.join(__dirname, storagePathFile))) {
    return fs.readFileSync(path.join(__dirname, storagePathFile), "utf8");
  }

  const storagePath = path.join(__dirname, ".storage", storageName);

  fs.mkdirSync(storagePath, { recursive: true });

  fs.writeFileSync(path.join(__dirname, storagePathFile), storagePath);

  return storagePath;
}

export function createJsonStorage<T>(storageName: string) {
  const storagePath = getStoragePath(storageName);

  return {
    set: (key: string, value: T) => {
      const filePath = path.join(storagePath, key);
      console.log(filePath);

      fs.writeFileSync(filePath, JSON.stringify(value));

      return value;
    },

    get: (key: string) => {
      const filePath = path.join(storagePath, key);
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        return null;
      }
    },

    remove: (key: string) => {
      const filePath = path.join(storagePath, key);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return key;
    },
  };
}
