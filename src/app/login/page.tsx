'use client';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    setBusy(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the sign-in link.');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    alert('Signed out');
  };

  return (
    <main className="p-6 max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>

      <form onSubmit={sendMagicLink} className="space-y-2">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full p-2 rounded bg-black text-white"
        >
          {busy ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      <button onClick={signOut} className="w-full p-2 rounded border">
        Sign out
      </button>
    </main>
  );
}
