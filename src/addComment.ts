import { exec } from "@actions/exec";
import { context } from "@actions/github";

export async function addComment(content: string) {
  const prNumber = context.payload.pull_request?.number;
  if (!prNumber) {
    throw Error("Can't access PR number");
  }
  await exec("gh", ["pr", "comment", `${prNumber}`, "-b", `\"${content}\"`]);
}
