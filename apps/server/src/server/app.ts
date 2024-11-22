import { getUser } from './../auth';
import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import { graphqlHTTP } from 'koa-graphql';
import Router from 'koa-router';
import logger from 'koa-logger';
import { getGraphQLParameters, processRequest, renderGraphiQL, sendResult, shouldRenderGraphiQL } from 'graphql-helix';
import { schema } from '../schema/schema';
import { getContext } from './getContext';
import { createWebsocketMiddleware } from './websocketMiddleware';
import { config } from '../config';

const app = new Koa();

app.use(cors({ origin: '*' }));
app.use(logger());
app.use(
	bodyParser({
		onerror(err, ctx) {
			ctx.throw(err, 422);
		},
	})
);

app.use(createWebsocketMiddleware());

export const setCookie = (context: Context) => (cookieName: string, token: string) => {
  // const domain = null;
  //
  // const secure = process.env.NODE_ENV !== 'development';
  // const sameSite = 'None'; // Lax | None
  //
  // const options = {
  //   httpOnly: true,
  //   overwrite: true,
  //   maxAge,
  //   secure,
  //   domain,
  //   signed: false,
  //   sameSite,
  // };

  const options = {
    httpOnly: true,
    secure: config.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
  };

  context.cookies.set(cookieName, token, options);
};

const routes = new Router();

// routes.all('/graphql/ws', wsServer);

// routes.all(
// 	'/graphql',
// 	graphqlHTTP(() => ({
// 		schema,
// 		graphiql: true,
// 		context: getContext(),
// 	}))
// );

routes.all(
	'/graphql', async ctx => {
  const { user } = await getUser(ctx.header.authorization);
  const request = {
    body: ctx.request.body,
    headers: ctx.req.headers,
    method: ctx.request.method,
    query: ctx.request.query,
  };

  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL({});
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => {
        return getContext({
          koaContext: ctx,
          user,
          setCookie: setCookie(ctx),
        });
      },
    });

    ctx.respond = false;
    sendResult(result, ctx.res);
  }
});

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
