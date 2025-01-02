// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "llama-3.2",
    label: "Llama 3.2",
    apiIdentifier: "llama-3.2",
    description: "OSS model for various diverse NLP tasks",
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "llama-3.2";
