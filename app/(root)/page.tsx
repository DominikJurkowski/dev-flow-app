import { auth } from '@/auth';
import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilter from '@/components/filters/HomeFilter';
import LocalSearch from '@/components/search/LocalSearch';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';
import { getQuestions } from '@/lib/actions/question.action';
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

// const test = async () => {
//   try {
//     return await api.users.getAll();
//   } catch (error) {
//     return handleError(error);
//   }
// };

const Home = async ({ searchParams }: SearchParamsProps) => {
  // const session = await auth();
  // const users = await test();
  // console.log(users);

  const session = await auth();
  console.log('Session: ', session);

  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { questions } = data || {};

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
      {success ? (
        <div className="mt-10 flex w-full flex-col gap-6">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} {...question} description={question.content} />
            ))
          ) : (
            <div className="mt-10 flex w-full items-center justify-center">
              <p className="text-dark400_light700">No questions found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="jusify-center mt-10 flex w-full items-center">
          <p className="text-dark400_light700">{error?.message || 'Failed to fetch questions'}</p>
        </div>
      )}
    </>
  );
};

export default Home;
