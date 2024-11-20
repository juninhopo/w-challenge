import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import bcrypt from 'bcrypt';
import { UserType } from '../../../queries/user/getUser';
import { UserPass } from '../../../../models/UserPass';
import { User } from '../../../../models/User';
import loginUserValidator from './validator';

const jwt = require('jsonwebtoken')

export type UserLoginInput = {
  email: string
  password: string
}

const mutation = mutationWithClientMutationId({
  name: 'LoginUser',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: UserLoginInput) => {
    const { email, password } = loginUserValidator(args)

    const user = await User.findOne({ email });

    console.log({ user });

    if(!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await UserPass.findOne({ _id: user._id });

    if (!hashedPassword) {
      throw new Error('Invalid password');
    }

    const validPassword = await bcrypt.compare(password, hashedPassword?.password);

    if (!validPassword) {
      throw new Error('Invalid password');
    }

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY_JWT, { expiresIn: '24h' });

    return {
      token,
      user,
    };
  },
  outputFields: {
    token: { type: GraphQLString },
    user: { type: UserType },
  }
})

export const LoginUserMutation = {
  ...mutation,
}
