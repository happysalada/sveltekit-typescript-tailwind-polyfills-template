import type { HandleClientError } from '@sveltejs/kit';
import { browserLogger } from '$lib/logger';

export const handleError: HandleClientError = async ({ error }) => {
  const errorId = crypto.randomUUID();

  const errorMessage = error?.toString() || undefined;
  // @ts-ignore
  const errorStackTrace = error?.stack || undefined;
  const message = 'An unexpected error occurred.';
  browserLogger.error({ message, errorMessage, errorStackTrace, errorId })

  return {
    message,
    errorId
  };
};
