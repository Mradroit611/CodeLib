// model.ts
export interface Snippet {
  id?: string; // Make sure id is optional if it's not always provided
  name: string;
  title?: string;
  description: string;
  question?: string;
  code: string;
  createdAt: Date;
}
