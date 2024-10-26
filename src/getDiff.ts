import { context } from "@actions/github";
import { get } from "node:https";

function fetchWithRedirect(
  url: string,
  resolve: (val: string | PromiseLike<string>) => void,
  reject: (reason?: any) => void,
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
        resolve,
        reject,
        redirectCount + 1
      );
      return;
    }
    let diffContent = "";

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
    console.error("Error in read diff content: ", err.message);
    reject(err.message);
  });
}

export function getDiffContent() {
  const diffUrl = context.payload.pull_request?.diff_url;
  if (!diffUrl) {
    throw Error("Can't access to diff url!!!");
  }

  return new Promise<string>((resolve, reject) => {
    fetchWithRedirect(diffUrl, resolve, reject);
  });
}
