export interface Snippet {
  id?: string;  // Optional, in case you want to handle document IDs
  name: string;
  title: string;
  description: string;
  codes: string[]; // Update to an array of strings
  createdAt: Date;
}
