export interface Question {
  id: string;
  name: string;
  question: string;
  code: string;
  createdAt: Date;
  answers: Answer[];
}

export interface Answer {
  answer: string;
  answeredAt: Date;
}
