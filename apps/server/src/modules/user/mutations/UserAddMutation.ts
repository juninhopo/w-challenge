import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { User } from '../../../models/User';
import { UserPass } from '../../../models/UserPass';
import bcrypt from 'bcrypt';

export type UserAddInput = {
  name: string;
  email: string;
  password: string;
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
    password: {
      type: new GraphQLNonNull(GraphQLString),
    }
  },
  mutateAndGetPayload: async (args: UserAddInput) => {
    // Cria o usuário
    const user = await new User({
      name: args.name,
      email: args.email,
    }).save();

    console.log(user)

    // Faz o hash da senha
    const hashedPassword = await bcrypt.hash(args.password, 10);

    // Armazena a senha hasheada na tabela UserPass
    const userPass = await new UserPass({
      _id: user._id,
      password: hashedPassword,
    }).save();

    return {
      user: user._id.toString(),
      name: user.name,
      status: user.status,
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
