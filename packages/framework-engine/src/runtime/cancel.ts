/**
 * `stream` as its reader reads it, with `cancelled` told first when that
 * reader gives up — a visitor who left, a navigation overtaken — before the
 * cancellation reaches the render writing into `stream`. A render that is
 * cancelled reports everything it was still rendering as failed, with the
 * reason the host gave, and only what is told first can tell that apart from
 * a page that failed.
 */
export const noticeCancel = <T>(
  stream: ReadableStream<T>,
  cancelled: (reason: unknown) => void,
): ReadableStream<T> => {
  const reader = stream.getReader();
  return new ReadableStream<T>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) controller.close();
      else controller.enqueue(value);
    },
    cancel(reason) {
      cancelled(reason);
      return reader.cancel(reason);
    },
  });
};
