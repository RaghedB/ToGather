import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Creates a Supabase client for server-side use (RSC-safe).
 * Uses read-only cookies() store from Next.js to fetch the session.
 */
export function supabaseServer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cookieStore: any = cookies(); // casting is safe here

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // ✅ Valid on server: reads session cookie
          return cookieStore.get?.(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // ❌ No-op on server: cookies() is read-only
        },
        remove(_name: string, _options: CookieOptions) {
          // ❌ No-op on server
        },
      },
    }
  );
}
