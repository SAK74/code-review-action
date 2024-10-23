import "dotenv/config";
import { resolve } from "node:path";

import aiClient from "./aiClient";

console.log("Hello!");

async function main() {
  const res = await aiClient(resolve(__dirname, "./diff.txt"));

  console.log("Result: ", res);
}

main();
