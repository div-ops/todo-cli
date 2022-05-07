import { registerNodeBinAlias } from "@divops/utils-node-bin-alias";
import { getNodeBinPath } from "@divops/utils-node-bin-path";

// /Users/$USER/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js
export async function registerAlias(alias: string) {
  try {
    const binFile = `/Users/${process.env?.["USER"]}/.config/yarn/global/node_modules/\@divops/todo-cli/dist/index.js`;

    await registerNodeBinAlias(alias, binFile);

    return `installed ${JSON.stringify({ nodeBinPath: getNodeBinPath() })}.`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      return `installed ${JSON.stringify({ nodeBinPath: getNodeBinPath() })}.`;
    }

    return `not installed ${JSON.stringify({
      nodeBinPath: getNodeBinPath(),
    })}.`;
  }
}
