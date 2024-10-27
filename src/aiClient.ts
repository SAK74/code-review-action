import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync } from "node:fs";
import { getInput } from "@actions/core";

const OPENAI_API_KEY = getInput("OPENAI_API_KEY", { required: true });

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

  const assistantDescription = readFileSync(
    "./helpers/assistant-description.txt",
    { encoding: "utf-8" }
  ).toString();
  const prompt = readFileSync("./helpers/prompt.txt", {
    encoding: "utf-8",
  }).toString();

  console.log("Openapi key: ", OPENAI_API_KEY);

  // console.log({ assistantDescription, prompt });

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
