export type QuestionCardProps = {
  _id: string;
  title: string;
  description: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; image: string };
  upvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
};
