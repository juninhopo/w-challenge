import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { UserModel } from '../../../user/UserModel'
import getUserValidator from './validator'
import { UserType } from '../../../user/UserType'

export const getUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, args: { id: string }) => {
    const { id } = getUserValidator(args)

    console.log(`Searching for user with ID: ${id}`)

    const user = await UserModel.findById(id)
    console.log({ user })

    if (!user) {
      throw new Error('User not found');
    }

    return user
  },
}
