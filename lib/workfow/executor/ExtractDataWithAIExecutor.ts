import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWithAITask } from "../task/ExtractDateWithAi";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";



export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->Credential not found");
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->prompt not defined");
    }
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->prompt not defined");
    }

    //  get credentials from database using database id
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const planeCredentialValue = symmetricDecrypt(credential.value);

    if (!planeCredentialValue) {
      environment.log.error("Cannot decrypt credential value");
      return false;
    }

    // const openai = new OpenAI({
    //   apiKey: planeCredentialValue,
    // });

    // const targetUrl = "https://ollama-gpu.echelonify.com/v1/chat/completions";

    // const combinedPrompt = `
    //     You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.

    //     Content:
    //     ${content}

    //     Prompt:
    //     ${prompt}
    //     `;

  

    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system",
        content: "You are a web scraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input, along with a prompt specifying the data to extract. Your response should always be a JSON array or object containing only the extracted data, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Ensure the output is always a valid JSON array without surrounding text.Except the valid json there should not be any other text, character, strings, or symbols",
      },
      {
        role: "user",
        content: content,
      },
      {
        role: "user",
        content: prompt,
      },
    ];
    
    
    
    

    // const body = {
    //   prompt: messages,
    // };

    // const url = `https://viresh.openai.azure.com/openai/deployments/Viresh-v2/chat/completions?api-version=2024-10-21`;

    // const response = await fetch("https://viresh-v2.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2023-03-15-preview", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "api-key": "86fea170c65341bc9efa5b647e210f45",
    //   },
    //   body: JSON.stringify(body),
    // });
    const model = "gpt-4o";
    const apiKey = "86fea170c65341bc9efa5b647e210f45";
    const openai = new OpenAI({
      apiKey,
      baseURL: `https://viresh-v2.openai.azure.com/openai/deployments/${model}`,
      defaultQuery: { "api-version": "2023-12-01-preview" },
      defaultHeaders: { "api-key": apiKey },
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: false,
      messages,
    });

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
    //     },
    //     {
    //       role: "user",
    //       content: content,
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   temperature: 1,
    // });
    // const result = await responseOllama.json();

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info( 
      `Completion tokens: ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message?.content;

    console.log("result", JSON.parse(result!));

    if (!result) {
      environment.log.error("No response from AI");
      return false;
    }


    environment.setOutput("Extracted data", result);

    return true;
  } catch (error: any) {
    console.log("error", error);
    environment.log.error(error.message);
    return false;
  }
}
