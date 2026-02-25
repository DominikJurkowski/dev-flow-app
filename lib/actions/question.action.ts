'use server';

import QuestionModel from '@/database/question.model';
import action from '../handlers/action';
import handleError from '../handlers/error';
import { AskQuestionSchema } from '../validation';
import mongoose from 'mongoose';
import Tag from '@/database/tag.model';
import TagQuestion, { ITagQuestion } from '@/database/tag-question.model';

export async function createQuestion(params: QuestionParams): Promise<ActionResponse<Question | null>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await QuestionModel.create([{ title, content, author: userId }], { session });

    if (!question) {
      throw new Error('Failed to create question');
    }

    // TODO: My changes. Added types ITagQuestion and mongoose.Types.ObjectId[]
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments: ITagQuestion[] = [];

    tags.forEach(async (tag) => {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      tagIds.push(existingTag._id);

      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    });

    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await QuestionModel.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session });

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question))}
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
