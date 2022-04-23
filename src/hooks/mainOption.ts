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
          return await registerAlias("todo");
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
  const binFile = `/Users/${process.env?.["USER"]}/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js`;

  const appPath = getAppPath(alias);

  fs.rm(appPath, () => null);

  console.log(`removed ${JSON.stringify({ binFile, appPath })}`);
}

// /Users/$USER/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js
async function registerAlias(alias: string) {
  const binFile = `/Users/${process.env?.["USER"]}/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js`;
  const appPath = getAppPath(alias);

  if (process.env?.["USER"] != null && fs.existsSync(binFile)) {
    fs.writeFileSync(appPath, `node ${binFile}`);
    fs.chmodSync(appPath, 0o755);

    console.log(`installed ${JSON.stringify({ binFile, appPath })}`);

    return;
  }

  console.log(`not installed ${JSON.stringify({ binFile, appPath })}`);
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
