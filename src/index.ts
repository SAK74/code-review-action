import { addComment } from "./addComment";
import aiClient from "./aiClient";
// import { getDiffContent } from "./getDiff";
import { getDiff } from "./getDiff_2";
import { getBooleanInput } from "@actions/core";
import commentPrompt from "./helpers/promptForComment";
import descrPromp from "./helpers/promptForDescr";
import { context } from "@actions/github";
import { addDescr } from "./addDecription";

// const openapiKey = core.getInput('OPENAI_API_KEY')
// const env = process.env;
// console.log({ env });

const diffPath = "./diff.txt";

async function main() {
  try {
    const shouldCommented = getBooleanInput("with-comment");
    console.log({ shouldCommented });

    const shouldDescrCreate = context.payload.pull_request?.body === "auto";
    console.log({ shouldDescrCreate });

    if (!shouldCommented && !shouldDescrCreate) {
      return;
    }

    await getDiff(diffPath);
    console.log("Diff file was created");

    if (shouldCommented) {
      // const review = await aiClient(diffPath, commentPrompt);
      // console.log("Review: ", review);
      const review = "Exampled Comment from action";

      await addComment(review);
    }
    if (shouldDescrCreate) {
      // const descrContent = await aiClient(diffPath, descrPromp);
      const descrContent = "exampled description";
      await addDescr(descrContent);
    }
  } catch (error) {
    console.error(
      "Error in main function:",
      (error as Error)?.message ?? "Unknown error"
    );
  }
}

main();
