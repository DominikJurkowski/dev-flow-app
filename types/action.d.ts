interface SignInWithOAuthParams {
  provider: 'github' | 'google';
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface QuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends QuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}