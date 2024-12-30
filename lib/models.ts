// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast lightweight tasks",
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "gpt-4o",
    description: "For complex multi-step tasks",
  },
  {
    id: "llama-3.2",
    label: "Llama 3.2",
    apiIdentifier: "llama-3.2",
    description: "OSS model for various diverse NLP tasks",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "llama-3.2";
