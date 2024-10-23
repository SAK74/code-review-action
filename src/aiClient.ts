import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "node:fs";

export default async function main(diffFileURL: string) {
  if (!diffFileURL) {
    throw Error("No diff file url provided..!");
  }
  if (!process.env.OPENAI_API_KEY) {
    throw Error("No OPENAI_API_KEY provided..!");
  }
  const modelOpenAI = openai("gpt-4o-mini");
  // const modelAnthropic = anthropic("claude-3-haiku-20240307");

  const assistantDescription = readFileSync(
    "./helpers/assistant-description.txt",
    { encoding: "utf-8" }
  ).toString();
  const prompt = readFileSync("./helpers/prompt.txt", {
    encoding: "utf-8",
  }).toString();

  let diffContent: string;
  try {
    diffContent = readFileSync(diffFileURL).toString();
  } catch (err) {
    console.error("Error reading diff file:", err);
    throw Error((err as Error).message);
  }

  console.log("Start ai communication...");

  const { text, usage } = await generateText({
    model: modelOpenAI,
    system: assistantDescription,
    prompt: `${prompt}\n\nHere is the diff file content:\n${diffContent}`,
  });

  console.log({ usage });
  return text;
}
