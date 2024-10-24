// import "dotenv/config";
import core from "@actions/core";

import aiClient from "./src/aiClient";

// const openapiKey = core.getInput('OPENAI_API_KEY')
// const env = process.env;
// console.log({ env });

async function main() {
  try {
    const res = await aiClient("./diff.txt");
    console.log("Result: ", res);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// main();
