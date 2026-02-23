"use server";
import mongoose from 'mongoose';
import action from '../handlers/action';
import handleError from '../handlers/error';
import { SignInSchema, SignUpSchema } from '../validation';
import User from '@/database/user.model';
import Account from '@/database/account.model';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { NotFoundError, UnauthorizedError } from '../http-errors';

export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { params: validatedParams } = validationResult;

  if (!validatedParams) {
    return handleError(new Error('Missing params')) as ErrorResponse;
  }

  const { name, username, email, password } = validatedParams;

  const session = await mongoose.startSession();
  session.startTransaction();

  let committed = false;

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const exisitingUsername = await User.findOne({ username }).session(session);

    if (exisitingUsername) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await User.create([{ username, name, email }], { session });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          email,
          password: hashedPassword,
          provider: 'credentials',
          providerAccountId: email,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    committed = true;

    await signIn('credentials', { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    if (!committed) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(params: Pick<AuthCredentials, "email" | "password">): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { params: validatedParams } = validationResult;

  if (!validatedParams) {
    return handleError(new Error('Missing params')) as ErrorResponse;
  }

  const { email, password } = validatedParams;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new NotFoundError('User not found');
    
    const existingAccount = await Account.findOne({
      provider: 'credentials',
      providerAccountId: email,
    });

    if (!existingAccount) throw new NotFoundError('Account not found');

    const passwordMatch = await bcrypt.compare(password, existingAccount.password!);

    if (!passwordMatch) throw new UnauthorizedError('Invalid password');

    await signIn('credentials', { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  } 
}
