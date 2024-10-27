import aiClient from "./aiClient";
import { getDiffContent } from "./getDiff";

// const openapiKey = core.getInput('OPENAI_API_KEY')
// const env = process.env;
// console.log({ env });

const diffPath = "./diff.txt";

async function main() {
  try {
    await getDiffContent(diffPath);
    console.log("Diff file was created");

    const review = await aiClient(diffPath);
    console.log("Review: ", review);
  } catch (error) {
    console.error(
      "Error in main function:",
      (error as Error)?.message ?? "Unknown error"
    );
  }
}

main();

// any changes
