export const extract_log_params = ({ status }: { status: number }, event: any) => {
  const level = status == 404 ? 'warning' : ((status >= 500) ? 'error' : 'info');
  const error = event?.locals?.error || undefined;
  const errorId = event?.locals?.errorId || undefined;
  const errorStackTrace = event?.locals?.errorStackTrace || undefined;
  // doesn't work with prerendering
  // const urlParams = Object.fromEntries(event?.url?.searchParams);

  let referer = event.request.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererHostname = refererUrl.hostname;
      if (refererHostname === 'localhost' || refererHostname.includes('brocop.com')) {
        referer = refererUrl.pathname;
      }
    } catch (e) {
      // url is not in the shape of https:// or http:// so just keep as is
    }
  } else {
    referer = undefined;
  }

  return {
    method: event.request.method,
    path: event.url.pathname,
    status,
    timeInMs: Date.now() - event?.locals?.startTimer,
    level,
    ...(event.locals?.user ? { user: event.locals.user.email } : {}),
    ...(event.locals?.user_id ? { user_id: event.locals.user_id } : {}),
    ...(error && status != 404 ? { error } : {}),
    ...(errorId ? { errorId } : {}),
    ...(errorStackTrace && status != 404 ? { errorStackTrace } : {}),
    // ...(Object.keys(urlParams).length !== 0 ? { urlParams } : {}),
    ...(referer ? { referer } : {})
  }
}

export const adminNotification = async ({
  topic,
  title,
  tags,
  message,
  fetch,
  url
}: {
  topic: string;
  title: string;
  tags: string;
  message: string;
  fetch: any;
  url: any;
}) => url ?
    await fetch(`${url}/${topic}`, {
      method: 'POST', // PUT works too
      headers: {
        Title: title,
        Tags: tags
      },
      body: message
    }) : Promise.resolve(true)

export const emailNotification = async ({
  resendApiKey,
  subject,
  content,
  email,
  fetch,
  logger,
}: {
  subject: string;
  content: string;
  resendApiKey: string | undefined;
  email: string;
  fetch: any;
  logger: any;
}) => {
  if (!resendApiKey) return
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'admin@brocop.com',
        to: email,
        subject,
        html: content,
      })
    });

    const json = await res.json();
    logger.info({ message: "email notification response", email, subject, json })
    return json;
  } catch (e) {
    logger.error({ error: (e as Error).toString(), message: "failure to send email notification", email })
  }
};

