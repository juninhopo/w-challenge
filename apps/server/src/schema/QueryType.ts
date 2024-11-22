import { GraphQLObjectType, GraphQLString } from 'graphql';
import { messageConnectionField } from '../modules/message/messageFields';
import greetUser from '../modules/queries/greetUser';
import { getUser } from '../modules/queries/user/get/getUser';

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		...messageConnectionField('messages'),
		hello: {
			type: GraphQLString,
			resolve() {
				return 'Hello, world!';
			},
		},
    greet: {
      type: GraphQLString,
      args: {
        name: { type: GraphQLString },
      },
      resolve: greetUser,
    },
    getUser,
	}),
});
