import { context } from "@actions/github";
import { get } from "node:https";

export function getDiffContent() {
  const diffUrl = context.payload.pull_request?.diff_url;
  if (!diffUrl) {
    throw Error("Can't access to diff url!!!");
  }
  console.log({ diffUrl });

  return new Promise<string>((resolve, reject) => {
    let diffContent = "";
    get(diffUrl, (resp) => {
      resp.on("data", (data) => {
        diffContent += data;
      });
      resp.on("end", () => {
        resolve(diffContent);
      });
      resp.on("error", (err) => {
        console.error("Error in read diff content: ", err.message);
        reject(err.message);
      });
    }).on("error", (err) => {
      reject(err.message);
    });
  });

  // return diffContent;
}
