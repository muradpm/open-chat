import { ollama } from "ollama-ai-provider";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: ollama(apiIdentifier),
    middleware: customMiddleware,
  });
};
