import { context } from "@actions/github";
import { get } from "node:https";
import { createWriteStream } from "node:fs";

function fetchWithRedirect(
  url: string,
  pathToFile: string,
  resolve: (val: void | PromiseLike<void>) => void,
  reject: (reason?: string) => void,
  redirectCount = 0
) {
  if (redirectCount > 2) {
    reject("To many redirects!!!");
  }

  get(url, (resp) => {
    // resp.setEncoding("utf-8");

    if (resp.statusCode === 302 && resp.headers.location) {
      fetchWithRedirect(
        resp.headers.location,
        pathToFile,
        resolve,
        reject,
        redirectCount + 1
      );
      return;
    }
    const writeStream = createWriteStream(pathToFile).on("finish", () => {
      resolve();
    });
    resp.pipe(writeStream);

    // resp.on("end", () => {
    //   resolve();
    // });
    resp.on("error", (err) => {
      console.error("Error in read diff content: ", err.message);
      reject(err.message);
    });
  }).on("error", (err) => {
    console.error("Error in read diff content: ", err.message);
    reject(err.message);
  });
}

export function getDiffContent(pathToFile: string) {
  const diffUrl = context.payload.pull_request?.diff_url;
  // const diffUrl = "https://github.com/SAK74/code-review-action/pull/1.diff";

  console.log({ diffUrl });

  if (!diffUrl) {
    throw Error("Can't access to diff url!!!");
  }

  return new Promise<void>((resolve, reject) => {
    fetchWithRedirect(diffUrl, pathToFile, resolve, reject);
  });
}
