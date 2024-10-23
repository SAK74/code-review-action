import "dotenv/config";

import aiClient from "./src/aiClient";

async function main() {
  try {
    const res = await aiClient("./diff.txt");
    console.log("Result: ", res);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
