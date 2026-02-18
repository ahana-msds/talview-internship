import * as Sentry from '@sentry/react';

/**
 * traceApiOperation: Creates a Sentry span for an API operation.
 * Matches the pattern used in sentry-lab-main.
 */
export const traceApiOperation = <T>(
    operationName: string,
    callback: (span: Sentry.Span | undefined) => T,
): T => {
    const spanName = `API: ${operationName || 'unknown_operation'}`;

    return Sentry.startNewTrace(() => {
        return Sentry.startSpan({ name: spanName, op: 'http.client' }, (span) => {
            return callback(span);
        });
    });
};
