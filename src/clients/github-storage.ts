import { Octokit } from "@octokit/rest";

export function storageOf<T>({
  profile: basePath = "",
  name: tree,
}: {
  profile?: string;
  name: string;
}) {
  const { TODO_GITHUB_REPO: repoUrl = "", TODO_GITHUB_TOKEN: token = "" } =
    process.env;

  if (basePath == null) {
    throw new Error(`basePath is null`);
  }

  if (basePath !== "" && !basePath.startsWith("/")) {
    basePath = `/${basePath}`;
  }

  if (token === "" || repoUrl == "") {
    throw new Error(
      [
        `TODO_GITHUB_REPO and TODO_GITHUB_TOKEN must be set in the environment`,
        `환경변수로 TODO_GITHUB_REPO와 TODO_GITHUB_TOKEN을 설정해야 합니다.`,
        `https://github.com/settings/tokens 으로 가서 설정해주세요.`,
        ``,
        `e.g. export TODO_GITHUB_REPO=https://github.com/owner/repo`,
        `e.g. export TODO_GITHUB_TOKEN=ghp_GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG`,
      ].join("\n")
    );
  }

  if (basePath != null && basePath !== "" && !basePath.startsWith("/")) {
    throw new Error(`profile must start with "/"`);
  }

  const octokit = new Octokit({ auth: token });

  const url = `${repoUrl}${basePath ?? ""}`;

  if (!url?.startsWith("https://")) {
    throw new Error("url must start with https://");
  }

  const protocol = url.split(":")[0];
  const domain = `${url.replace(/^https:\/\//, "").split("/")[0]}`;
  const baseUrl = `${protocol}://${domain}`;
  const owner = url.replace(`${baseUrl}/`, "").split("/")[0];
  const repo = url.replace(`${baseUrl}/${owner}/`, "").split("/")[0];
  const prefix = url.replace(`${baseUrl}/${owner}/${repo}`, "");

  tree = prefix === "" ? tree : `${prefix}/${tree}`;

  if (owner == null || repo == null) {
    throw new Error("url must have owner and repo");
  }

  if (
    basePath != null &&
    basePath !== "" &&
    url.replace(basePath, "") === url
  ) {
    throw new Error("url must contain a tree path");
  }

  return {
    set: async (key: string, value: T): Promise<T> => {
      const path = `${tree}/${key}`.replace(/^\//, "");

      const sha = await (async () => {
        try {
          const { data: target } = (await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
          })) as { data: { sha: string } };
          return target.sha;
        } catch {
          return;
        }
      })();

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        sha,
        message: `update ${key}`,
        content: Buffer.from(JSON.stringify(value)).toString("base64"),
      });

      return value;
    },

    get: async (key: string): Promise<T | null> => {
      const path = `${tree}/${key}`.replace(/^\//, "");

      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path,
        });

        const { content } = data as { content: string };

        const decoded = JSON.parse(
          Buffer.from(content, "base64").toString("utf8")
        ) as T;

        return decoded;
      } catch (error: any) {
        if (error.message === "Not Found") {
          return null;
        }

        if (error.message === "Bad credentials") {
          console.error(
            [
              `TODO_GITHUB_REPO and TODO_GITHUB_TOKEN must be set in the environment`,
              `환경변수로 TODO_GITHUB_REPO와 TODO_GITHUB_TOKEN을 설정해야 합니다.`,
              `https://github.com/settings/tokens 으로 가서 설정해주세요.`,
              ``,
              `e.g. export TODO_GITHUB_REPO=https://github.com/owner/repo`,
              `e.g. export TODO_GITHUB_TOKEN=ghp_GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG`,
            ].join("\n")
          );
          throw error;
        }

        throw error;
      }
    },

    remove: async (key: string): Promise<void> => {
      const path = `${tree}/${key}`.replace(/^\//, "");

      const { data: target } = (await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      })) as
        | { data: { path: string; sha: string } }
        | { data: Array<{ path: string; sha: string }> };

      if (Array.isArray(target)) {
        for (const item of target) {
          await octokit.rest.repos.deleteFile({
            owner,
            repo,
            path: item.path,
            message: `remove ${key}`,
            sha: item.sha,
          });
        }

        return;
      }

      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path,
        message: `remove ${key}`,
        sha: (target as { sha: string }).sha,
      });

      return;
    },
    reset: () => {
      return;
    },
  };
}
