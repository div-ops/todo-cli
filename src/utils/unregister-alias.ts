import { unregisterNodeBinAlias } from "@divops/utils-node-bin-alias";
import { getNodeBinPath } from "@divops/utils-node-bin-path";

export async function unregisterAlias(alias: string) {
  try {
    if (!(await unregisterNodeBinAlias(alias))) {
      console.log(`Failed to unregister alias ${alias}`);

      return `not exists ${JSON.stringify({ nodeBinPath: getNodeBinPath() })}.`;
    }

    return `removed ${JSON.stringify({ nodeBinPath: getNodeBinPath() })}.`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return `[Error] ${error.message}`;
  }
}
