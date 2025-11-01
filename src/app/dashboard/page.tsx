'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <main className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p>You are logged in as <b>{user?.email}</b>.</p>
      <button
        onClick={signOut}
        className="p-2 rounded bg-black text-white"
      >
        Sign out
      </button>
    </main>
  );
}
