import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFileSync, existsSync } from "node:fs";
import { getInput } from "@actions/core";
import assistantDescription from "./helpers/assistant-description";
import commentPrompt from "./helpers/promptForComment";
import descrPrompt from "./helpers/promptForDescr";

type ResultType = "comment" | "description";
const mappedPrompt: {
  [k in ResultType]: {
    prompt: string;
    label: string;
  };
} = {
  comment: {
    prompt: commentPrompt,
    label: "commented",
  },
  description: {
    prompt: descrPrompt,
    label: "created",
  },
};

const OPENAI_API_KEY = getInput("OPENAI_API_KEY", { required: true });

export default async function main(diffFileURL: string, type: ResultType) {
  if (!diffFileURL) {
    throw Error("No diff file url provided..!");
  }
  if (!OPENAI_API_KEY) {
    throw Error("No OPENAI_API_KEY provided..!");
  }
  const modelOpenAI = createOpenAI({ apiKey: OPENAI_API_KEY })("gpt-4o-mini");
  // const modelAnthropic = anthropic("claude-3-haiku-20240307");

  let diffContent: string;
  try {
    if (!existsSync(diffFileURL)) {
      throw Error("Path doesn't exist");
    }
    diffContent = readFileSync(diffFileURL).toString("utf-8");
  } catch (err) {
    console.error("Error reading diff file:", err);
    throw Error((err as Error).message);
  }

  console.log("Start ai communication...");

  const prompt = mappedPrompt[type];
  const { text, usage } = await generateText({
    model: modelOpenAI,
    system: assistantDescription,
    prompt: `${prompt.prompt}\n\nHere is the diff file content:\n${diffContent}`,
  });

  console.log({ usage });
  return `#### ${prompt.label} by OpenAI  \n` + text;
}
