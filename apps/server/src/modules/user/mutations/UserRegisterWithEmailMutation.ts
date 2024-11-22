import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { UserModel } from '../UserModel';
import { UserPassModel } from '../UserPassModel';
import bcrypt from 'bcrypt';
import createUserValidator from './UserRegisterWithEmailValidator';
import { generateToken } from '../../../auth';
import { config } from '../../../config';
import * as UserLoader from '../UserLoader';
import { UserType } from '../UserType';

export type UserAddInput = {
  name: string;
  email: string;
  username: string;
  password: string;
}

export default mutationWithClientMutationId({
  name: 'UserRegisterWithEmail',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    }
  },
  mutateAndGetPayload: async (args: UserAddInput, context) => {
    const { name, email, username, password } = createUserValidator(args);

    const hasUser = (await UserModel.countDocuments({ email: email.trim().toLowerCase() })) > 0;

    if (hasUser) {
      return {
        errors: "Email already in user",
      };
    }

    const user = await new UserModel({
      name,
      email,
      username,
    }).save();

    const token = generateToken(user);

    context.setCookie(config.W_CHALLENGE, token);

    // Faz o hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Armazena a senha hasheada na tabela UserPass
    await new UserPassModel({
      _id: user._id,
      password: hashedPassword,
    }).save();

    return {
      token,
      id: user._id,
      success: 'User registered with success',
    };
  },
  // TODO: Verificar por que está retornando tudo como null
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    me: { 
      type: UserType,
      resolve: async ({ id }, _, context) => {
        return await UserLoader.load(context, id);
      }
    },
  },
})
