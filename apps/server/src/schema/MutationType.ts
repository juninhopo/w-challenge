import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { messageMutations } from '../modules/message/mutations/messageMutations';
import userMutations from '../modules/user/mutations/index'

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...messageMutations,
    ...userMutations,
	}),
});
