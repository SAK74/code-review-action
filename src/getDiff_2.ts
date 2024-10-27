import { context } from "@actions/github";
import { exec } from "@actions/exec";

export async function getDiff(pathToFile: string) {
  const baseSha = context.payload.pull_request?.base.sha as string;
  const headSha = context.payload.pull_request?.head.sha as string;
  if (!baseSha || !headSha) {
    throw Error("Can't access to PR context");
  }

  // console.log({ baseSha, headSha });

  await exec("git", ["diff", headSha, baseSha, `--output=${pathToFile}`]);
}