import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate, setError } from 'sveltekit-superforms/server';
import Surreal from 'surrealdb.js';

import { ONE_DAY } from '$lib/constants';
import { env } from '$env/dynamic/private';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  from: z.string()
});

export const load = (async ({ cookies }) => {
  const form = await superValidate(schema);

  const user_id = cookies.get('user_id');
  const jwt = cookies.get('jwt');
  if (user_id && jwt) {
    const db = new Surreal();
    await db.connect(`${env.SURREAL_URL}/rpc`);
    try {
      await db.authenticate(jwt);
      // the jwt is valid, but maybe the user has been deleted
      let [user] = await db.select<User>(user_id);
      if (!user) {
        return { form };
      }
    } catch (e) {
      console.log(e);
      return { form };
    }
  }

  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, cookies, url }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const db = new Surreal();
    await db.connect(`${env.SURREAL_URL}/rpc`)
    try {
      let jwt = await db.signin({
        namespace: env.SURREAL_NAMESPACE,
        database: env.SURREAL_DATABASE,
        scope: 'end_user',
        email: form.data.email.trim(),
        password: form.data.password.trim()
      });
      // TODO set secure to true the future
      cookies.set('jwt', jwt, { httpOnly: true, sameSite: 'lax', maxAge: ONE_DAY });
      const [[user]]: [[User]] = await db.query(`SELECT * FROM user WHERE email = $email`, {
        email: form.data.email
      });
      cookies.set('user_id', user.id, { httpOnly: true, sameSite: 'lax', maxAge: ONE_DAY });
    } catch (e) {
      console.log(e);
      setError(form, 'email', 'Invalid email password combination');
      setError(form, 'password', 'Invalid email password combination');
      return fail(400, { form });
    }
  }
} satisfies Actions;

