import "dotenv/config";
import { resolve } from "node:path";

import aiClient from "./aiClient";

async function main() {
  try {
    const res = await aiClient(resolve(__dirname, "./diff.txt"));
    console.log("Result: ", res);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
