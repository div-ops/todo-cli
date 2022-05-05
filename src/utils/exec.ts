import child_process, { ExecException, ExecOptions } from "child_process";
import { ObjectEncodingOptions } from "fs";

export async function exec(
  command: string,
  options?: (ObjectEncodingOptions & ExecOptions) | undefined | null
): Promise<string | Buffer> {
  return new Promise((resolve, reject) => {
    child_process.exec(
      command,
      options ?? {},
      (
        err: ExecException | null,
        stdout: string | Buffer,
        stderr: string | Buffer
      ) => {
        if (err != null) {
          console.error(`[stderr] ${stderr}`);
          console.error(`${err.name}: ${err.message}`);
          console.error(`${err.name}: ${err.stack}`);

          return reject(stderr);
        }

        return resolve(stdout);
      }
    );
  });
}
