import pino from 'pino';
import type { LogEvent } from 'pino';

export const browserLogger = pino({
  browser: {
    transmit: {
      level: 'info',
      send: async function(level: string, logEvent: LogEvent) {
        const res = await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ level, timestamp: logEvent.ts, ...logEvent.messages[0], external_service: "brocop" }),
        });
        if (!res.ok) {
          // todo: we likely never see this but I don't have a better solution for now
          console.error('Failed to log:', logEvent);
        }
      },
    },
  },
});

export const serverLogger = () => pino();
