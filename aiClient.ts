import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "node:fs";

export default async function main(diffFileURL: string) {
  const modelOpenAI = openai("gpt-4o-mini");
  // const modelAnthropic = anthropic("claude-3-haiku-20240307");

  const assistantDescription = readFileSync(
    "./helpers/assistant-description.txt",
    { encoding: "utf-8" }
  ).toString();
  const prompt = readFileSync("./helpers/prompt.txt", {
    encoding: "utf-8",
  }).toString();

  // console.log("Path: ", diffFileURL);
  const diffContent = readFileSync(diffFileURL).toString();
  // console.log({ diff });

  // console.log({ assistantDescription });
  // console.log({ prompt });

  console.log("Start ai communication...");

  const { text, usage } = await generateText({
    model: modelOpenAI,
    system: assistantDescription,
    prompt: `${prompt}\n\nHere is the diff file content:\n${diffContent}`,
  });

  console.log({ usage });
  return text;
}
