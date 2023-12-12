import { redirect, type Handle, error, type HandleServerError } from '@sveltejs/kit';
import { extract_log_params } from '$lib/utils';
import { env } from '$env/dynamic/private';
import Surreal from 'surrealdb.js';
import { serverLogger } from '$lib/logger';

export const handleError: HandleServerError = async ({ error, event }) => {
  const errorId = crypto.randomUUID();

  event.locals.error = error?.toString() || undefined;
  //@ts-ignore
  event.locals.errorStackTrace = error?.stack || undefined;
  event.locals.errorId = errorId;
  let status = error?.toString()?.includes("Not found") ? 404 : 500;
  let req_params = extract_log_params({ status }, event);
  const message = status == 404 ? 'Page not found' : 'An unexpected error occurred.';
  serverLogger().error({ ...req_params, message });

  return {
    message,
    errorId
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  const startTimer = Date.now();
  event.locals.startTimer = startTimer;

  const user_id: string | undefined = event.cookies.get('user_id');
  event.locals.user_id = user_id

  const logger = serverLogger();
  event.locals.logger = logger;

  if (event.route.id == '/api/logs') {
    if (!user_id) throw error(400)
    return await resolve(event);
  }

  if (event.route.id?.startsWith('/(protected)')) {
    const redirect_url = `/signin?from=${event.url.pathname}`;
    const jwt: string | undefined = event.cookies.get('jwt');
    if (!user_id || !jwt) throw redirect(302, redirect_url);
    const db = new Surreal();
    // TODO wrap in try catch
    await db.connect(`${env.SURREAL_URL}/rpc`, {
      namespace: env.SURREAL_NAMESPACE || '',
      database: env.SURREAL_DATABASE || '',
    });
    const authenticated = await db.authenticate(jwt).then(() => true)
      .catch((e) => {
        logger.error({ error: (e as Error).toString(), message: "authentication failure", route: event.route })
        return false
      })
    if (!authenticated) throw redirect(303, redirect_url);
    const [[user]]: [[User]] = await db.query(
      `SELECT * FROM $user_id;`, { user_id }
    )
    if (!user) {
      event.cookies.delete('jwt');
      event.cookies.delete('user_id');
      logger.info({ message: "user_missing", user_id, routes: event.route })
      throw redirect(303, redirect_url);
    }
    event.locals.user = user
    event.locals.surreal = db;
  }

  const response = await resolve(event);
  const request_params = extract_log_params({ status: response.status }, event);
  logger.info({ message: "Response", ...request_params })
  return response;
};
