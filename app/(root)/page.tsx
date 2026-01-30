import { auth, signOut } from '@/auth';
import LocalSearch from '@/components/search/LocalSearch';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';
import Link from 'next/link';

const questions = [
  {
    _id: '1',
    title: 'How to learn React?',
    description: 'I want to learn React, can anyone help me?',
    tags: [
      { _id: '2', name: 'react' },
      { _id: '3', name: 'javascript' },
      { _id: '4', name: 'nextjs' },
    ],
    author: {
      _id: '1',
      name: 'John Doe',
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'How to learn Next.js?',
    description: 'I want to learn Next.js, can anyone help me?',
    tags: [
      { _id: '5', name: 'react' },
      { _id: '3', name: 'javascript' },
      { _id: '4', name: 'nextjs' },
    ],
    author: {
      _id: '2',
      name: 'Jane Doe',
    },
    upvotes: 20,
    answers: 10,
    views: 200,
    createdAt: new Date(),
  },
];

interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParamsProps) => {
  // const session = await auth();

  const { query = '' } = await searchParams;

  const filteredQuestions = questions.filter((question) => question.title.toLowerCase().includes(query?.toLowerCase()));

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="primary-gradient text-light-900! min-h-[46px] px-4 py-3" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search for a question..."
          otherClasses="flex-1"
        />
      </section>
      HomeFilter
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h2 key={question._id}>{question.title}</h2>
        ))}
      </div>
    </>
  );
};

export default Home;
