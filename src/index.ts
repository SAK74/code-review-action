import { addComment } from "./addComment";
import aiClient from "./aiClient";
import { getDiff } from "./getDiff_2";
import { getBooleanInput } from "@actions/core";
import { context } from "@actions/github";
import { addDescr } from "./addDecription";

const diffPath = "./diff.txt";

/**
 * The main function that performs the code review actions.
 * It checks if comments or descriptions should be added based on the input parameters,
 * generates a diff file, and adds comments or descriptions accordingly.
 */
export async function main() {
  try {
    const shouldComment = getBooleanInput("with-comment");

    const shouldDescrCreate = context.payload.pull_request?.body === "auto";

    if (!shouldComment && !shouldDescrCreate) {
      return;
    }

    await getDiff(diffPath);
    console.log("Diff file was created");

    if (shouldComment) {
      const review = await aiClient(diffPath, "comment");
      // const review = "Exampled Comment from action";
      await addComment(review);
    }

    if (shouldDescrCreate) {
      const descrContent = await aiClient(diffPath, "description");
      // const descrContent = "exampled description";
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
