import { AppContext } from '../../app/context/appContext';
import { Next } from 'koa';

export function handlerFactory(handler: (appContext: AppContext) => Promise<void>): (ctx: AppContext, next: Next) => Promise<void> {
  return async (ctx: AppContext, next) => {
    await handler(ctx);
    await next();
  };
}
