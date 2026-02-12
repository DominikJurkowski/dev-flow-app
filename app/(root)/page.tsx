import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilter from '@/components/filters/HomeFilter';
import LocalSearch from '@/components/search/LocalSearch';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';
import { api } from '@/lib/api';
import handleError from '@/lib/handlers/error';
import Link from 'next/link';

const questions = [
  {
    _id: '1',
    title: 'How to learn React?',
    description: 'I want to learn React, can anyone help me?',
    tags: [{ _id: '1', name: 'react' }],
    author: {
      _id: '1',
      name: 'John Doe',
      image: 'https://github.com/shadcn.png',
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
    tags: [{ _id: '3', name: 'javascript' }],
    author: {
      _id: '2',
      name: 'Jane Doe',
      image: 'https://github.com/shadcn.png',
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

const test = async () => {
  try {
    return await api.users.getAll();
  } catch (error) {
    return handleError(error);
  }
};

const Home = async ({ searchParams }: SearchParamsProps) => {
  // const session = await auth();
  const users = await test();
  console.log(users);

  const { query = '', filter = '' } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query?.toLowerCase());
    const matchesFilter = filter ? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;
    return matchesQuery && matchesFilter;
  });

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
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} {...question} />
        ))}
      </div>
    </>
  );
};

export default Home;
