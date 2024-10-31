import { GraphQLObjectType, GraphQLString } from 'graphql';

import { messageConnectionField } from '../modules/message/messageFields';
import greetUser from '../modules/queries/greetUser';

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
    }
	}),
});
