/**
 * JSON-LD is injected per page from the server so crawlers read it without executing
 * anything. One component keeps the `dangerouslySetInnerHTML` usage in a single audited
 * place — payloads are always built by the typed helpers in src/lib/seo.ts, never by
 * interpolating user input.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
