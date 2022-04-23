import fs from "fs";
import path from "path";
import { useEffect, useState } from "react";

export function useMainOption() {
  const [message, setMessage] = useState<string | undefined>();
  const command = getMainOption();
  const appPath = getAppPath("todo");

  useEffect(() => {
    (async () => {
      switch (command) {
        case "i":
        case "install": {
          if (fs.existsSync(appPath)) {
            return;
          }

          setMessage("successfully installed");
          return registerAlias("todo");
        }

        case "r":
        case "remove":
        case "uninstall": {
          if (!fs.existsSync(appPath)) {
            return;
          }

          setMessage("successfully uninstalled");
          return await unregisterAlias("todo");
        }
        default:
          return;
      }
    })();
  }, [command]);

  return message;
}

async function unregisterAlias(alias: string) {
  const appPath = getAppPath(alias);
  fs.rm(appPath, () => null);
  console.log("removed");
}

function registerAlias(alias: string) {
  const appPath = getAppPath(alias);
  fs.writeFileSync(appPath, `yarn dlx -q @divops/todo-cli`);
  fs.chmodSync(appPath, 0o755);

  // fs.writeFileSync(`${appPath}_v2`, `${__dirname}/../../../dist/index.js`);
  // fs.chmodSync(`${appPath}_v2`, 0o755);
  console.log("installed");
  console.log({ __dirname });
  console.log({
    index: path.join(`${__dirname}`, `..`, `..`, `..`, `dist`, `index.js`),
  });
}

function getAppPath(alias: string) {
  if (process?.env?.["_"] == null) {
    throw new Error(`process.env._ is null! (${process?.env?.["_"]})`);
  }

  const appPath = path.join(process?.env?.["_"], "..", alias);
  return appPath;
}

function getMainOption() {
  if (process.argv.length <= 2) {
    return null;
  }

  return process.argv[process.argv.length - 1];
}
