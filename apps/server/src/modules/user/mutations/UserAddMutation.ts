import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { User } from '../../../models/User';

export type UserAddInput = {
  name: string;
  email: string;
}

const mutation = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: UserAddInput) => {
    const user = await new User({
      name: args.name,
      email: args.email,
    }).save();

    return {
      user: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  },
  outputFields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
})

export const CreateUserMutation = {
  ...mutation,
}
