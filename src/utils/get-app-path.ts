import path from "path";

// /Users/$USER/.nvm/versions/node/v16.14.2/bin
export function getAppPath(alias: string) {
  if (process?.env?.["_"] == null) {
    throw new Error(`process.env._ is null! (${process?.env?.["_"]})`);
  }

  const appPath = path.join(process?.env?.["_"], "..", alias);
  return appPath;
}
