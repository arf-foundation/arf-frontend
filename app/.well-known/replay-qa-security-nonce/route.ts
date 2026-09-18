export const dynamic = "force-static";

const NONCE = "loopqa-sec-YvxrSOaOk5PlKA3AuBgsuWxarGiSj3qxfsM394pOwow";

export function GET() {
  return new Response(NONCE, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
