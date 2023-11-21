import type { RequestHandler } from './$types';

export const POST = (async ({ request, locals }) => {

  const json = await request.json()
  locals.logger.error(json)

  return new Response();
}) satisfies RequestHandler;
