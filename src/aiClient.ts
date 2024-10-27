import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "node:fs";
import assistantDescription from "./helpers/assistant-description";
import prompt from "./helpers/prompt";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function main(diffFileURL: string) {
  console.log({ diffFileURL });

  if (!diffFileURL) {
    throw Error("No diff file url provided..!");
  }
  if (!OPENAI_API_KEY) {
    throw Error("No OPENAI_API_KEY provided..!");
  }
  const modelOpenAI = openai("gpt-4o-mini");
  // const modelAnthropic = anthropic("claude-3-haiku-20240307");

  let diffContent: string;
  try {
    diffContent = readFileSync(diffFileURL).toString("utf-8");
  } catch (err) {
    console.error("Error reading diff file:", err);
    throw Error((err as Error).message);
  }

  console.log("Openapi key: ", OPENAI_API_KEY);

  console.log({ assistantDescription, prompt });
  console.log({ diffContent });

  // console.log("Start ai communication...");

  // const { text, usage } = await generateText({
  //   model: modelOpenAI,
  //   system: assistantDescription,
  //   prompt: `${prompt}\n\nHere is the diff file content:\n${diffContent}`,
  // });

  // console.log({ usage });
  return "text";
}
