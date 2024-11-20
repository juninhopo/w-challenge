import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { User } from '../../../../models/User'
import getUserValidator from './validator'

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    status: { type: GraphQLString },
  },
})

export const getUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, args: { id: string }) => {
    const { id } = getUserValidator(args)

    console.log(`Searching for user with ID: ${id}`)

    const user = await User.findById(id)
    console.log({ user })

    if (!user) {
      throw new Error('User not found');
    }

    return user
  },
}
