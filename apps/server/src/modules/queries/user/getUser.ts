import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import mongoose from 'mongoose'
import { User } from '../../../models/User'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    status: { type: GraphQLString },
  },
})

export const getUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, args: { id: string }) => {
    console.log(`Searching for user with ID: ${args.id}`)

    const user = await User.findById(args.id)
    console.log({ user })

    if (!user) {
      throw new Error('User not found');
    }

    return user
  },
}
