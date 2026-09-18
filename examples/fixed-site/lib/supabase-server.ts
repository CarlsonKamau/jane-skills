// Server-side client bound to the request's cookies. Stub for the demo.
export async function createServerClient() {
  return { from: (_t: string) => ({ select: async (_c: string) => ({ data: [] as any[] }) }) };
}
