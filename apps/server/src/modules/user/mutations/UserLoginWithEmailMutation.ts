import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import bcrypt from 'bcrypt';
import { UserPassModel } from '../UserPassModel';
import loginUserValidator from './UserLoginWithEmailValidator';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../../auth';
import { config } from '../../../config';
import { UserModel } from '../UserModel';
import { errorField, successField } from '@entria/graphql-mongo-helpers';
import * as UserLoader from '../UserLoader';
import { UserType } from '../UserType';

export type UserLoginInput = {
  email: string
  password: string
}

export default mutationWithClientMutationId({
  name: 'UserLoginWithEmail',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: UserLoginInput, context) => {
    const { email, password } = loginUserValidator(args)

    // REMEMBER: Interessante o jeito que fez usando o trim e o toLowerCase
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() });

    // REMEMBER: Eu sempre devolvia algum outro tipo de erro, mas gostei do jeito que
    // fez aqui, devolvendo sempre a mesma mensagem de erro.
    const defaultErrorMessage = 'Invalid credentials';
    if (!user) {
      return {
        error: defaultErrorMessage,
      };
    }

    // Aqui eu busco a senha hasheada do usuário
    const hashedPassword = await UserPassModel.findOne({ _id: user._id });
    if (!hashedPassword) {
      throw new Error('Invalid password');
    }

    // Aqui eu comparo a senha enviada com a senha hasheada
    // Vi que no relay vocês utilizam um user.authenticate(password) para fazer isso
    const validPassword = await bcrypt.compare(password, hashedPassword?.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const token = generateToken(user)

    context.setCookie(config.W_CHALLENGE, token)

    return {
      token,
      id: user._id,
      success: 'Logged with success',
    };
  },
  outputFields: {
    token: { 
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    me: { 
      type: UserType, 
      resolve: async ({ id }, _, context) => {
        return await UserLoader.load(context, id);
      },
    },
    error: {
      type: GraphQLString,
      description: 'Error message',
      resolve: ({ error }) => error,
    },
    success: {
      type: GraphQLString,
      description: 'Success message',
      resolve: ({ success }) => success,
    },
  }
})
