import { context } from "@actions/github";
import { get } from "node:https";

export function getDiffContent() {
  const diffUrl = context.payload.pull_request?.diff_url;
  if (!diffUrl) {
    throw Error("Can't access to diff url!!!");
  }
  let diffContent = "";
  get(diffUrl, (resp) => {
    resp.on("data", (data) => {
      diffContent += data;
    });
    resp.on("error", (err) => {
      console.error("Error in read diff content: ", err.message);
      throw Error(err.message);
    });
  });

  return diffContent;
}
