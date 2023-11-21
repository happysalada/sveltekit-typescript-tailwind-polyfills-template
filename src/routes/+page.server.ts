import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { adminNotification, emailNotification } from '$lib/utils';
import { env } from '$env/dynamic/private';

const contactSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  // phone: z.string().min(2).refine(phone => parsePhoneNumber(phone).valid),
  phone: z.string().min(6),
  message: z.string()
});

export const load = (async () => {
  const contactForm = await superValidate(contactSchema);

  return { contactForm };
}) satisfies PageServerLoad;

export const actions = {
  createContact: async ({ request, fetch, locals }) => {
    const form = await superValidate(request, contactSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const message = `from: ${form.data.first_name} ${form.data.last_name} ${form.data.phone} ${form.data.email} message: ${form.data.message}`;
      const admin_notification_promise = await adminNotification({
        topic: 'brocop_new_contact',
        title: `New contact request`,
        tags: 'loudspeaker',
        message,
        url: env.NTFY_URL,
        fetch
      });

      const email_notification_promise = emailNotification({
        subject: 'new contact',
        content: `new contact `,
        fetch,
        logger: locals.logger,
        resendApiKey: env.RESEND_API_KEY,
        email: form.data.email,
      });
      await Promise.allSettled([email_notification_promise, admin_notification_promise])

    } catch (e) {
      locals.logger.error({ message: "error submitting contact info", error: (e as Error).toString(), form })
      throw error(500, 'An error occured, please try again later');
    }
  }
} satisfies Actions;
