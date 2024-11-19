import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { messageMutations } from '../modules/message/mutations/messageMutations';
import { userMutations } from '../modules/mutations/user/userMutations';

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...messageMutations,
    ...userMutations,
	}),
});
