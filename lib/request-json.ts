export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readJsonObject(request: Request, maxBytes: number) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        void reader.cancel().catch(() => {});
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
    const body: unknown = JSON.parse(text + decoder.decode());
    return isJsonObject(body) ? body : null;
  } catch {
    void reader.cancel().catch(() => {});
    return null;
  } finally {
    reader.releaseLock();
  }
}
