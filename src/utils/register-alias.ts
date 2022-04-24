import fs from "fs";
import { getAppPath } from "./get-app-path";

export async function unregisterAlias(alias: string) {
  const binFile = `/Users/${process.env?.["USER"]}/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js`;

  const appPath = getAppPath(alias);

  if (!fs.existsSync(appPath)) {
    return `not exists ${JSON.stringify({ binFile, appPath })}.`;
  }

  fs.rm(appPath, () => null);

  return `removed ${JSON.stringify({ binFile, appPath })}.`;
}
