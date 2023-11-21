import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { verifyEmail } from '@devmehq/email-validator-js';

export const POST = (async ({ request }) => {
  const { emailAddress } = await request.json();

  const { validFormat, validSmtp, validMx } = await verifyEmail({ emailAddress, verifyMx: true, verifySmtp: true });

  return json({ validFormat, validMx, validSmtp }, { status: 201 });
}) satisfies RequestHandler;
