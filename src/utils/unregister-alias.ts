import fs from "fs";
import { getAppPath } from "./get-app-path";

// /Users/$USER/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js
export async function registerAlias(alias: string) {
  const binFile = `/Users/${process.env?.["USER"]}/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js`;
  const appPath = getAppPath(alias);

  if (fs.existsSync(appPath)) {
    return `already exists ${JSON.stringify({ binFile, appPath })}.`;
  }

  if (process.env?.["USER"] != null && fs.existsSync(binFile)) {
    fs.writeFileSync(appPath, `node ${binFile} $1 $2 $3 $4 $5 $6 $7 $8 $9`);
    fs.chmodSync(appPath, 0o755);

    return `installed ${JSON.stringify({ binFile, appPath })}.`;
  }

  return `not installed ${JSON.stringify({ binFile, appPath })}.`;
}
