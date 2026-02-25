import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { redirect } from "next/navigation";

const AskAQuestion = async () => {
  const session = await auth();

  if (!session) return redirect(ROUTES.SIGN_IN);


  return <>
  <h1>Ask the Question</h1>

  <QuestionForm />
  </>;
};

export default AskAQuestion;
