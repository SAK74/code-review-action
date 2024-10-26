// import "dotenv/config";
// import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";

import { version } from "node:process";

import aiClient from "./aiClient";
import { getDiffContent } from "./getDiff";

// const openapiKey = core.getInput('OPENAI_API_KEY')
// const env = process.env;
// console.log({ env });

console.log("Hello from index.js!!!");
console.log({ version });
console.log({ context });

const diffContent = getDiffContent();
console.log({ diffContent });

async function main() {
  try {
    const res = await aiClient("./diff.txt");
    console.log("Result: ", res);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// main();
