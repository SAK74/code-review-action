import { addComment } from "./addComment";
import aiClient from "./aiClient";
// import { getDiffContent } from "./getDiff";
import { getDiff } from "./getDiff_2";

// const openapiKey = core.getInput('OPENAI_API_KEY')
// const env = process.env;
// console.log({ env });

const diffPath = "./diff.txt";

async function main() {
  try {
    await getDiff(diffPath);
    console.log("Diff file was created");

    // const review = await aiClient(diffPath);
    // console.log("Review: ", review);

    const review = "Exampled Comment from action";

    await addComment(review);
  } catch (error) {
    console.error(
      "Error in main function:",
      (error as Error)?.message ?? "Unknown error"
    );
  }
}

main();
