import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate, setError } from 'sveltekit-superforms/server';
import Surreal from 'surrealdb.js';
import { parsePhoneNumber } from 'awesome-phonenumber';

import { ONE_DAY } from '$lib/constants';
import { env } from '$env/dynamic/private';
// import { whatsappNotification, emailNotification, adminNotification } from 'utils';
// import { fromSignup as whatsappFromSignup } from '$lib/notifications/whatsapp';
// import { fromSignup as emailFromSignup } from '$lib/notifications/emails/from_signup';

const schema = z.object({
  name: z.string().min(1),
  phone: z
    .string()
    .min(2)
    .refine((phone) => parsePhoneNumber(phone).valid),
  email: z.string().email(),
  password: z.string().min(5),
  passwordConfirmation: z.string(),
  referralUser: z.string().optional(),
  terms: z
    .boolean()
    .refine((value) => value === true, { message: 'Debes aceptar los T&C para continuar' })
});

export const load = (async () => {
  const form = await superValidate(schema);

  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, cookies, url, locals }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const db = new Surreal();
    await db.connect(`${env.SURREAL_URL}/rpc`)

    try {
      let jwt = await db.signup({
        namespace: env.SURREAL_NAMESPACE,
        database: env.SURREAL_DATABASE,
        scope: 'end_user',
        name: form.data.name.trim(),
        phone: form.data.phone,
        email: form.data.email.trim(),
        password: form.data.password.trim()
      });
      // TODO set secure to true the future
      cookies.set('jwt', jwt, { httpOnly: true, sameSite: 'strict', maxAge: ONE_DAY });
      const [[user]]: [[User]] = await db.query(`
        SELECT * FROM user WHERE email = $email;
      `, {
        email: form.data.email,
      });
      cookies.set('user_id', user.id, { httpOnly: true, sameSite: 'strict', maxAge: ONE_DAY });
      // const admin_notification_promise = adminNotification({
      //   topic: 'brocop_signup',
      //   title: `New Signup!`,
      //   tags: 'partying_face,chocolate_bar,rocket',
      //   message: ` ${form.data.name} ${form.data.phone} ${form.data.email}`,
      //   url: env.NTFY_URL,
      //   fetch
      // });
      // const { subject, content } = emailFromSignup({ provider_name: provider?.name })
      // const email_notification_promise = emailNotification({
      //   subject,
      //   content,
      //   fetch,
      //   logger: locals.logger,
      //   resendApiKey: env.RESEND_API_KEY,
      //   email: form.data.email,
      // });
      // await Promise.allSettled([whatsapp_notification_promise, email_notification_promise, admin_notification_promise])
    } catch (e) {
      locals.logger.error({
        error: (e as Error).toString(), message: "failure to signup",
        name: form.data.name.trim(),
        phone: form.data.phone,
        email: form.data.email.trim(),
      });
      // assume all authentication errors are a failed email or phone unique constraint validation
      setError(form, 'email', 'Email already in use');
      setError(form, 'phone', 'Phone number already in use');
      return fail(400, { form });
    }
  }
} satisfies Actions;

