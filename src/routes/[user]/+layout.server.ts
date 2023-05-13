import type { PageServerLoad } from './$types';
import { fail, redirect } from "@sveltejs/kit";
import Surreal from "surrealdb.js";
import { TEST_USER } from '$lib/constants';

export const load = (async ({ cookies, platform }) => {

  // DEV shortcut, remove before going to prod
  return { user: TEST_USER }

  const user_id: string = cookies.get('user_id');
  const jwt: string = cookies.get('jwt')
  if (!user_id || !jwt) {
    throw redirect(302, "/signin");
  }

  if (!platform?.env?.PUBLIC_SURREAL_URL) {
    return fail(500, { error: "missing env vars" });
  }

  const db = new Surreal(`${platform.env.PUBLIC_SURREAL_URL}/rpc`);
  try {
    await db.authenticate(jwt);
    let user = await db.select(user_id);
    return { user }
  } catch (e) {
    console.log(e)
    throw redirect(302, "/signin");
  }
}) satisfies PageServerLoad;
