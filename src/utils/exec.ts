export async function exec(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("child_process").exec(
      command,
      (err: Error, stdout: string, stderr: string) => {
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
